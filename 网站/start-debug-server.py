#!/usr/bin/env python3
"""
Aurora对话调试服务器
用于本地测试对话功能
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def start_server(port=8000):
    """启动本地HTTP服务器"""
    
    # 切换到网站目录
    website_dir = Path(__file__).parent
    os.chdir(website_dir)
    
    # 创建HTTP服务器
    handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 Aurora调试服务器已启动!")
            print(f"📁 服务目录: {website_dir}")
            print(f"🌐 访问地址: http://localhost:{port}")
            print(f"💬 对话页面: http://localhost:{port}/dialogue.html")
            print(f"🔧 调试页面: http://localhost:{port}/debug-dialogue.html")
            print(f"🧪 连接测试: http://localhost:{port}/test-deepseek-connection.html")
            print(f"📊 状态检查: http://localhost:{port}/deepseek-diagnostic.html")
            print("\n" + "="*60)
            print("🔍 调试步骤:")
            print("1. 首先访问调试页面检查系统状态")
            print("2. 然后测试API连接")
            print("3. 最后测试对话功能")
            print("="*60)
            print(f"\n按 Ctrl+C 停止服务器")
            
            # 自动打开调试页面
            try:
                webbrowser.open(f'http://localhost:{port}/debug-dialogue.html')
            except:
                pass
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ 端口 {port} 已被占用，尝试使用端口 {port + 1}")
            start_server(port + 1)
        else:
            print(f"❌ 启动服务器失败: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
        sys.exit(0)

if __name__ == "__main__":
    print("🌌 Aurora AI 对话调试工具")
    print("=" * 40)
    
    # 检查必要文件
    required_files = [
        "dialogue.html",
        "js/deepseek-api.js",
        "debug-dialogue.html",
        "test-deepseek-connection.html"
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print("❌ 缺少必要文件:")
        for file in missing_files:
            print(f"   - {file}")
        print("\n请确保所有文件都在正确的位置")
        sys.exit(1)
    
    print("✅ 所有必要文件都存在")
    print()
    
    # 启动服务器
    start_server()
