#!/usr/bin/env python3
"""
DeepSeek API 代理服务器
解决浏览器跨域问题
"""

from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import json
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# DeepSeek API 配置
DEEPSEEK_API_KEY = 'sk-5786e431682e4229a2e63994d4968f15'
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({
        'status': 'healthy',
        'message': 'DeepSeek API 代理服务器运行正常',
        'api_key': DEEPSEEK_API_KEY[:10] + '...'
    })

@app.route('/api/deepseek/chat', methods=['POST'])
def proxy_chat():
    """代理聊天请求"""
    try:
        # 获取请求数据
        data = request.json
        logger.info(f"收到聊天请求: {data.get('message', '')[:50]}...")
        
        # 验证请求数据
        if not data or 'message' not in data:
            return jsonify({'error': '缺少消息内容'}), 400
        
        # 构建DeepSeek API请求
        deepseek_data = {
            'model': 'deepseek-chat',
            'messages': [
                {
                    'role': 'system',
                    'content': data.get('system_prompt', '你是一个友好的AI助手。')
                },
                {
                    'role': 'user',
                    'content': data['message']
                }
            ],
            'max_tokens': data.get('max_tokens', 1000),
            'temperature': data.get('temperature', 0.7)
        }
        
        # 如果有历史对话，添加到消息中
        if 'history' in data and data['history']:
            for entry in data['history']:
                deepseek_data['messages'].append({
                    'role': 'user',
                    'content': entry.get('userMessage', '')
                })
                deepseek_data['messages'].append({
                    'role': 'assistant',
                    'content': entry.get('auroraResponse', '')
                })
        
        # 发送请求到DeepSeek API
        response = requests.post(
            DEEPSEEK_API_URL,
            headers={
                'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
                'Content-Type': 'application/json'
            },
            json=deepseek_data,
            timeout=30
        )
        
        logger.info(f"DeepSeek API 响应状态: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            reply = result['choices'][0]['message']['content']
            logger.info(f"成功获取回复: {reply[:50]}...")
            
            return jsonify({
                'success': True,
                'reply': reply,
                'usage': result.get('usage', {})
            })
        else:
            error_data = response.json() if response.content else {}
            logger.error(f"DeepSeek API 错误: {error_data}")
            
            return jsonify({
                'success': False,
                'error': error_data.get('error', {}).get('message', '未知错误'),
                'status_code': response.status_code
            }), response.status_code
            
    except requests.exceptions.Timeout:
        logger.error("请求超时")
        return jsonify({
            'success': False,
            'error': '请求超时，请稍后重试'
        }), 408
        
    except requests.exceptions.ConnectionError:
        logger.error("连接错误")
        return jsonify({
            'success': False,
            'error': '网络连接错误，请检查网络'
        }), 503
        
    except Exception as e:
        logger.error(f"未知错误: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'服务器错误: {str(e)}'
        }), 500

@app.route('/api/deepseek/models', methods=['GET'])
def get_models():
    """获取可用模型列表"""
    try:
        response = requests.get(
            'https://api.deepseek.com/v1/models',
            headers={
                'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': '获取模型列表失败'}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 启动 DeepSeek API 代理服务器...")
    print(f"📡 API密钥: {DEEPSEEK_API_KEY[:10]}...")
    print("🌐 服务器地址: http://localhost:5000")
    print("📋 可用端点:")
    print("   - GET  /health - 健康检查")
    print("   - POST /api/deepseek/chat - 聊天代理")
    print("   - GET  /api/deepseek/models - 模型列表")
    print("\n💡 使用方法:")
    print("   1. 启动此服务器: python3 proxy_server.py")
    print("   2. 修改前端代码使用: http://localhost:5000/api/deepseek/chat")
    print("   3. 或者直接访问: http://localhost:5000/health")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
