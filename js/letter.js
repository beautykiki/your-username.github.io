// 页面切换功能
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const contents = {
        'home': document.getElementById('home-content'),
        'write': document.getElementById('write-content'),
        'inbox': document.getElementById('inbox-content')
    };

    // 获取宠物名称并更新写信页面标题
    function updatePetNameInTitle() {
        const petInfo = JSON.parse(localStorage.getItem('pet-info'));
        const petNameElement = document.querySelector('.letter-title .pet-name');
        if (petInfo && petInfo.name && petNameElement) {
            petNameElement.textContent = petInfo.name;
        }
    }

    // 初始更新标题
    updatePetNameInTitle();

    // 监听宠物信息变化
    window.addEventListener('petInfoUpdated', function() {
        updatePetNameInTitle();
    });

    // 监听导航切换
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-tooltip');
            
            // 移除所有active类
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加active类到当前点击的链接
            this.classList.add('active');
            
            // 隐藏所有内容
            Object.values(contents).forEach(content => {
                if (content) content.style.display = 'none';
            });
            
            // 显示目标内容
            switch(target) {
                case '首页':
                    contents.home.style.display = 'block';
                    stopAutoSave(); // 离开写信页面时停止自动保存
                    break;
                case '写信':
                    contents.write.style.display = 'block';
                    updatePetNameInTitle();
                    loadDraft(); // 加载草稿
                    startAutoSave(); // 进入写信页面时开始自动保存
                    break;
                case '收信箱':
                    contents.inbox.style.display = 'block';
                    loadLetters();
                    stopAutoSave(); // 离开写信页面时停止自动保存
                    break;
            }
        });
    });

    // 获取所有需要的元素
    const letterEditor = document.getElementById('letter-content');
    const wordCounter = document.getElementById('word-counter');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const autoGenerateBtn = document.getElementById('auto-generate-btn');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const sendBtn = document.getElementById('send-btn');

    // 添加发送按钮事件监听
    sendBtn.addEventListener('click', sendLetter);

    // 生成内容
    function generateContent() {
        const petInfo = JSON.parse(localStorage.getItem('pet-info'));
        if (!petInfo) {
            showToast('letter.needPetInfo');
            return;
        }

        const currentLang = window.translationManager.getCurrentLanguage();
        
        // 思念语句数组
        const missStatements = {
            zh: [
                `亲爱的${petInfo.name}，今天我又想你了。记得你刚来的时候，小小的，特别可爱。现在你已经${calculateAge(petInfo.birthDate)}岁了，时间过得真快啊！💕`,
                `我最爱的${petInfo.name}，今天整理相册的时候，看到了很多我们的合照。每一张照片都记录着我们的故事，有欢笑，有泪水，但更多的是幸福。📸`,
                `${petInfo.name}，今天特别想你。记得我们第一次见面的时候，你害羞地躲在角落里，现在却成了家里最活泼的小可爱。💭`,
                `亲爱的${petInfo.name}，今天天气真好，让我想起了我们一起度过的那些美好时光。阳光下的你总是那么温暖。☀️`,
                `${petInfo.name}，你知道吗？每次看到和你相似的小动物，我都会想起你。想起你撒娇的样子，想起你开心的样子。🐱`,
                `我最爱的${petInfo.name}，今天路过我们常去的公园，那里的一切都让我想起你。想起你奔跑的样子，想起你玩耍的样子。🌳`,
                `亲爱的${petInfo.name}，今天整理你的玩具时，又想起了我们一起玩耍的时光。你的每一个玩具都承载着我们的回忆。🎯`,
                `${petInfo.name}，今天特别想你。想起你吃饭时可爱的样子，想起你睡觉时安详的样子。😴`,
                `我最爱的${petInfo.name}，今天看到天上的星星，就想起你明亮的眼睛。你永远是我心中最闪亮的那颗星。✨`,
                `亲爱的${petInfo.name}，今天特别想你。想起你撒娇时的样子，想起你开心时的样子，想起你生气时的样子。每一个你，都是我最珍贵的回忆。💝`
            ],
            en: [
                `Dear ${petInfo.name}, I miss you today. I remember when you first came, so tiny and adorable. Now you're ${calculateAge(petInfo.birthDate)} years old, time flies! 💕`,
                `My beloved ${petInfo.name}, while organizing the photo album today, I saw many photos of us together. Each photo tells our story, with laughter, tears, but mostly happiness. 📸`,
                `${petInfo.name}, I miss you so much today. I remember when we first met, you were shy and hiding in the corner, now you're the most lively little one at home. 💭`,
                `Dear ${petInfo.name}, the weather is beautiful today, reminding me of all the wonderful times we spent together. You were always so warm in the sunshine. ☀️`,
                `${petInfo.name}, you know what? Every time I see an animal similar to you, I think of you. I remember your cute way of acting spoiled, your happy expressions. 🐱`,
                `My beloved ${petInfo.name}, today I passed by our favorite park, everything there reminds me of you. I remember how you ran and played. 🌳`,
                `Dear ${petInfo.name}, while organizing your toys today, I remembered all the fun times we had playing together. Each of your toys holds our precious memories. 🎯`,
                `${petInfo.name}, I miss you so much today. I remember your cute way of eating, your peaceful sleeping face. 😴`,
                `My beloved ${petInfo.name}, when I see the stars in the sky today, I remember your bright eyes. You will always be the brightest star in my heart. ✨`,
                `Dear ${petInfo.name}, I miss you so much today. I remember your spoiled expressions, your happy moments, your angry face. Every version of you is my most precious memory. 💝`
            ]
        };

        // 随机选择1个语句
        const numStatements = 1; // 固定选择1个语句
        const selectedStatements = [];
        
        // 获取当前语言的语句数组
        const currentLangStatements = missStatements[currentLang] || missStatements.zh;
        
        // 打乱数组顺序
        const shuffledStatements = [...currentLangStatements].sort(() => Math.random() - 0.5);
        
        // 选择指定数量的语句
        for (let i = 0; i < numStatements; i++) {
            selectedStatements.push(shuffledStatements[i]);
        }

        // 组合语句
        const content = selectedStatements.join('\n\n');
        letterEditor.value = content;
        updateWordCount();
        showToast('letter.contentGenerated');
    }

    // 更新字数统计
    function updateWordCount() {
        const letterEditor = document.getElementById('letter-content');
        const wordCounter = document.getElementById('word-counter');
        if (!letterEditor || !wordCounter) return;
        
        const content = letterEditor.value;
        const wordCount = content.trim().length;
        wordCounter.textContent = `${wordCount}/300`;
        
        if (wordCount > 300) {
            wordCounter.style.color = '#ff4444';
        } else {
            wordCounter.style.color = '#666';
        }
    }

    // 计算年龄
    function calculateAge(birthDate) {
        if (!birthDate) return '0';
        const birth = new Date(birthDate);
        const now = new Date();
        const age = now.getFullYear() - birth.getFullYear();
        return age;
    }

    // 显示提示
    function showToast(message) {
        const translatedMessage = window.translationManager.t(message);
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${translatedMessage}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // 文本格式化
    function formatText(command) {
        document.execCommand(command, false, null);
        letterEditor.focus();
    }

    // 发送信件
    function sendLetter() {
        const letterEditor = document.getElementById('letter-content');
        const content = letterEditor.value.trim();
        
        if (!content) {
            showToast('letter.emptyContent');
            return;
        }

        const petInfo = JSON.parse(localStorage.getItem('pet-info'));
        if (!petInfo) {
            showToast('letter.needPetInfo');
            return;
        }

        const currentLang = window.translationManager.getCurrentLanguage();
        const letter = {
            id: Date.now(),
            content,
            timestamp: Date.now(),
            isRead: false,
            petName: petInfo.name,
            petType: petInfo.type,
            petBirthDate: petInfo.birthDate,
            language: currentLang,
            reply: generateReply(content) // 添加回信生成
        };

        // 保存信件到 pet-letters
        const letters = JSON.parse(localStorage.getItem('pet-letters') || '[]');
        letters.unshift(letter); // 使用 unshift 将新信件添加到列表开头
        localStorage.setItem('pet-letters', JSON.stringify(letters));

        // 清空编辑器
        letterEditor.value = '';
        updateWordCount();

        // 显示发送成功提示
        showToast('letter.sent');

        // 切换到收信箱页面
        const inboxLink = document.querySelector('.nav-links a[data-tooltip="收信箱"]');
        if (inboxLink) {
            inboxLink.click();
        }
    }

    // 保存草稿
    function saveDraft() {
        const content = letterEditor.value.trim();
        if (!content) {
            showToast('letter.emptyContent');
            return;
        }

        localStorage.setItem('letter-draft', content);
        showToast('letter.draftSaved');
    }

    // 自动保存
    let autoSaveTimer;
    function startAutoSave() {
        autoSaveTimer = setInterval(saveDraft, 60000); // 1分钟自动保存一次
    }

    function stopAutoSave() {
        clearInterval(autoSaveTimer);
    }

    // 事件监听
    if (letterEditor) {
        letterEditor.addEventListener('input', updateWordCount);
    }

    if (boldBtn) {
        boldBtn.addEventListener('click', () => formatText('bold'));
    }

    if (italicBtn) {
        italicBtn.addEventListener('click', () => formatText('italic'));
    }

    if (autoGenerateBtn) {
        autoGenerateBtn.addEventListener('click', generateContent);
    }

    // 绑定保存草稿按钮事件
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('保存草稿按钮被点击'); // 添加调试日志
            saveDraft();
        });
    }

    letterEditor.addEventListener('focus', startAutoSave);
    letterEditor.addEventListener('blur', stopAutoSave);

    // 初始化
    loadDraft();
});

// 智能回信生成
function generateReply(content) {
    // 表情符号库
    const emojis = {
        happy: ["😊", "😄", "😃", "🥰", "😋"],
        love: ["❤️", "💕", "💖", "💝", "💗"],
        play: ["🎾", "🎯", "🎨", "🎪", "🎭"],
        sleep: ["😴", "💤", "🌙", "✨", "🌠"],
        food: ["🍖", "🍗", "🥩", "🍪", "🍩"],
        weather: ["☀️", "🌈", "🌤️", "🌥️", "🌦️"],
        miss: ["💭", "💫", "🌟", "💫", "✨"],
        default: ["🐾", "🐱", "🐶", "🦊", "🐰"]
    };

    // 回复优先级定义
    const REPLY_PRIORITY = {
        QUESTION: 1,    // 问题回复优先级最高
        EMOTION: 2,     // 情感回复次之
        MEMORY: 3,      // 回忆相关
        ACTIVITY: 4,    // 活动相关
        TOPIC: 5        // 主题相关
    };

    // 回复数量限制
    const REPLY_LIMITS = {
        QUESTION: 2,    // 最多回答2个问题
        EMOTION: 2,     // 最多处理2个情感
        MEMORY: 1,      // 最多1个回忆
        ACTIVITY: 1,    // 最多1个活动
        TOPIC: 1        // 最多1个主题
    };

    // 扩展的回复模板库
    const replyTemplates = {
        question: [
            "关于{question}，{answer}",
            "说到{question}，{answer}",
            "你问{question}，{answer}",
            "关于{question}，我想告诉你{answer}",
            "你提到{question}，{answer}"
        ],
        emotion: [
            "我也{emotion}你",
            "感受到你的{emotion}，我也一样",
            "你的{emotion}让我很感动",
            "我完全理解你的{emotion}",
            "你的{emotion}让我想起了我们的点点滴滴"
        ],
        memory: [
            "看到你提到{memory}，我也记得那些美好的时光",
            "说到{memory}，那里有我们最珍贵的回忆",
            "每当想起{memory}，我都会感到温暖",
            "那些{memory}的时光，永远珍藏在我心里",
            "回忆{memory}，让我感到幸福"
        ],
        activity: [
            "说到{activity}，我现在经常{current_activity}",
            "记得我们以前经常{activity}，现在我{current_activity}",
            "你提到{activity}，让我想起我们现在{current_activity}",
            "关于{activity}，我现在{current_activity}",
            "说到{activity}，我现在的生活是{current_activity}"
        ],
        topic: [
            "说到{topic}，{response}",
            "关于{topic}，{response}",
            "你提到{topic}，{response}",
            "说到{topic}，我想告诉你{response}",
            "关于{topic}，{response}"
        ]
    };

    // 获取随机表情
    function getRandomEmoji(type) {
        const emojiList = emojis[type] || emojis.default;
        return emojiList[Math.floor(Math.random() * emojiList.length)];
    }

    // 分析信件内容
    function analyzeContent(text) {
        const analysis = {
            topics: [],
            emotions: [],
            questions: [],
            memories: [],
            activities: []
        };

        // 使用更精确的分词匹配
        const words = text.split(/[，。！？\s]/);
        
        // 检测问题
        const questions = text.match(/[^。！？]*[？?]/g) || [];
        analysis.questions = questions.map(q => q.trim());

        // 检测情感词
        const emotionWords = {
            positive: ["开心", "快乐", "高兴", "喜欢", "爱", "想念", "思念", "温暖", "幸福"],
            negative: ["难过", "伤心", "担心", "害怕", "孤独", "寂寞", "痛苦"],
            miss: ["想", "思念", "想念", "回忆", "记得", "想起"]
        };

        words.forEach(word => {
            for (const [emotion, words] of Object.entries(emotionWords)) {
                if (words.includes(word)) {
                    analysis.emotions.push({ type: emotion, word });
                }
            }
        });

        // 检测主题
        const topics = {
            food: ["吃", "食物", "零食", "饭", "饿", "饱", "美味", "好吃"],
            play: ["玩", "玩具", "球", "跑", "跳", "追", "游戏", "运动"],
            sleep: ["睡", "休息", "困", "累", "梦", "床", "枕头"],
            weather: ["天气", "太阳", "下雨", "阴天", "阳光", "温暖", "冷"],
            memory: ["照片", "相册", "回忆", "以前", "过去", "曾经"],
            activity: ["散步", "玩耍", "奔跑", "跳跃", "追逐", "运动"]
        };

        words.forEach(word => {
            for (const [topic, keywords] of Object.entries(topics)) {
                if (keywords.includes(word)) {
                    analysis.topics.push(topic);
                }
            }
        });

        // 提取具体活动
        const activityPatterns = {
            play: /(一起)?(玩|游戏|运动|跑|跳|追)/g,
            walk: /(一起)?(散步|遛弯|走)/g,
            eat: /(一起)?(吃|喂|食物)/g,
            sleep: /(一起)?(睡|休息|躺)/g
        };

        for (const [type, pattern] of Object.entries(activityPatterns)) {
            const matches = text.match(pattern);
            if (matches) {
                analysis.activities.push({ type, activities: matches });
            }
        }

        // 提取回忆片段
        const memoryPatterns = {
            photo: /(照片|相册|合影)/g,
            place: /(公园|家|房间|院子|花园)/g,
            time: /(早上|中午|下午|晚上|春天|夏天|秋天|冬天)/g
        };

        for (const [type, pattern] of Object.entries(memoryPatterns)) {
            const matches = text.match(pattern);
            if (matches) {
                analysis.memories.push({ type, memories: matches });
            }
        }

        return analysis;
    }

    // 变量定义
    const foodVariables = {
        zh: {
            snack: ["小鱼干", "肉干", "猫粮", "狗粮", "零食", "罐头", "饼干", "水果", "蔬菜"],
            taste: ["超级好吃", "味道很棒", "特别美味", "香喷喷的", "甜甜的", "香香的"]
        },
        en: {
            snack: ["fish snacks", "jerky", "cat food", "dog food", "treats", "canned food", "cookies", "fruits", "vegetables"],
            taste: ["super delicious", "tastes great", "very tasty", "smells wonderful", "sweet", "fragrant"]
        }
    };

    const playVariables = {
        zh: {
            friend: ["小天使", "新朋友", "隔壁的猫咪", "对面的狗狗", "彩虹桥的小伙伴"],
            game: ["追蝴蝶", "玩球", "捉迷藏", "跑步", "跳跃", "追逐", "玩耍"]
        },
        en: {
            friend: ["little angels", "new friends", "neighbor's cat", "opposite dog", "rainbow bridge companions"],
            game: ["chasing butterflies", "playing ball", "hide and seek", "running", "jumping", "chasing", "playing"]
        }
    };

    const sleepVariables = {
        zh: {
            place: ["云朵上", "彩虹下", "花园里", "小窝里", "彩虹桥上"],
            activity: ["看着云朵飘过", "听着天使们的歌声", "感受微风轻拂", "做着美梦"]
        },
        en: {
            place: ["on the clouds", "under the rainbow", "in the garden", "in my little nest", "on the rainbow bridge"],
            activity: ["watching clouds drift by", "listening to angels' songs", "feeling the gentle breeze", "having sweet dreams"]
        }
    };

    const weatherVariables = {
        zh: {
            weather: ["阳光明媚", "微风轻拂", "云朵飘浮", "彩虹挂天", "星光闪烁"],
            activity: ["躺在云朵上晒太阳", "在彩虹上奔跑", "和天使们玩耍", "欣赏美景"]
        },
        en: {
            weather: ["sunny", "breezy", "cloudy", "rainbow in the sky", "starlit"],
            activity: ["lying on clouds sunbathing", "running on the rainbow", "playing with angels", "enjoying the beautiful scenery"]
        }
    };

    const missVariables = {
        zh: {
            time: ["看到云朵", "闻到花香", "听到音乐", "看到星星", "看到彩虹"],
            memory: ["玩耍", "散步", "吃饭", "晒太阳", "拍照", "拥抱"]
        },
        en: {
            time: ["seeing clouds", "smelling flowers", "hearing music", "seeing stars", "seeing rainbows"],
            memory: ["playing", "walking", "eating", "sunbathing", "taking photos", "hugging"]
        }
    };

    const defaultVariables = {
        zh: {
            activity: ["和天使们一起玩耍", "在云朵上奔跑", "在彩虹下散步", "在花园里休息"],
            feeling: ["每天都过得很开心", "感觉特别温暖", "生活很充实", "很幸福"]
        },
        en: {
            activity: ["playing with angels", "running on clouds", "walking under the rainbow", "resting in the garden"],
            feeling: ["having a happy day", "feeling very warm", "life is fulfilling", "very happy"]
        }
    };

    // 随机选择数组中的一个元素
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 分析内容并生成回复
    const analysis = analyzeContent(content);
    const currentLang = window.translationManager.getCurrentLanguage();
    
    // 获取当前语言的变量
    const currentFoodVars = foodVariables[currentLang] || foodVariables.zh;
    const currentPlayVars = playVariables[currentLang] || playVariables.zh;
    const currentSleepVars = sleepVariables[currentLang] || sleepVariables.zh;
    const currentWeatherVars = weatherVariables[currentLang] || weatherVariables.zh;
    const currentMissVars = missVariables[currentLang] || missVariables.zh;
    const currentDefaultVars = defaultVariables[currentLang] || defaultVariables.zh;

    // 修改 generateResponse 函数中的变量引用
    function generateResponse(analysis) {
        let response = [];
        let emojiCount = 0;
        const usedTopics = new Set();
        const responseCount = {
            QUESTION: 0,
            EMOTION: 0,
            MEMORY: 0,
            ACTIVITY: 0,
            TOPIC: 0
        };

        // 获取随机表情（带计数限制）
        function getEmojiWithLimit(type) {
            if (emojiCount >= 3) return '';
            emojiCount++;
            return getRandomEmoji(type);
        }

        // 检查是否达到限制
        function canAddMore(type) {
            return responseCount[type] < REPLY_LIMITS[type];
        }

        // 处理问题
        if (analysis.questions.length > 0 && canAddMore('QUESTION')) {
            analysis.questions.forEach(question => {
                if (responseCount.QUESTION >= REPLY_LIMITS.QUESTION) return;
                
                let answer = '';
                if (question.includes("吃")) {
                    answer = `我今天吃了${getRandomElement(currentFoodVars.snack)}，${getRandomElement(currentFoodVars.taste)}`;
                } else if (question.includes("玩")) {
                    answer = `我和${getRandomElement(currentPlayVars.friend)}一起${getRandomElement(currentPlayVars.game)}，可开心了`;
                } else if (question.includes("睡")) {
                    answer = `我在${getRandomElement(currentSleepVars.place)}休息，${getRandomElement(currentSleepVars.activity)}`;
                } else {
                    answer = `我在这里${getRandomElement(currentDefaultVars.activity)}，${getRandomElement(currentDefaultVars.feeling)}`;
                }

                const template = getRandomElement(replyTemplates.question);
                response.push(template
                    .replace('{question}', question)
                    .replace('{answer}', answer) + getEmojiWithLimit('happy'));
                
                responseCount.QUESTION++;
            });
        }

        // 处理情感
        if (analysis.emotions.length > 0 && canAddMore('EMOTION')) {
            analysis.emotions.forEach(emotion => {
                if (responseCount.EMOTION >= REPLY_LIMITS.EMOTION) return;
                
                let reply = '';
                if (emotion.type === 'positive') {
                    reply = `我也${emotion.word}你`;
                } else if (emotion.type === 'negative') {
                    reply = `别${emotion.word}，我在这里过得很好`;
                } else if (emotion.type === 'miss') {
                    reply = `每当${getRandomElement(currentMissVars.time)}的时候，我也会想起我们一起的${getRandomElement(currentMissVars.memory)}`;
                }

                const template = getRandomElement(replyTemplates.emotion);
                response.push(template
                    .replace('{emotion}', emotion.word) + getEmojiWithLimit('love'));
                
                responseCount.EMOTION++;
            });
        }

        // 处理回忆
        if (analysis.memories.length > 0 && canAddMore('MEMORY')) {
            analysis.memories.forEach(memory => {
                if (responseCount.MEMORY >= REPLY_LIMITS.MEMORY) return;
                
                const template = getRandomElement(replyTemplates.memory);
                response.push(template
                    .replace('{memory}', memory.memories[0]) + getEmojiWithLimit('miss'));
                
                responseCount.MEMORY++;
            });
        }

        // 处理活动
        if (analysis.activities.length > 0 && canAddMore('ACTIVITY')) {
            analysis.activities.forEach(activity => {
                if (responseCount.ACTIVITY >= REPLY_LIMITS.ACTIVITY) return;
                
                let currentActivity = '';
                if (activity.type === 'play') {
                    currentActivity = `和${getRandomElement(currentPlayVars.friend)}一起${getRandomElement(currentPlayVars.game)}`;
                } else if (activity.type === 'walk') {
                    currentActivity = currentLang === 'en' ? 'walking on the rainbow bridge' : '在彩虹桥上散步';
                } else if (activity.type === 'eat') {
                    currentActivity = `吃${getRandomElement(currentFoodVars.snack)}`;
                } else if (activity.type === 'sleep') {
                    currentActivity = `在${getRandomElement(currentSleepVars.place)}休息`;
                }

                const template = getRandomElement(replyTemplates.activity);
                response.push(template
                    .replace('{activity}', activity.activities[0])
                    .replace('{current_activity}', currentActivity) + getEmojiWithLimit('happy'));
                
                responseCount.ACTIVITY++;
            });
        }

        // 处理主题
        if (analysis.topics.length > 0 && canAddMore('TOPIC')) {
            analysis.topics.forEach(topic => {
                if (responseCount.TOPIC >= REPLY_LIMITS.TOPIC || usedTopics.has(topic)) return;
                
                let response = '';
                switch(topic) {
                    case 'food':
                        response = currentLang === 'en' ? 
                            `found amazing ${getRandomElement(currentFoodVars.snack)}` :
                            `发现了超棒的${getRandomElement(currentFoodVars.snack)}`;
                        break;
                    case 'play':
                        response = `和${getRandomElement(currentPlayVars.friend)}一起${getRandomElement(currentPlayVars.game)}`;
                        break;
                    case 'sleep':
                        response = `在${getRandomElement(currentSleepVars.place)}休息`;
                        break;
                    case 'weather':
                        response = `${getRandomElement(currentWeatherVars.weather)}，${getRandomElement(currentWeatherVars.activity)}`;
                        break;
                    case 'memory':
                        response = `想起我们一起的${getRandomElement(currentMissVars.memory)}`;
                        break;
                }

                const template = getRandomElement(replyTemplates.topic);
                response.push(template
                    .replace('{topic}', topic)
                    .replace('{response}', response) + getEmojiWithLimit('happy'));
                
                usedTopics.add(topic);
                responseCount.TOPIC++;
            });
        }

        // 如果没有生成任何回复，使用默认回复
        if (response.length === 0) {
            response.push(currentLang === 'en' ?
                `Received your letter${getEmojiWithLimit('happy')} I'm here ${getRandomElement(currentDefaultVars.activity)}, ${getRandomElement(currentDefaultVars.feeling)}` :
                `收到你的信了${getEmojiWithLimit('happy')} 我在这里${getRandomElement(currentDefaultVars.activity)}，${getRandomElement(currentDefaultVars.feeling)}`);
        }

        // 添加结束语
        response.push(currentLang === 'en' ?
            `Remember to take good care of yourself${getEmojiWithLimit('love')}` :
            `要记得好好照顾自己哦${getEmojiWithLimit('love')}`);

        return response.join('\n\n');
    }

    return generateResponse(analysis);
}

// 保存信件
function saveLetter(content) {
    const letters = JSON.parse(localStorage.getItem('pet-letters')) || [];
    const newLetter = {
        id: Date.now(),
        content,
        timestamp: new Date().toISOString(),
        reply: generateReply(content),
        hasRead: false // 添加已读状态
    };
    letters.unshift(newLetter);
    localStorage.setItem('pet-letters', JSON.stringify(letters));
}

// 加载信件列表
function loadLetters() {
    const lettersList = document.getElementById('letters-list');
    const letters = JSON.parse(localStorage.getItem('pet-letters')) || [];
    
    if (letters.length === 0) {
        lettersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>${window.translationManager.t('letter.noLetters')}</p>
            </div>
        `;
        return;
    }
    
    lettersList.innerHTML = letters.map(letter => {
        const date = new Date(letter.timestamp);
        const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        const preview = letter.content.substring(0, 20) + (letter.content.length > 20 ? '...' : '');
        
        return `
            <div class="letter-item ${!letter.hasRead ? 'has-reply' : ''}" data-id="${letter.id}">
                <div class="letter-content-wrapper">
                    <div class="unread-dot"></div>
                    <div class="letter-date">${formattedDate}</div>
                    <div class="letter-preview">${preview}</div>
                </div>
                <button class="delete-letter" title="删除信件">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }).join('');
    
    // 添加点击事件
    document.querySelectorAll('.letter-item').forEach(item => {
        // 信件内容点击事件
        const contentWrapper = item.querySelector('.letter-content-wrapper');
        contentWrapper.addEventListener('click', () => {
            const letterId = parseInt(item.dataset.id);
            showLetterDetail(letterId);
            // 标记为已读
            markLetterAsRead(letterId);
            // 移除未读标记
            item.classList.remove('has-reply');
        });

        // 删除按钮点击事件
        const deleteBtn = item.querySelector('.delete-letter');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            const letterId = parseInt(item.dataset.id);
            deleteLetter(letterId, item);
        });
    });
}

// 标记信件为已读
function markLetterAsRead(letterId) {
    const letters = JSON.parse(localStorage.getItem('pet-letters')) || [];
    const updatedLetters = letters.map(letter => {
        if (letter.id === letterId) {
            return { ...letter, hasRead: true };
        }
        return letter;
    });
    localStorage.setItem('pet-letters', JSON.stringify(updatedLetters));
}

// 删除信件
function deleteLetter(letterId, element) {
    if (confirm(window.translationManager.t('letter.confirmDelete'))) {
        const letters = JSON.parse(localStorage.getItem('pet-letters')) || [];
        const updatedLetters = letters.filter(letter => letter.id !== letterId);
        localStorage.setItem('pet-letters', JSON.stringify(updatedLetters));
        
        // 添加删除动画
        element.style.opacity = '0';
        element.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            element.remove();
            
            // 检查是否还有信件
            const lettersList = document.getElementById('letters-list');
            if (lettersList.children.length === 0) {
                lettersList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>${window.translationManager.t('letter.noLetters')}</p>
                    </div>
                `;
            }
            
            // 显示删除成功提示
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<i class="fas fa-check-circle"></i> ${window.translationManager.t('letter.deleted')}`;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 2000);
            }, 100);
        }, 300);
    }
}

// 显示信件详情
function showLetterDetail(letterId) {
    const modal = document.getElementById('letter-detail-modal');
    const replyContent = document.getElementById('reply-content');
    const signature = modal.querySelector('.letter-signature');
    const greeting = modal.querySelector('.letter-greeting');
    
    if (!modal || !replyContent || !signature || !greeting) return;
    
    // 获取信件数据
    const letters = JSON.parse(localStorage.getItem('pet-letters') || '[]');
    const letter = letters.find(l => l.id === letterId);
    
    if (letter) {
        // 显示回信内容
        replyContent.innerHTML = letter.reply || '';
        
        // 设置称呼和署名
        const petInfo = JSON.parse(localStorage.getItem('pet-info'));
        
        if (petInfo && petInfo.name) {
            // 更新署名的参数
            const params = { name: petInfo.name };
            console.log('Setting signature params:', params);
            signature.setAttribute('data-i18n-params', JSON.stringify(params));
            
            // 手动更新署名文本
            const currentLang = window.translationManager.getCurrentLanguage();
            console.log('Current language:', currentLang);
            const signatureText = window.translationManager.t('letter.signature', params);
            console.log('Translated signature:', signatureText);
            signature.textContent = signatureText;
            
            // 触发页面内容更新
            window.translationManager.updatePageContent();
        }
        
        // 显示模态框
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
        // 添加关闭按钮事件
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                closeModal();
            };
        }
        
        // 点击遮罩层关闭
        modal.onclick = function(e) {
            if (e.target === modal) {
                closeModal();
            }
        };
        
        // 标记为已读
        markLetterAsRead(letterId);
    }
}

// 关闭模态框的函数
function closeModal() {
    const modal = document.getElementById('letter-detail-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// 加载草稿
function loadDraft() {
    const letterEditor = document.getElementById('letter-content');
    if (!letterEditor) return;
    
    const draft = localStorage.getItem('letter-draft');
    if (draft) {
        letterEditor.value = draft;
        updateWordCount();
    }
} 