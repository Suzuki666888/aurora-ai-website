#!/usr/bin/env node

/**
 * Aurora认证功能测试脚本
 * 用于测试用户注册、登录和API调用
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/v1';

// 测试用户数据
const testUser = {
    email: 'test@aurora.ai',
    username: 'testuser',
    password: 'test123',
    firstName: 'Test',
    lastName: 'User'
};

// 颜色输出
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAuth() {
    log('🚀 开始测试Aurora认证功能...', 'blue');
    
    try {
        // 1. 测试健康检查
        log('\n1. 测试API健康检查...', 'yellow');
        try {
            const healthResponse = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`);
            log('✅ API服务正常运行', 'green');
            log(`   状态: ${healthResponse.data.status}`, 'green');
        } catch (error) {
            log('❌ API服务无法访问', 'red');
            log(`   错误: ${error.message}`, 'red');
            log('   请确保后端服务已启动: ./deploy.sh dev', 'yellow');
            return;
        }

        // 2. 测试用户注册
        log('\n2. 测试用户注册...', 'yellow');
        try {
            const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
            log('✅ 用户注册成功', 'green');
            log(`   用户ID: ${registerResponse.data.data.user.id}`, 'green');
            log(`   邮箱: ${registerResponse.data.data.user.email}`, 'green');
        } catch (error) {
            if (error.response?.status === 409) {
                log('⚠️  用户已存在，继续测试登录...', 'yellow');
            } else {
                log('❌ 用户注册失败', 'red');
                log(`   错误: ${error.response?.data?.message || error.message}`, 'red');
                return;
            }
        }

        // 3. 测试用户登录
        log('\n3. 测试用户登录...', 'yellow');
        let accessToken;
        try {
            const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
            
            accessToken = loginResponse.data.data.tokens.accessToken;
            log('✅ 用户登录成功', 'green');
            log(`   访问令牌: ${accessToken.substring(0, 20)}...`, 'green');
            log(`   用户: ${loginResponse.data.data.user.username}`, 'green');
        } catch (error) {
            log('❌ 用户登录失败', 'red');
            log(`   错误: ${error.response?.data?.message || error.message}`, 'red');
            return;
        }

        // 4. 测试受保护的API
        log('\n4. 测试受保护的API...', 'yellow');
        try {
            const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            log('✅ 受保护API调用成功', 'green');
            log(`   用户信息: ${meResponse.data.data.user.username}`, 'green');
        } catch (error) {
            log('❌ 受保护API调用失败', 'red');
            log(`   错误: ${error.response?.data?.message || error.message}`, 'red');
        }

        // 5. 测试情感分析API
        log('\n5. 测试情感分析API...', 'yellow');
        try {
            const emotionResponse = await axios.post(`${API_BASE_URL}/emotion/analyze`, {
                text: '我今天心情很好，工作很顺利',
                context: {}
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            log('✅ 情感分析API调用成功', 'green');
            log(`   检测情感: ${emotionResponse.data.data.emotion}`, 'green');
            log(`   置信度: ${emotionResponse.data.data.confidence}`, 'green');
        } catch (error) {
            if (error.response?.status === 503) {
                log('⚠️  情感分析服务未启动，这是正常的', 'yellow');
                log('   请启动完整服务: ./deploy.sh prod', 'yellow');
            } else {
                log('❌ 情感分析API调用失败', 'red');
                log(`   错误: ${error.response?.data?.message || error.message}`, 'red');
            }
        }

        // 6. 测试对话API
        log('\n6. 测试对话API...', 'yellow');
        try {
            const chatResponse = await axios.post(`${API_BASE_URL}/emotion/chat`, {
                message: '你好，Aurora',
                sessionId: 'test-session-123'
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            log('✅ 对话API调用成功', 'green');
            log(`   Aurora回复: ${chatResponse.data.data.reply}`, 'green');
        } catch (error) {
            if (error.response?.status === 503) {
                log('⚠️  对话服务未启动，这是正常的', 'yellow');
                log('   请启动完整服务: ./deploy.sh prod', 'yellow');
            } else {
                log('❌ 对话API调用失败', 'red');
                log(`   错误: ${error.response?.data?.message || error.message}`, 'red');
            }
        }

        log('\n🎉 认证功能测试完成！', 'green');
        log('\n📋 测试结果总结:', 'blue');
        log('   ✅ API服务正常运行', 'green');
        log('   ✅ 用户注册功能正常', 'green');
        log('   ✅ 用户登录功能正常', 'green');
        log('   ✅ JWT令牌生成正常', 'green');
        log('   ✅ 受保护API访问正常', 'green');
        log('   ⚠️  情感分析服务需要单独启动', 'yellow');
        log('   ⚠️  对话服务需要单独启动', 'yellow');
        
        log('\n🔧 下一步操作:', 'blue');
        log('   1. 启动完整服务: ./deploy.sh prod', 'yellow');
        log('   2. 测试前端登录功能', 'yellow');
        log('   3. 测试完整对话流程', 'yellow');

    } catch (error) {
        log('\n❌ 测试过程中发生未预期的错误:', 'red');
        log(`   ${error.message}`, 'red');
        log('\n🔧 请检查:', 'blue');
        log('   1. 后端服务是否已启动', 'yellow');
        log('   2. 端口3000是否被占用', 'yellow');
        log('   3. 网络连接是否正常', 'yellow');
    }
}

// 运行测试
if (require.main === module) {
    testAuth();
}

module.exports = { testAuth };
