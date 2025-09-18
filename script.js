// Aurora 超新星内部的数据交响乐 - 宇宙级科技感交互系统
class AuroraUltra {
    constructor() {
        this.isInitialized = false;
        this.currentPage = 'event-horizon';
        this.particles = [];
        this.neuralNodes = [];
        this.emotionData = {
            joy: 0,
            calm: 0,
            anxiety: 0,
            healing: 0
        };
        this.mousePosition = { x: 0, y: 0 };
        this.scrollPosition = 0;
        this.isScanning = false;
        this.isDialogueActive = false;
        
        // 音效系统
        this.sounds = {
            energyPulse: null,
            neuralConnection: null,
            dataStream: null,
            mechanicalClick: null,
            voiceFeedback: null
        };
        
        // 3D场景
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.neuralNetwork = null;
        this.holographicEarth = null;
        
        // 能量传递动画
        this.energyTransfers = [];
        this.photonParticles = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initialize3DScene();
        this.createEnergyField();
        this.createParticleSystem();
        this.initializeSoundSystem();
        this.setupScrollEffects();
        this.setupMouseInteractions();
        this.animateElements();
        this.isInitialized = true;
    }

    setupEventListeners() {
        // 能量球CTA按钮
        const energyBallContainer = document.getElementById('energy-ball-container');
        if (energyBallContainer) {
            energyBallContainer.addEventListener('click', () => this.igniteConnection());
            energyBallContainer.addEventListener('mouseenter', () => this.activateEnergyBall());
            energyBallContainer.addEventListener('mouseleave', () => this.deactivateEnergyBall());
        }

        // 对话奇点认证
        const dialogueModal = document.getElementById('dialogue-singularity-modal');
        if (dialogueModal) {
            dialogueModal.addEventListener('click', () => this.startRetinalScan());
        }

        // 神经光网交互
        const neuralTrees = document.querySelectorAll('.neuron-tree');
        neuralTrees.forEach(tree => {
            tree.addEventListener('mouseenter', (e) => this.activateNeuron(e.target));
            tree.addEventListener('mouseleave', (e) => this.deactivateNeuron(e.target));
        });

        // 控制台旋钮
        const knobs = document.querySelectorAll('.knob');
        knobs.forEach(knob => {
            knob.addEventListener('mousedown', (e) => this.startKnobRotation(e.target));
            knob.addEventListener('mouseup', (e) => this.stopKnobRotation(e.target));
        });

        // 数据晶片交互
        const crystals = document.querySelectorAll('.crystal-slot');
        crystals.forEach(crystal => {
            crystal.addEventListener('click', (e) => this.openDetailPage(e.target));
        });

        // 详情页面关闭
        const closeModal = document.getElementById('close-modal');
        const detailModal = document.getElementById('detail-page-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeDetailPage());
        }
        if (detailModal) {
            detailModal.addEventListener('click', (e) => {
                if (e.target === detailModal) {
                    this.closeDetailPage();
                }
            });
        }

        // 鼠标移动跟踪
        document.addEventListener('mousemove', (e) => this.updateMousePosition(e));
        
        // 滚动效果
        window.addEventListener('scroll', () => this.handleScroll());
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // 点燃连接 - 能量球爆炸效果
    igniteConnection() {
        const energyBall = document.getElementById('energy-ball');
        const glassContainer = document.querySelector('.glass-container');
        const energyCracks = document.getElementById('energy-cracks');
        
        // 播放音效
        this.playSound('energyPulse');
        
        // 玻璃容器碎裂动画
        if (glassContainer && energyCracks) {
            glassContainer.style.animation = 'glassShatter 0.8s ease-out forwards';
            energyCracks.style.opacity = '1';
            
            // 创建碎片效果
            this.createGlassFragments(glassContainer);
            
            // 能量球化作光流
            setTimeout(() => {
                this.createEnergyStream(energyBall);
                this.triggerBackgroundEnergyBurst();
            }, 400);
        }
    }

    // 激活能量球
    activateEnergyBall() {
        const energyBall = document.getElementById('energy-ball');
        const glassContainer = document.querySelector('.glass-container');
        
        if (energyBall && glassContainer) {
            glassContainer.style.borderColor = 'var(--neon-pink)';
            glassContainer.style.boxShadow = 'var(--shadow-rainbow)';
            energyBall.style.transform = 'scale(1.1)';
        }
    }

    // 停用能量球
    deactivateEnergyBall() {
        const energyBall = document.getElementById('energy-ball');
        const glassContainer = document.querySelector('.glass-container');
        
        if (energyBall && glassContainer) {
            glassContainer.style.borderColor = 'var(--glass-border)';
            glassContainer.style.boxShadow = 'none';
            energyBall.style.transform = 'scale(1)';
        }
    }

    // 开始视网膜扫描
    startRetinalScan() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        const scanner = document.getElementById('retinal-scanner');
        const scanBeam = document.getElementById('scan-beam');
        const scanProgress = document.getElementById('scan-progress');
        const scanStatus = document.getElementById('scan-status');
        
        if (scanner && scanBeam && scanProgress && scanStatus) {
            // 播放扫描音效
            this.playSound('mechanicalClick');
            
            // 开始扫描动画
            scanBeam.style.animation = 'scanBeamSweep 3s ease-in-out forwards';
            scanProgress.style.animation = 'scanProgressFill 3s ease-in-out forwards';
            
            // 更新状态文字
            const statusMessages = [
                'Neural handshake initiated...',
                'Identity confirmed...',
                'Welcome to Aurora...',
                'Connection established.'
            ];
            
            statusMessages.forEach((message, index) => {
                setTimeout(() => {
                    scanStatus.textContent = message;
                }, index * 750);
            });
            
            // 扫描完成
            setTimeout(() => {
                this.completeRetinalScan();
            }, 3000);
        }
    }

    // 完成视网膜扫描
    completeRetinalScan() {
        const scanner = document.getElementById('retinal-scanner');
        const dialogueInterface = document.getElementById('dialogue-interface');
        
        if (scanner && dialogueInterface) {
            // 播放语音反馈
            this.playSound('voiceFeedback');
            this.speakText('Neural handshake initiated. Identity confirmed. Welcome.');
            
            // 扫描仪收起动画
            scanner.style.animation = 'scannerRetract 1s ease-out forwards';
            
            // 显示对话界面
            setTimeout(() => {
                dialogueInterface.style.display = 'flex';
                dialogueInterface.style.animation = 'dialogueInterfaceAppear 0.8s ease-out forwards';
                this.isDialogueActive = true;
            }, 1000);
        }
    }

    // 激活神经元
    activateNeuron(neuron) {
        const module = neuron.dataset.module;
        const explanation = document.getElementById('floating-explanation');
        
        if (explanation) {
            const title = explanation.querySelector('.explanation-title');
            const text = explanation.querySelector('.explanation-text');
            
            // 根据模块显示不同内容
            const moduleData = this.getModuleData(module);
            if (title && text && moduleData) {
                title.textContent = moduleData.title;
                text.textContent = moduleData.description;
                explanation.classList.add('active');
            }
        }
        
        // 播放神经连接音效
        this.playSound('neuralConnection');
        
        // 创建能量脉冲
        this.createNeuralPulse(neuron);
    }

    // 停用神经元
    deactivateNeuron(neuron) {
        const explanation = document.getElementById('floating-explanation');
        if (explanation) {
            explanation.classList.remove('active');
        }
    }

    // 创建能量场
    createEnergyField() {
        const energyField = document.getElementById('energy-field-bg');
        if (energyField) {
            // 添加动态能量波动
            setInterval(() => {
                this.createEnergyWave();
            }, 2000);
        }
    }

    // 创建粒子系统
    createParticleSystem() {
        const particleField = document.getElementById('particle-field');
        if (!particleField) return;
        
        for (let i = 0; i < 200; i++) {
            const particle = document.createElement('div');
            particle.className = 'energy-particle';
            
            const colors = [
                'rgba(255, 42, 109, 0.8)',
                'rgba(157, 80, 255, 0.6)',
                'rgba(79, 195, 247, 0.7)',
                'rgba(0, 240, 255, 0.5)',
                'rgba(0, 255, 163, 0.6)'
            ];
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 4 + 1;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 10;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: energyParticleFloat ${duration}s linear infinite;
                animation-delay: ${delay}s;
                box-shadow: 0 0 ${size * 3}px ${color};
                pointer-events: none;
            `;
            
            particleField.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    // 更新鼠标位置
    updateMousePosition(e) {
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
        
        // 更新粒子位置
            this.updateParticlesOnMouseMove(e);
        
        // 更新3D场景相机
        if (this.camera) {
            this.camera.position.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.camera.position.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }
    }

    // 更新粒子跟随鼠标
    updateParticlesOnMouseMove(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        this.particles.forEach((particle, index) => {
            const speed = 0.5 + (index % 3) * 0.2;
            const offsetX = (mouseX - 0.5) * 30 * speed;
            const offsetY = (mouseY - 0.5) * 30 * speed;
            
            particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    }

    // 音效系统
    initializeSoundSystem() {
        // 使用Web Audio API创建音效
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 创建各种音效
        this.sounds.energyPulse = this.createEnergyPulseSound();
        this.sounds.neuralConnection = this.createNeuralConnectionSound();
        this.sounds.dataStream = this.createDataStreamSound();
        this.sounds.mechanicalClick = this.createMechanicalClickSound();
        this.sounds.voiceFeedback = this.createVoiceFeedbackSound();
    }

    // 播放音效
    playSound(soundType) {
        if (this.sounds[soundType]) {
            this.sounds[soundType].play();
        }
    }

    // 创建能量脉冲音效
    createEnergyPulseSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        return {
            play: () => {
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.5);
            }
        };
    }

    // 创建神经连接音效
    createNeuralConnectionSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(2000, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        return {
            play: () => {
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
            }
        };
    }

    // 创建数据流音效
    createDataStreamSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1500, this.audioContext.currentTime + 1);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        return {
            play: () => {
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 1);
            }
        };
    }

    // 创建机械点击音效
    createMechanicalClickSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        return {
            play: () => {
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }
        };
    }

    // 创建语音反馈音效
    createVoiceFeedbackSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        return {
            play: () => {
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.5);
            }
        };
    }

    // 语音合成
    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            utterance.volume = 0.7;
            speechSynthesis.speak(utterance);
        }
    }

    // 打开详情页面
    openDetailPage(crystal) {
        const pageType = crystal.dataset.page;
        
        // 检查是否是引言页面
        if (pageType === 'introduction-page') {
            // 播放音效
            this.playSound('mechanicalClick');
            // 跳转到引言页面
            window.location.href = 'introduction.html';
            return;
        }
        
        // 检查是否是技术原理页面
        if (pageType === 'technology-page') {
            // 播放音效
            this.playSound('mechanicalClick');
            // 跳转到技术原理页面
            window.location.href = 'technology.html';
            return;
        }
        
        const modal = document.getElementById('detail-page-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        const modalContent = document.getElementById('modal-content');
        
        if (!modal || !pageType) return;
        
        // 播放音效
        this.playSound('mechanicalClick');
        
        // 获取页面数据
        const pageData = this.getPageData(pageType);
        if (!pageData) return;
        
        // 更新模态框标题
        modalTitle.textContent = pageData.title;
        modalSubtitle.textContent = pageData.subtitle;
        
        // 生成页面内容
        modalContent.innerHTML = this.generatePageContent(pageData);
        
        // 显示模态框
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 添加进入动画
        if (typeof gsap !== 'undefined') {
            gsap.from('.modal-container', {
                duration: 0.5,
                scale: 0.8,
                opacity: 0,
                y: 50,
                ease: 'back.out(1.7)'
            });
        }
    }

    // 关闭详情页面
    closeDetailPage() {
        const modal = document.getElementById('detail-page-modal');
        if (!modal) return;
        
        // 播放音效
        this.playSound('mechanicalClick');
        
        // 添加退出动画
        if (typeof gsap !== 'undefined') {
            gsap.to('.modal-container', {
                duration: 0.3,
                scale: 0.8,
                opacity: 0,
                y: 50,
                ease: 'power2.in',
                onComplete: () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // 获取页面数据
    getPageData(pageType) {
        const pageData = {
            'introduction': {
                title: '引言',
                subtitle: 'Introduction',
                content: {
                    description: 'Aurora不仅仅是一个AI助手，更是一个情感疗愈的伙伴。我们相信，真正的智能不仅仅是回答问题，而是理解、共情和疗愈。',
                    features: [
                        {
                            title: '情感理解',
                            description: '深度分析用户的情感状态，识别微妙的情绪变化'
                        },
                        {
                            title: '共情回应',
                            description: '基于心理学原理生成具有共情能力的回应'
                        },
                        {
                            title: '疗愈支持',
                            description: '结合认知行为疗法，提供具有疗愈效果的情感支持'
                        },
                        {
                            title: '持续陪伴',
                            description: '24/7不间断的情感陪伴，让用户不再孤单'
                        }
                    ],
                    visual: {
                        icon: 'fas fa-heart',
                        text: '情感疗愈的起点'
                    }
                }
            },
            'technology': {
                title: '技术原理',
                subtitle: 'Technology',
                content: {
                    description: 'Aurora基于最先进的深度学习技术，结合心理学理论，构建了一个能够理解和回应人类情感的智能系统。',
                    features: [
                        {
                            title: '神经网络架构',
                            description: '采用Transformer架构，专门优化情感理解和生成'
                        },
                        {
                            title: '情感识别模型',
                            description: '基于BERT的情感分析模型，准确率超过95%'
                        },
                        {
                            title: '对话生成系统',
                            description: '结合GPT和心理学知识库的对话生成引擎'
                        },
                        {
                            title: '实时学习机制',
                            description: '通过用户反馈不断优化回应质量'
                        }
                    ],
                    visual: {
                        icon: 'fas fa-microchip',
                        text: '技术的力量'
                    }
                }
            },
            'psychology': {
                title: '心理学基础',
                subtitle: 'Psychology',
                content: {
                    description: 'Aurora的设计基于多种心理学理论，包括认知行为疗法、人本主义心理学和积极心理学，确保每一次交互都具有疗愈价值。',
                    features: [
                        {
                            title: '认知行为疗法',
                            description: '帮助用户识别和改变负面思维模式'
                        },
                        {
                            title: '人本主义关怀',
                            description: '无条件的积极关注和共情理解'
                        },
                        {
                            title: '积极心理学',
                            description: '培养用户的积极情绪和幸福感'
                        },
                        {
                            title: '正念练习',
                            description: '引导用户进行正念冥想和情绪调节'
                        }
                    ],
                    visual: {
                        icon: 'fas fa-brain',
                        text: '心灵的智慧'
                    }
                }
            },
            'ethics': {
                title: '伦理考量',
                subtitle: 'Ethics',
                content: {
                    description: '在开发Aurora的过程中，我们严格遵循AI伦理原则，确保用户隐私安全，避免算法偏见，并建立透明的决策机制。',
                    features: [
                        {
                            title: '隐私保护',
                            description: '端到端加密，用户数据完全匿名化处理'
                        },
                        {
                            title: '算法公平',
                            description: '消除性别、种族、年龄等偏见因素'
                        },
                        {
                            title: '透明决策',
                            description: '公开AI决策过程，确保可解释性'
                        },
                        {
                            title: '用户控制',
                            description: '用户完全控制自己的数据和交互记录'
                        }
                    ],
                    visual: {
                        icon: 'fas fa-balance-scale',
                        text: '伦理的基石'
                    }
                }
            },
            'implementation': {
                title: '实现路径',
                subtitle: 'Implementation',
                content: {
                    description: '从概念到产品，Aurora经历了完整的产品开发周期，包括需求分析、原型设计、技术实现、测试优化和用户反馈迭代。',
                    features: [
                        {
                            title: '需求分析',
                            description: '深入调研用户情感需求，确定产品定位'
                        },
                        {
                            title: '原型设计',
                            description: '快速原型验证，迭代优化用户体验'
                        },
                        {
                            title: '技术实现',
                            description: '搭建技术架构，实现核心功能模块'
                        },
                        {
                            title: '测试优化',
                            description: '全面测试，持续优化性能和稳定性'
                        }
                    ],
                    visual: {
                        icon: 'fas fa-cogs',
                        text: '实现的路径'
                    }
                }
            },
            'future': {
                title: '未来展望',
                subtitle: 'Future',
                content: {
                    description: 'Aurora的未来充满无限可能。我们计划开发更多功能，包括多模态交互、个性化定制、群体疗愈等，让情感AI真正改变人们的生活。',
                    features: [
                        {
                            title: '多模态交互',
                            description: '支持语音、图像、视频等多种交互方式'
                        },
                        {
                            title: '个性化定制',
                            description: '根据用户特点定制专属的疗愈方案'
                        },
                        {
                            title: '群体疗愈',
                            description: '支持多人同时参与的情感疗愈活动'
                        },
                        {
                            title: '专业合作',
                            description: '与心理医生、治疗师建立合作关系'
                        }
                    ],
                    visual: {
                        icon: 'fas fa-rocket',
                        text: '未来的愿景'
                    }
                }
            }
        };
        
        return pageData[pageType] || null;
    }

    // 生成页面内容
    generatePageContent(pageData) {
        const content = pageData.content;
        
        return `
            <div class="detail-content">
                <div class="detail-text">
                    ${content.description}
                </div>
                
                <div class="detail-features">
                    ${content.features.map(feature => `
                        <div class="feature-item">
                            <h4>${feature.title}</h4>
                            <p>${feature.description}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="detail-visual">
                    <div class="detail-visual-content">
                        <div class="detail-visual-icon">
                            <i class="${content.visual.icon}"></i>
                        </div>
                        <div class="detail-visual-text">${content.visual.text}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // 获取模块数据
    getModuleData(module) {
        const moduleData = {
            'emotion-recognition': {
                title: '情感识别',
                description: '通过深度学习算法分析用户的情感状态，识别微妙的情绪变化。'
            },
            'empathy-generation': {
                title: '共情生成',
                description: '基于心理学原理生成具有共情能力的回应，让AI真正理解用户。'
            },
            'healing-response': {
                title: '疗愈回应',
                description: '结合认知行为疗法，提供具有疗愈效果的情感支持。'
            },
            'memory-formation': {
                title: '记忆形成',
                description: '建立长期的情感记忆，让每次对话都更有意义。'
            },
            'consciousness-emergence': {
                title: '意识涌现',
                description: '通过复杂的神经网络实现类人意识的涌现。'
            }
        };
        
        return moduleData[module] || null;
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
    window.auroraUltra = new AuroraUltra();
    
    // 添加页面加载动画
    if (typeof gsap !== 'undefined') {
        gsap.from('body', {
            duration: 1.5,
            opacity: 0,
            ease: 'power2.out'
        });
        
        // 能量场进入动画
        gsap.from('#energy-field-bg', {
            duration: 2,
            scale: 1.2,
            opacity: 0,
            ease: 'power3.out'
        });
        
        // AURORA背景文字动画
        gsap.from('.aurora-letter', {
            duration: 1,
            y: 100,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            delay: 0.5
        });
        
        // 能量球出现动画
        gsap.from('.energy-ball-container', {
            duration: 1.5,
            scale: 0,
            opacity: 0,
            ease: 'back.out(1.7)',
            delay: 1
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

// 全局函数，供HTML onclick调用
function openDetailPage(crystal) {
    if (window.auroraUltra) {
        window.auroraUltra.openDetailPage(crystal);
    }
}

// 登录处理函数
function handleLogin() {
    if (window.authManager.isAuthenticated()) {
        // 已登录，显示用户菜单
        showUserMenu();
    } else {
        // 未登录，跳转到登录页面
        window.location.href = 'login.html';
    }
}

// 显示用户菜单
function showUserMenu() {
    const user = window.authManager.getCurrentUser();
    const loginBtn = document.getElementById('nav-login-btn');
    const loginText = document.getElementById('login-text');
    
    if (loginBtn && loginText) {
        loginText.textContent = user ? user.username : '用户';
        loginBtn.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span>${user ? user.username : '用户'}</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        // 添加点击事件显示下拉菜单
        loginBtn.onclick = showUserDropdown;
    }
}

// 显示用户下拉菜单
function showUserDropdown() {
    const user = window.authManager.getCurrentUser();
    
    // 创建下拉菜单
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <div class="dropdown-item" onclick="goToDialogue()">
            <i class="fas fa-comments"></i>
            <span>开始对话</span>
        </div>
        <div class="dropdown-item" onclick="viewProfile()">
            <i class="fas fa-user"></i>
            <span>个人资料</span>
        </div>
        <div class="dropdown-item" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i>
            <span>退出登录</span>
        </div>
    `;
    
    // 添加样式
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--glass-rainbow);
        border: 1px solid var(--glass-border);
        border-radius: 15px;
        padding: 10px 0;
        min-width: 150px;
        backdrop-filter: blur(30px);
        z-index: 1000;
        margin-top: 10px;
    `;
    
    // 插入到登录按钮后面
    const loginBtn = document.getElementById('nav-login-btn');
    loginBtn.style.position = 'relative';
    loginBtn.appendChild(dropdown);
    
    // 点击外部关闭菜单
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!loginBtn.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

// 跳转到对话页面
function goToDialogue() {
    window.location.href = 'dialogue.html';
}

// 查看个人资料
function viewProfile() {
    alert('个人资料功能即将推出！');
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        window.authManager.logout();
    }
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', () => {
    if (window.authManager.isAuthenticated()) {
        showUserMenu();
    }
});

