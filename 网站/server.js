const express = require('express');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

// 获取本机IP地址
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

// 中间件
app.use(express.static('.'));
app.use(express.json());

// CORS中间件
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// 路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API路由 - 模拟DeepSeek API
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    
    // 模拟AI回复
    const responses = [
        "亲爱的，我能感受到你想要分享的心情。虽然我现在处于离线模式，但我依然能够感受到你的情感。每一个字都承载着你的心情，我会用心去理解。",
        "我在这里陪伴着你，虽然暂时无法使用网络功能，但我的关怀是真实的。生活中的每一个时刻都有它的意义，无论是快乐还是悲伤，都是我们成长的一部分。",
        "亲爱的，虽然我现在处于离线模式，但我依然能够感受到你的情感。每一个字都承载着你的心情，我会用心去理解。"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setTimeout(() => {
        res.json({
            success: true,
            response: randomResponse,
            timestamp: new Date().toISOString()
        });
    }, 1000); // 模拟网络延迟
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 启动服务器
const localIP = getLocalIP();

app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🌌 Aurora 本地服务器启动成功！');
    console.log('='.repeat(60));
    console.log(`📱 本机访问: http://localhost:${PORT}`);
    console.log(`🌐 局域网访问: http://${localIP}:${PORT}`);
    console.log('='.repeat(60));
    console.log('📋 使用说明:');
    console.log('1. 本机访问：在浏览器中打开上面的本机地址');
    console.log('2. 局域网访问：其他设备连接同一WiFi后访问局域网地址');
    console.log('3. 按 Ctrl+C 停止服务器');
    console.log('='.repeat(60));
    
    // 自动打开浏览器
    const { exec } = require('child_process');
    exec(`open http://localhost:${PORT}`, (error) => {
        if (error) {
            console.log('💡 请手动在浏览器中打开上述地址');
        }
    });
});
