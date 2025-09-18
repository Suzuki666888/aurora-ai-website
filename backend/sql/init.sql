-- Aurora数据库初始化脚本
-- 创建数据库和表结构

-- 创建数据库（如果不存在）
-- CREATE DATABASE IF NOT EXISTS aurora_db;

-- 使用数据库
-- \c aurora_db;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0
);

-- 创建用户会话表
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建情感分析记录表
CREATE TABLE IF NOT EXISTS emotion_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text_content TEXT NOT NULL,
    emotion VARCHAR(50) NOT NULL,
    intensity DECIMAL(3,2) NOT NULL CHECK (intensity >= 0 AND intensity <= 1),
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    reasoning TEXT,
    secondary_emotions JSONB DEFAULT '[]',
    context_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建对话记录表
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    emotion_summary JSONB DEFAULT '{}',
    message_count INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- 创建对话消息表
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'aurora', 'system')),
    content TEXT NOT NULL,
    emotion_detected VARCHAR(50),
    emotion_confidence DECIMAL(3,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建情感导航记录表
CREATE TABLE IF NOT EXISTS emotion_navigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_emotion VARCHAR(50) NOT NULL,
    target_emotion VARCHAR(50) NOT NULL,
    navigation_path JSONB NOT NULL,
    estimated_time INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    preferences JSONB DEFAULT '{}',
    completion_status VARCHAR(20) DEFAULT 'started' CHECK (completion_status IN ('started', 'in_progress', 'completed', 'abandoned')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 创建用户情感档案表
CREATE TABLE IF NOT EXISTS user_emotion_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emotion_baseline JSONB DEFAULT '{}',
    emotion_patterns JSONB DEFAULT '{}',
    triggers JSONB DEFAULT '[]',
    coping_strategies JSONB DEFAULT '[]',
    preferences JSONB DEFAULT '{}',
    insights JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建系统日志表
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    service VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建API使用统计表
CREATE TABLE IF NOT EXISTS api_usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_emotion_analyses_user_id ON emotion_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_analyses_emotion ON emotion_analyses(emotion);
CREATE INDEX IF NOT EXISTS idx_emotion_analyses_created_at ON emotion_analyses(created_at);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_navigations_user_id ON emotion_navigations(user_id);
CREATE INDEX IF NOT EXISTS idx_navigations_status ON emotion_navigations(completion_status);
CREATE INDEX IF NOT EXISTS idx_navigations_created_at ON emotion_navigations(created_at);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON user_emotion_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_service ON system_logs(service);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON system_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_usage_user_id ON api_usage_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_endpoint ON api_usage_stats(endpoint);
CREATE INDEX IF NOT EXISTS idx_usage_created_at ON api_usage_stats(created_at);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_navigations_updated_at BEFORE UPDATE ON emotion_navigations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON user_emotion_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建数据清理函数（用于隐私保护）
CREATE OR REPLACE FUNCTION cleanup_user_data(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    -- 删除用户的所有数据
    DELETE FROM api_usage_stats WHERE user_id = user_uuid;
    DELETE FROM system_logs WHERE user_id = user_uuid;
    DELETE FROM emotion_navigations WHERE user_id = user_uuid;
    DELETE FROM chat_messages WHERE user_id = user_uuid;
    DELETE FROM chat_sessions WHERE user_id = user_uuid;
    DELETE FROM emotion_analyses WHERE user_id = user_uuid;
    DELETE FROM user_emotion_profiles WHERE user_id = user_uuid;
    DELETE FROM user_sessions WHERE user_id = user_uuid;
    DELETE FROM users WHERE id = user_uuid;
    
    RAISE NOTICE '用户数据清理完成: %', user_uuid;
END;
$$ LANGUAGE plpgsql;

-- 创建数据匿名化函数（用于差分隐私）
CREATE OR REPLACE FUNCTION anonymize_emotion_data()
RETURNS VOID AS $$
BEGIN
    -- 匿名化情感分析数据（保留统计信息，删除个人标识）
    UPDATE emotion_analyses 
    SET text_content = '[已匿名化]',
        context_data = '{}',
        metadata = jsonb_set(metadata, '{anonymized}', 'true')
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
    
    -- 匿名化对话数据
    UPDATE chat_messages 
    SET content = '[已匿名化]',
        metadata = jsonb_set(metadata, '{anonymized}', 'true')
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
    
    RAISE NOTICE '情感数据匿名化完成';
END;
$$ LANGUAGE plpgsql;

-- 插入初始管理员用户（密码: admin123，需要在实际部署时修改）
INSERT INTO users (email, username, password_hash, salt, role, is_verified) 
VALUES (
    'admin@aurora.ai',
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J5K5K5K5K', -- 需要实际生成
    'random_salt_here', -- 需要实际生成
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- 创建视图：用户情感统计
CREATE OR REPLACE VIEW user_emotion_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(ea.id) as total_analyses,
    AVG(ea.intensity) as avg_intensity,
    AVG(ea.confidence) as avg_confidence,
    MODE() WITHIN GROUP (ORDER BY ea.emotion) as most_common_emotion,
    COUNT(DISTINCT ea.emotion) as unique_emotions,
    MAX(ea.created_at) as last_analysis
FROM users u
LEFT JOIN emotion_analyses ea ON u.id = ea.user_id
GROUP BY u.id, u.username;

-- 创建视图：对话统计
CREATE OR REPLACE VIEW chat_session_stats AS
SELECT 
    cs.id as session_id,
    cs.user_id,
    u.username,
    cs.title,
    cs.message_count,
    cs.duration_minutes,
    cs.created_at,
    cs.ended_at,
    COUNT(cm.id) as actual_message_count
FROM chat_sessions cs
JOIN users u ON cs.user_id = u.id
LEFT JOIN chat_messages cm ON cs.id = cm.session_id
GROUP BY cs.id, cs.user_id, u.username, cs.title, cs.message_count, cs.duration_minutes, cs.created_at, cs.ended_at;

-- 创建定期清理任务（需要pg_cron扩展）
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT anonymize_emotion_data();');
-- SELECT cron.schedule('cleanup-expired-sessions', '0 */6 * * *', 'DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;');

-- 创建数据库备份脚本
COMMENT ON DATABASE aurora_db IS 'Aurora情感AI系统数据库 - 包含用户、情感分析、对话等核心数据';

-- 完成初始化
\echo 'Aurora数据库初始化完成！'
\echo '已创建以下表：'
\echo '- users (用户表)'
\echo '- user_sessions (用户会话表)'
\echo '- emotion_analyses (情感分析记录表)'
\echo '- chat_sessions (对话会话表)'
\echo '- chat_messages (对话消息表)'
\echo '- emotion_navigations (情感导航记录表)'
\echo '- user_emotion_profiles (用户情感档案表)'
\echo '- system_logs (系统日志表)'
\echo '- api_usage_stats (API使用统计表)'
\echo ''
\echo '已创建索引、触发器、视图和清理函数'
\echo '数据库已准备就绪！'
