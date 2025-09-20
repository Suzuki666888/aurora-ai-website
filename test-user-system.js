/**
 * Aurora用户系统测试脚本
 * 测试用户注册、登录、数据管理等功能
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/v1';

// 测试数据
const testUser = {
    email: 'testuser@aurora.ai',
    username: 'testuser123',
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'User'
};

let authToken = null;
let userId = null;

// 测试函数
async function runTests() {
    console.log('🧪 开始测试Aurora用户系统...\n');

    try {
        // 测试1: 用户注册
        await testUserRegistration();
        
        // 测试2: 用户登录
        await testUserLogin();
        
        // 测试3: 获取用户信息
        await testGetUserInfo();
        
        // 测试4: 保存用户数据
        await testSaveUserData();
        
        // 测试5: 添加情感记录
        await testAddEmotionRecord();
        
        // 测试6: 添加对话会话
        await testAddChatSession();
        
        // 测试7: 更新偏好设置
        await testUpdatePreferences();
        
        // 测试8: 更新隐私设置
        await testUpdatePrivacySettings();
        
        // 测试9: 获取用户统计
        await testGetUserStats();
        
        // 测试10: 导出用户数据
        await testExportUserData();
        
        console.log('\n✅ 所有测试通过！用户系统运行正常。');
        
    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
        process.exit(1);
    }
}

// 测试用户注册
async function testUserRegistration() {
    console.log('📝 测试用户注册...');
    
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
        
        if (response.data.success) {
            console.log('✅ 用户注册成功');
            userId = response.data.data.user.id;
        } else {
            throw new Error('注册失败: ' + response.data.message);
        }
    } catch (error) {
        if (error.response && error.response.status === 409) {
            console.log('⚠️  用户已存在，跳过注册测试');
        } else {
            throw error;
        }
    }
}

// 测试用户登录
async function testUserLogin() {
    console.log('🔐 测试用户登录...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
    });
    
    if (response.data.success) {
        authToken = response.data.data.tokens.accessToken;
        console.log('✅ 用户登录成功');
    } else {
        throw new Error('登录失败: ' + response.data.message);
    }
}

// 测试获取用户信息
async function testGetUserInfo() {
    console.log('👤 测试获取用户信息...');
    
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
        console.log('✅ 获取用户信息成功');
    } else {
        throw new Error('获取用户信息失败: ' + response.data.message);
    }
}

// 测试保存用户数据
async function testSaveUserData() {
    console.log('💾 测试保存用户数据...');
    
    const testData = {
        preferences: {
            theme: 'dark',
            language: 'zh-CN',
            notifications: true
        },
        customData: {
            testField: 'testValue'
        }
    };
    
    const response = await axios.post(`${API_BASE_URL}/user/data`, testData, {
        headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
        console.log('✅ 保存用户数据成功');
    } else {
        throw new Error('保存用户数据失败: ' + response.data.message);
    }
}

// 测试添加情感记录
async function testAddEmotionRecord() {
    console.log('❤️ 测试添加情感记录...');
    
    const emotionData = {
        text: '我今天很开心',
        emotion: 'joy',
        intensity: 0.8,
        confidence: 0.9,
        reasoning: '用户表达了积极的情绪',
        secondaryEmotions: ['excitement', 'satisfaction'],
        contextData: { timeOfDay: 'morning' }
    };
    
    const response = await axios.post(`${API_BASE_URL}/user/emotion`, emotionData, {
        headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
        console.log('✅ 添加情感记录成功');
    } else {
        throw new Error('添加情感记录失败: ' + response.data.message);
    }
}

// 测试添加对话会话
async function testAddChatSession() {
    console.log('💬 测试添加对话会话...');
    
    const sessionData = {
        title: '测试对话',
        messages: [
            {
                role: 'user',
                content: '你好，Aurora',
                timestamp: new Date().toISOString()
            },
            {
                role: 'aurora',
                content: '你好！很高兴见到你。',
                timestamp: new Date().toISOString()
            }
        ],
        emotionSummary: {
            dominantEmotion: 'joy',
            intensity: 0.7
        },
        duration: 5
    };
    
    const response = await axios.post(`${API_BASE_URL}/user/chat`, sessionData, {
        headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
        console.log('✅ 添加对话会话成功');
    } else {
        throw new Error('添加对话会话失败: ' + response.data.message);
    }
}

// 测试更新偏好设置
async function testUpdatePreferences() {
    console.log('⚙️ 测试更新偏好设置...');
    
    const preferences = {
        theme: 'light',
        language: 'en-US',
        notifications: false,
        privacy: 'strict'
    };
    
    const response = await axios.put(`${API_BASE_URL}/user/preferences`, preferences, {
        headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
        console.log('✅ 更新偏好设置成功');
    } else {
        throw new Error('更新偏好设置失败: ' + response.data.message);
    }
}

// 测试更新隐私设置
async function testUpdatePrivacySettings() {
    console.log('🔒 测试更新隐私设置...');
    
    const privacySettings = {
        dataSharing: true,
        analytics: false,
        personalizedAds: false,
        dataRetention: '30'
    };
    
    const response = await axios.put(`${API_BASE_URL}/user/privacy`, privacySettings, {
        headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
        console.log('✅ 更新隐私设置成功');
    } else {
        throw new Error('更新隐私设置失败: ' + response.data.message);
    }
}

// 测试获取用户统计
async function testGetUserStats() {
    console.log('📊 测试获取用户统计...');
    
    const response = await axios.get(`${API_BASE_URL}/user/stats`, {
        headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
        console.log('✅ 获取用户统计成功');
        console.log('   情感记录数:', response.data.data.emotionCount);
        console.log('   对话会话数:', response.data.data.chatCount);
    } else {
        throw new Error('获取用户统计失败: ' + response.data.message);
    }
}

// 测试导出用户数据
async function testExportUserData() {
    console.log('📤 测试导出用户数据...');
    
    const response = await axios.get(`${API_BASE_URL}/user/export`, {
        headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
        console.log('✅ 导出用户数据成功');
        console.log('   导出版本:', response.data.data.version);
        console.log('   导出时间:', response.data.data.exportDate);
    } else {
        throw new Error('导出用户数据失败: ' + response.data.message);
    }
}

// 检查服务器是否运行
async function checkServer() {
    try {
        await axios.get('http://localhost:3000/health');
        return true;
    } catch (error) {
        return false;
    }
}

// 主函数
async function main() {
    console.log('🔍 检查服务器状态...');
    
    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.error('❌ 后端服务器未运行，请先启动服务器：');
        console.error('   cd backend && npm run start:api-only');
        process.exit(1);
    }
    
    console.log('✅ 服务器运行正常\n');
    
    await runTests();
}

// 运行测试
if (require.main === module) {
    main().catch(error => {
        console.error('❌ 测试执行失败:', error.message);
        process.exit(1);
    });
}

module.exports = {
    runTests,
    testUserRegistration,
    testUserLogin,
    testGetUserInfo,
    testSaveUserData,
    testAddEmotionRecord,
    testAddChatSession,
    testUpdatePreferences,
    testUpdatePrivacySettings,
    testGetUserStats,
    testExportUserData
};
