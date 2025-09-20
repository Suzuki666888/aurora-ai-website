#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Aurora 本地服务器启动脚本
让用户在自己的网络环境中运行Aurora
"""

import http.server
import socketserver
import webbrowser
import socket
import os
import sys
import json
from threading import Timer

class AuroraHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器"""
    
    def end_headers(self):
        # 添加CORS头，允许跨域访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # 处理根路径重定向到index.html
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()
    
    def log_message(self, format, *args):
        # 自定义日志格式
        print(f"[Aurora Server] {format % args}")

def get_local_ip():
    """获取本机IP地址"""
    try:
        # 创建一个socket连接来获取本机IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

def open_browser(url):
    """延迟打开浏览器"""
    webbrowser.open(url)

def start_server(port=8080):
    """启动本地服务器"""
    
    # 获取本机IP
    local_ip = get_local_ip()
    
    # 创建服务器
    handler = AuroraHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print("=" * 60)
            print("🌌 Aurora 本地服务器启动成功！")
            print("=" * 60)
            print(f"📱 本机访问: http://localhost:{port}")
            print(f"🌐 局域网访问: http://{local_ip}:{port}")
            print("=" * 60)
            print("📋 使用说明:")
            print("1. 本机访问：在浏览器中打开上面的本机地址")
            print("2. 局域网访问：其他设备连接同一WiFi后访问局域网地址")
            print("3. 按 Ctrl+C 停止服务器")
            print("=" * 60)
            
            # 延迟2秒后自动打开浏览器
            Timer(2.0, open_browser, [f"http://localhost:{port}"]).start()
            
            # 启动服务器
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ 端口 {port} 已被占用，尝试使用端口 {port + 1}")
            start_server(port + 1)
        else:
            print(f"❌ 启动服务器失败: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 服务器已停止")
        sys.exit(0)

if __name__ == "__main__":
    # 检查Python版本
    if sys.version_info < (3, 6):
        print("❌ 需要Python 3.6或更高版本")
        sys.exit(1)
    
    # 检查是否在正确的目录
    if not os.path.exists("index.html"):
        print("❌ 请在包含index.html的目录中运行此脚本")
        sys.exit(1)
    
    # 启动服务器
    start_server()
