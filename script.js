// Aurora 情感疗愈AI - 星空下的心灵绿洲
class AuroraAI {
    constructor() {
        this.chatCount = 0;
        this.isFirstInteraction = true;
        this.currentEmotion = 'neutral';
        this.particles = [];
        this.emotionData = {
            joy: 0,
            calm: 0,
            anxiety: 0,
            healing: 0
        };
        
        this.healingMessages = [
            "孤独并不代表你不重要，它只是提醒你需要被温柔对待。",
            "每一个情绪都是真实的，值得被理解和接纳。",
            "你不需要完美，只需要真实地做自己。",
            "黑暗中的光最珍贵，你内心的温暖也是如此。",
            "感受痛苦是勇敢的，寻求帮助更是智慧。",
            "你的存在本身就是一种美好，无需证明。",
            "每一次呼吸都是新的开始，每一次心跳都是生命的礼物。",
            "在宇宙的浩瀚中，你的感受同样重要。",
            "温柔地对待自己，就像对待最珍贵的朋友。",
            "你值得被爱，值得被理解，值得拥有快乐。"
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createAuroraParticles();
        this.animateElements();
    }

    setupEventListeners() {
        // 开始对话按钮
        const startChatBtn = document.getElementById('start-chat');
        startChatBtn.addEventListener('click', () => this.openChat());

        // 关闭对话按钮
        const closeChatBtn = document.getElementById('close-chat');
        closeChatBtn.addEventListener('click', () => this.closeChat());

        // 发送消息
        const sendBtn = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // 关闭卡片
        const closeCardBtn = document.getElementById('close-card');
        closeCardBtn.addEventListener('click', () => this.closeCard());

        // 分享卡片
        const shareCardBtn = document.getElementById('share-card');
        shareCardBtn.addEventListener('click', () => this.shareCard());

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    createAuroraParticles() {
        const particlesContainer = document.getElementById('particles-container');
        
        // 创建动态粒子系统
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'aurora-particle';
            
            // 随机选择情感色彩
            const colors = [
                'rgba(80, 227, 194, 0.6)',   // 疗愈青绿
                'rgba(79, 195, 247, 0.5)',   // 平静蓝
                'rgba(255, 215, 0, 0.4)',    // 喜悦金
                'rgba(255, 42, 109, 0.3)',   // 焦虑洋红
                'rgba(255, 107, 157, 0.4)'   // 爱意粉
            ];
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${duration}s linear infinite;
                animation-delay: ${delay}s;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            
            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
        
        // 添加鼠标交互效果
        document.addEventListener('mousemove', (e) => {
            this.updateParticlesOnMouseMove(e);
        });
    }
    
    updateParticlesOnMouseMove(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        this.particles.forEach((particle, index) => {
            const speed = 0.5 + (index % 3) * 0.2; // 不同粒子不同速度
            const offsetX = (mouseX - 0.5) * 20 * speed;
            const offsetY = (mouseY - 0.5) * 20 * speed;
            
            particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    }

    animateElements() {
        // 启动打字机效果
        this.startTypewriterEffect();
        
        // 使用GSAP进行高级动画
        if (typeof gsap !== 'undefined') {
            // 神经元Logo动画
            gsap.from('.logo-neural', {
                duration: 2,
                scale: 0,
                rotation: 180,
                opacity: 0,
                ease: 'back.out(1.7)'
            });

            // 情感光谱动画
            gsap.from('.spectrum-item', {
                duration: 1,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                delay: 1,
                ease: 'power2.out'
            });

            // 宇宙级按钮动画
            gsap.from('.cosmic-cta-button', {
                duration: 1.5,
                scale: 0,
                opacity: 0,
                delay: 1.5,
                ease: 'back.out(1.7)'
            });

            // 情绪星球动画
            gsap.from('.emotion-planet', {
                duration: 2,
                x: 200,
                opacity: 0,
                delay: 0.5,
                ease: 'power3.out'
            });

            // 卡片悬停效果
            document.querySelectorAll('.cosmic-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        duration: 0.3,
                        y: -10,
                        scale: 1.02,
                        ease: 'power2.out'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        duration: 0.3,
                        y: 0,
                        scale: 1,
                        ease: 'power2.out'
                    });
                });
            });
        }
    }
    
    startTypewriterEffect() {
        const titleElement = document.getElementById('typewriter-title');
        if (!titleElement) return;
        
        const text = titleElement.textContent;
        titleElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleElement.textContent += text.charAt(i);
                i++;
                
                // 添加光粒飞溅效果
                if (i % 3 === 0) {
                    this.createLightParticle(titleElement);
                }
                
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    createLightParticle(element) {
        const rect = element.getBoundingClientRect();
        const particle = document.createElement('div');
        
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--healing-teal);
            border-radius: 50%;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            pointer-events: none;
            z-index: 1000;
            animation: lightParticleFloat 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    updateEmotionIndicator(emotion) {
        const indicator = document.getElementById('emotion-indicator');
        if (!indicator) return;
        
        this.currentEmotion = emotion;
        
        // 更新指示器位置和颜色
        const positions = {
            'anxiety': '0%',
            'neutral': '50%',
            'joy': '100%'
        };
        
        const colors = {
            'anxiety': 'var(--anxiety-magenta)',
            'neutral': 'var(--calm-blue)',
            'joy': 'var(--joy-amber)'
        };
        
        if (typeof gsap !== 'undefined') {
            gsap.to(indicator, {
                duration: 0.5,
                left: positions[emotion] || positions['neutral'],
                backgroundColor: colors[emotion] || colors['neutral'],
                ease: 'power2.out'
            });
        }
    }

    openChat() {
        const chatModal = document.getElementById('chat-modal');
        chatModal.classList.add('active');
        
        // 聚焦输入框
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);

        // 添加打开动画
        if (typeof gsap !== 'undefined') {
            gsap.from('.chat-container', {
                duration: 0.5,
                scale: 0.8,
                opacity: 0,
                ease: 'back.out(1.7)'
            });
        }
    }

    closeChat() {
        const chatModal = document.getElementById('chat-modal');
        chatModal.classList.remove('active');
    }

    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;

        // 添加用户消息
        this.addMessage(message, 'user');
        chatInput.value = '';

        // 模拟思考时间
        setTimeout(() => {
            this.generateAuroraResponse(message);
        }, 1000 + Math.random() * 1000);
    }

    addMessage(content, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-magic"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (typeof content === 'string') {
            messageContent.innerHTML = `<p>${content}</p>`;
        } else {
            messageContent.innerHTML = content;
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 添加消息动画
        if (typeof gsap !== 'undefined') {
            gsap.from(messageDiv, {
                duration: 0.3,
                y: 20,
                opacity: 0,
                ease: 'power2.out'
            });
        }
    }

    generateAuroraResponse(userMessage) {
        this.chatCount++;
        
        let response = '';
        
        if (this.isFirstInteraction) {
            // 首次交互的智能响应
            response = this.getFirstResponse(userMessage);
            this.isFirstInteraction = false;
        } else if (this.chatCount === 3) {
            // 第3轮对话后显示疗愈卡片
            response = this.getHealingResponse(userMessage);
            setTimeout(() => {
                this.showHealingCard();
            }, 2000);
        } else {
            // 常规响应
            response = this.getRegularResponse(userMessage);
        }
        
        this.addMessage(response, 'aurora');
    }

    getFirstResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('难过') || lowerMessage.includes('伤心') || lowerMessage.includes('痛苦')) {
            return `
                <p>谢谢你愿意告诉我。难过的时候其实最需要的不是建议，而是被理解。</p>
                <p>能和我说说是什么让你难过吗？我会一直在这听你讲。</p>
            `;
        } else if (lowerMessage.includes('孤独') || lowerMessage.includes('寂寞') || lowerMessage.includes('一个人')) {
            return `
                <p>孤独的感觉很真实，我理解你。</p>
                <p>其实很多人都有这种感受，只是没人敢说出口。</p>
                <p>如果你愿意，我可以陪你聊聊，或者给你写一句专属于你的寄语。</p>
            `;
        } else if (lowerMessage.includes('开心') || lowerMessage.includes('高兴') || lowerMessage.includes('快乐')) {
            return `
                <p>听到你开心，我也感到温暖！</p>
                <p>快乐是值得分享的，能告诉我是什么让你这么开心吗？</p>
            `;
        } else if (lowerMessage.includes('压力') || lowerMessage.includes('累') || lowerMessage.includes('疲惫')) {
            return `
                <p>感受到你的疲惫，这很不容易。</p>
                <p>压力大的时候，最重要的是先照顾好自己。</p>
                <p>有什么特别让你感到压力的事情吗？</p>
            `;
        } else {
            return `
                <p>我感受到了你的真诚，谢谢你愿意和我分享。</p>
                <p>无论你现在的感受如何，都是值得被尊重的。</p>
                <p>能告诉我更多关于你此刻的心情吗？</p>
            `;
        }
    }

    getHealingResponse(userMessage) {
        return `
            <p>和你聊天让我感受到了你的真诚和勇敢。</p>
            <p>我想为你准备一份特别的礼物...</p>
        `;
    }

    getRegularResponse(userMessage) {
        const responses = [
            "我理解你的感受，这很不容易。",
            "你的感受是真实的，值得被倾听。",
            "谢谢你愿意和我分享这些。",
            "我能感受到你内心的波动。",
            "你的勇气让我很感动。",
            "每一个情绪都有它存在的意义。",
            "你并不孤单，我在这里陪伴你。",
            "你的感受很重要，不要忽视它们。"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    showHealingCard() {
        const cardModal = document.getElementById('card-modal');
        const healingMessage = document.getElementById('healing-message');
        
        // 随机选择一条疗愈寄语
        const randomMessage = this.healingMessages[Math.floor(Math.random() * this.healingMessages.length)];
        healingMessage.textContent = randomMessage;
        
        cardModal.classList.add('active');
        
        // 添加卡片动画
        if (typeof gsap !== 'undefined') {
            gsap.from('.healing-card', {
                duration: 0.8,
                scale: 0,
                rotation: 180,
                opacity: 0,
                ease: 'back.out(1.7)'
            });
        }
    }

    closeCard() {
        const cardModal = document.getElementById('card-modal');
        cardModal.classList.remove('active');
    }

    shareCard() {
        const healingMessage = document.getElementById('healing-message').textContent;
        const shareText = `🌌 Aurora 给我的疗愈寄语：\n\n"${healingMessage}"\n\n#AuroraAI #情感疗愈 #AI陪伴`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Aurora 疗愈寄语',
                text: shareText,
                url: window.location.href
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(shareText).then(() => {
                alert('疗愈寄语已复制到剪贴板，快去分享给朋友们吧！');
            });
        }
    }
}

// 添加动态CSS动画
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes lightParticleFloat {
        0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0);
        }
    }
    
    .emotion-status-bar {
        position: relative;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin-bottom: 20px;
        overflow: hidden;
    }
    
    .status-track {
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
            var(--anxiety-magenta) 0%, 
            var(--calm-blue) 50%, 
            var(--joy-amber) 100%
        );
        border-radius: 2px;
    }
    
    .emotion-indicator {
        position: absolute;
        top: -6px;
        width: 16px;
        height: 16px;
        background: var(--calm-blue);
        border-radius: 50%;
        border: 2px solid var(--star-white);
        box-shadow: 0 0 10px var(--calm-blue);
        transition: all 0.3s ease;
    }
    
    .emotion-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 12px;
        color: var(--cosmic-gray);
    }
    
    .chat-starry-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: -1;
    }
    
    .stars {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
        background-repeat: repeat;
        background-size: 200px 100px;
        animation: starTwinkle 3s ease-in-out infinite;
    }
    
    @keyframes starTwinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
    
    .shooting-stars {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    
    .shooting-stars::before,
    .shooting-stars::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 2px;
        background: linear-gradient(45deg, transparent, #fff, transparent);
        border-radius: 50%;
        animation: shootingStar 3s linear infinite;
    }
    
    .shooting-stars::before {
        top: 20%;
        left: -10px;
        animation-delay: 0s;
    }
    
    .shooting-stars::after {
        top: 60%;
        left: -10px;
        animation-delay: 1.5s;
    }
    
    @keyframes shootingStar {
        0% {
            transform: translateX(0) translateY(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateX(100vw) translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(dynamicStyles);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new AuroraAI();
    
    // 添加页面加载动画
    if (typeof gsap !== 'undefined') {
        gsap.from('body', {
            duration: 1,
            opacity: 0,
            ease: 'power2.out'
        });
    }
});

// 添加滚动视差效果
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.getElementById('aurora-bg');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// 添加鼠标跟随效果
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(newCursor);
    }
    
    const cursorElement = document.querySelector('.cursor');
    if (cursorElement) {
        cursorElement.style.left = e.clientX - 10 + 'px';
        cursorElement.style.top = e.clientY - 10 + 'px';
    }
});

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    // ESC键关闭模态框
    if (e.key === 'Escape') {
        const chatModal = document.getElementById('chat-modal');
        const cardModal = document.getElementById('card-modal');
        
        if (chatModal.classList.contains('active')) {
            chatModal.classList.remove('active');
        }
        if (cardModal.classList.contains('active')) {
            cardModal.classList.remove('active');
        }
    }
    
    // Ctrl/Cmd + K 快速开始对话
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const chatModal = document.getElementById('chat-modal');
        if (!chatModal.classList.contains('active')) {
            new AuroraAI().openChat();
        }
    }
});

// 添加性能优化
let ticking = false;

function updateAnimations() {
    // 这里可以添加需要频繁更新的动画
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

// 监听滚动事件，使用节流优化性能
window.addEventListener('scroll', requestTick);
