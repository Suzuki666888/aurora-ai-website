"""
Aurora情感分析器
多模态情感计算的核心实现
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
import numpy as np
from dataclasses import dataclass
import structlog

from .text_processor import TextProcessor
from .audio_processor import AudioProcessor
from .visual_processor import VisualProcessor
from .fusion_engine import FusionEngine

logger = structlog.get_logger()


@dataclass
class EmotionResult:
    """情感分析结果"""
    emotion: str
    intensity: float
    confidence: float
    reasoning: str
    secondary_emotions: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None


class EmotionAnalyzer:
    """多模态情感分析器"""
    
    def __init__(
        self,
        text_processor: TextProcessor,
        audio_processor: AudioProcessor,
        visual_processor: VisualProcessor,
        fusion_engine: FusionEngine
    ):
        self.text_processor = text_processor
        self.audio_processor = audio_processor
        self.visual_processor = visual_processor
        self.fusion_engine = fusion_engine
        
        # 情感类别映射
        self.emotion_mapping = {
            'joy': '快乐',
            'sadness': '悲伤',
            'anger': '愤怒',
            'fear': '恐惧',
            'surprise': '惊讶',
            'disgust': '厌恶',
            'neutral': '中性',
            'anxiety': '焦虑',
            'calm': '平静',
            'excitement': '兴奋',
            'frustration': '沮丧',
            'contentment': '满足',
            'loneliness': '孤独',
            'love': '爱',
            'hope': '希望'
        }
        
        # 情感强度阈值
        self.intensity_thresholds = {
            'low': 0.3,
            'medium': 0.6,
            'high': 0.8
        }
    
    async def load_models(self):
        """加载所有模型"""
        try:
            logger.info("开始加载情感分析模型...")
            
            # 并行加载所有处理器
            await asyncio.gather(
                self.text_processor.load_models(),
                self.audio_processor.load_models(),
                self.visual_processor.load_models(),
                self.fusion_engine.initialize()
            )
            
            logger.info("情感分析模型加载完成")
            
        except Exception as e:
            logger.error("模型加载失败", error=str(e))
            raise
    
    async def analyze(
        self,
        text: str,
        context: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None
    ) -> EmotionResult:
        """
        执行多模态情感分析
        
        Args:
            text: 输入文本
            context: 上下文信息
            user_id: 用户ID
            
        Returns:
            EmotionResult: 情感分析结果
        """
        try:
            logger.info("开始多模态情感分析", 
                       userId=user_id, 
                       textLength=len(text))
            
            # 1. 文本情感分析
            text_result = await self._analyze_text(text, context)
            
            # 2. 音频情感分析（如果有音频数据）
            audio_result = None
            if context and 'audio_data' in context:
                audio_result = await self._analyze_audio(context['audio_data'])
            
            # 3. 视觉情感分析（如果有视觉数据）
            visual_result = None
            if context and 'visual_data' in context:
                visual_result = await self._analyze_visual(context['visual_data'])
            
            # 4. 多模态融合
            fusion_result = await self.fusion_engine.fuse_modalities(
                text_result=text_result,
                audio_result=audio_result,
                visual_result=visual_result,
                context=context
            )
            
            # 5. 生成最终结果
            final_result = await self._generate_final_result(
                fusion_result, text, context, user_id
            )
            
            logger.info("多模态情感分析完成", 
                       userId=user_id,
                       emotion=final_result.emotion,
                       confidence=final_result.confidence)
            
            return final_result
            
        except Exception as e:
            logger.error("情感分析失败", error=str(e), userId=user_id)
            raise
    
    async def _analyze_text(
        self, 
        text: str, 
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """分析文本情感"""
        try:
            # 使用文本处理器进行深度语义分析
            result = await self.text_processor.analyze(text, context)
            
            logger.debug("文本情感分析完成", 
                        emotion=result.get('emotion'),
                        confidence=result.get('confidence'))
            
            return result
            
        except Exception as e:
            logger.error("文本情感分析失败", error=str(e))
            # 返回默认结果
            return {
                'emotion': 'neutral',
                'intensity': 0.5,
                'confidence': 0.3,
                'reasoning': '文本分析失败，使用默认结果'
            }
    
    async def _analyze_audio(
        self, 
        audio_data: bytes
    ) -> Dict[str, Any]:
        """分析音频情感"""
        try:
            # 使用音频处理器分析语音情感
            result = await self.audio_processor.analyze(audio_data)
            
            logger.debug("音频情感分析完成", 
                        emotion=result.get('emotion'),
                        confidence=result.get('confidence'))
            
            return result
            
        except Exception as e:
            logger.error("音频情感分析失败", error=str(e))
            return None
    
    async def _analyze_visual(
        self, 
        visual_data: bytes
    ) -> Dict[str, Any]:
        """分析视觉情感"""
        try:
            # 使用视觉处理器分析面部表情
            result = await self.visual_processor.analyze(visual_data)
            
            logger.debug("视觉情感分析完成", 
                        emotion=result.get('emotion'),
                        confidence=result.get('confidence'))
            
            return result
            
        except Exception as e:
            logger.error("视觉情感分析失败", error=str(e))
            return None
    
    async def _generate_final_result(
        self,
        fusion_result: Dict[str, Any],
        text: str,
        context: Optional[Dict[str, Any]],
        user_id: Optional[str]
    ) -> EmotionResult:
        """生成最终的情感分析结果"""
        try:
            # 提取融合结果
            emotion = fusion_result.get('emotion', 'neutral')
            intensity = fusion_result.get('intensity', 0.5)
            confidence = fusion_result.get('confidence', 0.5)
            reasoning = fusion_result.get('reasoning', '基于多模态分析')
            
            # 生成次要情感
            secondary_emotions = self._extract_secondary_emotions(fusion_result)
            
            # 生成元数据
            metadata = {
                'text_length': len(text),
                'has_context': context is not None,
                'user_id': user_id,
                'analysis_timestamp': '2024-01-01T00:00:00Z',
                'model_version': '1.0.0'
            }
            
            # 生成推理过程
            detailed_reasoning = self._generate_detailed_reasoning(
                fusion_result, text, context
            )
            
            return EmotionResult(
                emotion=emotion,
                intensity=intensity,
                confidence=confidence,
                reasoning=detailed_reasoning,
                secondary_emotions=secondary_emotions,
                metadata=metadata
            )
            
        except Exception as e:
            logger.error("生成最终结果失败", error=str(e))
            raise
    
    def _extract_secondary_emotions(
        self, 
        fusion_result: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """提取次要情感"""
        try:
            secondary_emotions = []
            
            # 从融合结果中提取次要情感
            if 'secondary_emotions' in fusion_result:
                for emotion_data in fusion_result['secondary_emotions']:
                    secondary_emotions.append({
                        'emotion': emotion_data.get('emotion'),
                        'intensity': emotion_data.get('intensity', 0.0),
                        'confidence': emotion_data.get('confidence', 0.0)
                    })
            
            return secondary_emotions
            
        except Exception as e:
            logger.error("提取次要情感失败", error=str(e))
            return []
    
    def _generate_detailed_reasoning(
        self,
        fusion_result: Dict[str, Any],
        text: str,
        context: Optional[Dict[str, Any]]
    ) -> str:
        """生成详细的分析推理过程"""
        try:
            reasoning_parts = []
            
            # 基础推理
            base_reasoning = fusion_result.get('reasoning', '基于多模态情感分析')
            reasoning_parts.append(base_reasoning)
            
            # 文本分析推理
            if 'text_analysis' in fusion_result:
                text_reasoning = fusion_result['text_analysis'].get('reasoning')
                if text_reasoning:
                    reasoning_parts.append(f"文本分析：{text_reasoning}")
            
            # 音频分析推理
            if 'audio_analysis' in fusion_result:
                audio_reasoning = fusion_result['audio_analysis'].get('reasoning')
                if audio_reasoning:
                    reasoning_parts.append(f"语音分析：{audio_reasoning}")
            
            # 视觉分析推理
            if 'visual_analysis' in fusion_result:
                visual_reasoning = fusion_result['visual_analysis'].get('reasoning')
                if visual_reasoning:
                    reasoning_parts.append(f"视觉分析：{visual_reasoning}")
            
            # 上下文推理
            if context:
                context_reasoning = self._analyze_context_influence(context)
                if context_reasoning:
                    reasoning_parts.append(f"上下文影响：{context_reasoning}")
            
            return "；".join(reasoning_parts)
            
        except Exception as e:
            logger.error("生成推理过程失败", error=str(e))
            return "基于多模态情感分析"
    
    def _analyze_context_influence(
        self, 
        context: Dict[str, Any]
    ) -> str:
        """分析上下文对情感的影响"""
        try:
            influences = []
            
            # 分析历史消息
            if 'previous_messages' in context:
                prev_messages = context['previous_messages']
                if len(prev_messages) > 0:
                    influences.append(f"基于{len(prev_messages)}条历史消息的上下文")
            
            # 分析用户档案
            if 'user_profile' in context:
                profile = context['user_profile']
                if 'preferred_style' in profile:
                    influences.append(f"考虑用户偏好风格：{profile['preferred_style']}")
            
            # 分析时间因素
            if 'timestamp' in context:
                influences.append("考虑时间因素对情感状态的影响")
            
            return "；".join(influences) if influences else ""
            
        except Exception as e:
            logger.error("分析上下文影响失败", error=str(e))
            return ""
    
    def get_emotion_intensity_level(self, intensity: float) -> str:
        """获取情感强度等级"""
        if intensity < self.intensity_thresholds['low']:
            return 'low'
        elif intensity < self.intensity_thresholds['medium']:
            return 'medium'
        elif intensity < self.intensity_thresholds['high']:
            return 'high'
        else:
            return 'very_high'
    
    def get_emotion_chinese_name(self, emotion: str) -> str:
        """获取情感的中文名称"""
        return self.emotion_mapping.get(emotion, emotion)
    
    async def batch_analyze(
        self, 
        texts: List[str], 
        contexts: Optional[List[Dict[str, Any]]] = None
    ) -> List[EmotionResult]:
        """批量情感分析"""
        try:
            logger.info("开始批量情感分析", textCount=len(texts))
            
            # 并行处理所有文本
            tasks = []
            for i, text in enumerate(texts):
                context = contexts[i] if contexts and i < len(contexts) else None
                task = self.analyze(text, context)
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # 处理异常结果
            processed_results = []
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    logger.error("批量分析中单个文本失败", 
                               textIndex=i, error=str(result))
                    # 创建默认结果
                    processed_results.append(EmotionResult(
                        emotion='neutral',
                        intensity=0.5,
                        confidence=0.3,
                        reasoning='分析失败，使用默认结果'
                    ))
                else:
                    processed_results.append(result)
            
            logger.info("批量情感分析完成", 
                       textCount=len(texts),
                       successCount=len([r for r in results if not isinstance(r, Exception)]))
            
            return processed_results
            
        except Exception as e:
            logger.error("批量情感分析失败", error=str(e))
            raise
