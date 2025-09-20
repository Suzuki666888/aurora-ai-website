"""
Aurora情感分析服务
基于多模态情感计算和情感GPT的智能情感分析系统
"""

import asyncio
import logging
import os
from contextlib import asynccontextmanager
from typing import Dict, List, Optional, Any

import uvicorn
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, Field
import structlog

from .models.emotion_analyzer import EmotionAnalyzer
from .models.emotion_gpt import EmotionGPT
from .models.emotion_navigator import EmotionNavigator
from .services.text_processor import TextProcessor
from .services.audio_processor import AudioProcessor
from .services.visual_processor import VisualProcessor
from .services.fusion_engine import FusionEngine
from .utils.logger import setup_logging
from .utils.database import DatabaseManager
from .utils.cache import CacheManager

# 配置日志
setup_logging()
logger = structlog.get_logger()

# 全局变量存储模型
emotion_analyzer: Optional[EmotionAnalyzer] = None
emotion_gpt: Optional[EmotionGPT] = None
emotion_navigator: Optional[EmotionNavigator] = None
text_processor: Optional[TextProcessor] = None
audio_processor: Optional[AudioProcessor] = None
visual_processor: Optional[VisualProcessor] = None
fusion_engine: Optional[FusionEngine] = None
db_manager: Optional[DatabaseManager] = None
cache_manager: Optional[CacheManager] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    global emotion_analyzer, emotion_gpt, emotion_navigator
    global text_processor, audio_processor, visual_processor, fusion_engine
    global db_manager, cache_manager
    
    logger.info("🚀 启动Aurora情感分析服务...")
    
    try:
        # 初始化数据库连接
        db_manager = DatabaseManager()
        await db_manager.connect()
        logger.info("✅ 数据库连接成功")
        
        # 初始化缓存
        cache_manager = CacheManager()
        await cache_manager.connect()
        logger.info("✅ 缓存连接成功")
        
        # 初始化文本处理器
        text_processor = TextProcessor()
        await text_processor.load_models()
        logger.info("✅ 文本处理器初始化完成")
        
        # 初始化音频处理器
        audio_processor = AudioProcessor()
        await audio_processor.load_models()
        logger.info("✅ 音频处理器初始化完成")
        
        # 初始化视觉处理器
        visual_processor = VisualProcessor()
        await visual_processor.load_models()
        logger.info("✅ 视觉处理器初始化完成")
        
        # 初始化融合引擎
        fusion_engine = FusionEngine()
        await fusion_engine.initialize()
        logger.info("✅ 融合引擎初始化完成")
        
        # 初始化情感分析器
        emotion_analyzer = EmotionAnalyzer(
            text_processor=text_processor,
            audio_processor=audio_processor,
            visual_processor=visual_processor,
            fusion_engine=fusion_engine
        )
        await emotion_analyzer.load_models()
        logger.info("✅ 情感分析器初始化完成")
        
        # 初始化情感GPT
        emotion_gpt = EmotionGPT()
        await emotion_gpt.load_models()
        logger.info("✅ 情感GPT初始化完成")
        
        # 初始化情感导航器
        emotion_navigator = EmotionNavigator()
        await emotion_navigator.load_models()
        logger.info("✅ 情感导航器初始化完成")
        
        logger.info("🎉 Aurora情感分析服务启动完成!")
        
    except Exception as e:
        logger.error("❌ 服务启动失败", error=str(e))
        raise
    
    yield
    
    # 清理资源
    logger.info("🔄 正在关闭Aurora情感分析服务...")
    
    if db_manager:
        await db_manager.disconnect()
    if cache_manager:
        await cache_manager.disconnect()
    
    logger.info("✅ Aurora情感分析服务已关闭")


# 创建FastAPI应用
app = FastAPI(
    title="Aurora情感分析服务",
    description="基于多模态情感计算和情感GPT的智能情感分析系统",
    version="1.0.0",
    lifespan=lifespan
)

# 添加中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)


# Pydantic模型定义
class AnalyzeRequest(BaseModel):
    """情感分析请求模型"""
    text: str = Field(..., min_length=1, max_length=10000, description="要分析的文本内容")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="上下文信息")
    userId: Optional[str] = Field(None, description="用户ID")
    timestamp: Optional[str] = Field(None, description="时间戳")


class AnalyzeResponse(BaseModel):
    """情感分析响应模型"""
    emotion: str = Field(..., description="检测到的主要情感")
    intensity: float = Field(..., ge=0, le=1, description="情感强度")
    confidence: float = Field(..., ge=0, le=1, description="置信度")
    reasoning: str = Field(..., description="分析推理过程")
    secondary_emotions: Optional[List[Dict[str, Any]]] = Field(None, description="次要情感")
    metadata: Optional[Dict[str, Any]] = Field(None, description="元数据")


class ChatRequest(BaseModel):
    """对话请求模型"""
    message: str = Field(..., min_length=1, max_length=5000, description="用户消息")
    userId: str = Field(..., description="用户ID")
    sessionId: Optional[str] = Field(None, description="会话ID")
    timestamp: Optional[str] = Field(None, description="时间戳")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="对话上下文")


class ChatResponse(BaseModel):
    """对话响应模型"""
    reply: str = Field(..., description="Aurora的回复")


class NavigateRequest(BaseModel):
    """情感导航请求模型"""
    currentEmotion: str = Field(..., description="当前情感状态")
    targetEmotion: str = Field(..., description="目标情感状态")
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict, description="用户偏好")


class NavigateResponse(BaseModel):
    """情感导航响应模型"""
    path: List[Dict[str, Any]] = Field(..., description="导航路径")
    estimatedTime: int = Field(..., ge=1, description="预计时间（分钟）")
    difficulty: str = Field(..., description="难度等级")
    tips: Optional[List[str]] = Field(None, description="建议")


# 依赖注入
async def get_emotion_analyzer():
    """获取情感分析器实例"""
    if emotion_analyzer is None:
        raise HTTPException(status_code=503, detail="情感分析服务未就绪")
    return emotion_analyzer


async def get_emotion_gpt():
    """获取情感GPT实例"""
    if emotion_gpt is None:
        raise HTTPException(status_code=503, detail="情感GPT服务未就绪")
    return emotion_gpt


async def get_emotion_navigator():
    """获取情感导航器实例"""
    if emotion_navigator is None:
        raise HTTPException(status_code=503, detail="情感导航服务未就绪")
    return emotion_navigator


# API端点
@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {
        "status": "healthy",
        "service": "aurora-emotion-service",
        "version": "1.0.0",
        "timestamp": "2024-01-01T00:00:00Z"
    }


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_emotion(
    request: AnalyzeRequest,
    background_tasks: BackgroundTasks,
    analyzer: EmotionAnalyzer = Depends(get_emotion_analyzer)
):
    """情感分析端点"""
    try:
        logger.info("开始情感分析", 
                   userId=request.userId, 
                   textLength=len(request.text))
        
        # 执行情感分析
        result = await analyzer.analyze(
            text=request.text,
            context=request.context,
            user_id=request.userId
        )
        
        # 异步保存分析结果
        if request.userId:
            background_tasks.add_task(
                save_analysis_result,
                request.userId,
                result,
                request.timestamp
            )
        
        logger.info("情感分析完成", 
                   userId=request.userId,
                   emotion=result.emotion,
                   confidence=result.confidence)
        
        return result
        
    except Exception as e:
        logger.error("情感分析失败", error=str(e), userId=request.userId)
        raise HTTPException(status_code=500, detail=f"情感分析失败: {str(e)}")


@app.post("/chat")
async def chat_with_aurora(
    request: ChatRequest,
    background_tasks: BackgroundTasks,
    analyzer: EmotionAnalyzer = Depends(get_emotion_analyzer),
    gpt: EmotionGPT = Depends(get_emotion_gpt)
):
    """与Aurora对话端点"""
    try:
        logger.info("开始情感对话", 
                   userId=request.userId, 
                   sessionId=request.sessionId)
        
        # 分析用户情感
        emotion_result = await analyzer.analyze(
            text=request.message,
            context=request.context,
            user_id=request.userId
        )
        
        # 生成回复
        chat_result = await gpt.generate_response(
            message=request.message,
            emotion_context=emotion_result,
            user_id=request.userId,
            session_id=request.sessionId
        )
        
        # 异步保存对话记录
        background_tasks.add_task(
            save_chat_record,
            request.userId,
            request.sessionId,
            request.message,
            chat_result.reply,
            emotion_result.emotion,
            request.timestamp
        )
        
        logger.info("情感对话完成", 
                   userId=request.userId,
                   sessionId=request.sessionId,
                   emotionDetected=emotion_result.emotion)
        
        # 直接返回文本回复
        return {"reply": chat_result.reply}
        
    except Exception as e:
        logger.error("情感对话失败", error=str(e), userId=request.userId)
        raise HTTPException(status_code=500, detail=f"对话失败: {str(e)}")


@app.post("/navigate", response_model=NavigateResponse)
async def navigate_emotion(
    request: NavigateRequest,
    navigator: EmotionNavigator = Depends(get_emotion_navigator)
):
    """情感导航端点"""
    try:
        logger.info("开始情感导航", 
                   currentEmotion=request.currentEmotion,
                   targetEmotion=request.targetEmotion)
        
        # 生成导航路径
        navigation_result = await navigator.generate_path(
            current_emotion=request.currentEmotion,
            target_emotion=request.targetEmotion,
            preferences=request.preferences
        )
        
        logger.info("情感导航完成", 
                   pathLength=len(navigation_result.path),
                   estimatedTime=navigation_result.estimatedTime)
        
        return navigation_result
        
    except Exception as e:
        logger.error("情感导航失败", error=str(e))
        raise HTTPException(status_code=500, detail=f"导航失败: {str(e)}")


@app.get("/status")
async def get_emotion_status(
    userId: str,
    timeframe: str = "day"
):
    """获取情感状态端点"""
    try:
        logger.info("获取情感状态", userId=userId, timeframe=timeframe)
        
        # 从数据库获取情感历史
        if db_manager:
            status_data = await db_manager.get_emotion_status(userId, timeframe)
        else:
            # 模拟数据
            status_data = {
                "currentEmotion": "neutral",
                "emotionHistory": [],
                "averageIntensity": 0.5
            }
        
        return status_data
        
    except Exception as e:
        logger.error("获取情感状态失败", error=str(e), userId=userId)
        raise HTTPException(status_code=500, detail=f"获取状态失败: {str(e)}")


# 后台任务函数
async def save_analysis_result(user_id: str, result: AnalyzeResponse, timestamp: str):
    """保存分析结果到数据库"""
    try:
        if db_manager:
            await db_manager.save_emotion_analysis(user_id, result, timestamp)
    except Exception as e:
        logger.error("保存分析结果失败", error=str(e), userId=user_id)


async def save_chat_record(user_id: str, session_id: str, message: str, 
                          reply: str, emotion: str, timestamp: str):
    """保存对话记录到数据库"""
    try:
        if db_manager:
            await db_manager.save_chat_record(user_id, session_id, message, 
                                            reply, emotion, timestamp)
    except Exception as e:
        logger.error("保存对话记录失败", error=str(e), userId=user_id)


if __name__ == "__main__":
    # 启动服务
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
