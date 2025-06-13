class TranslationManager {
    constructor() {
        this.currentLang = 'zh';
        this.translations = {
            'zh': {
                "nav": {
                    "home": "首页",
                    "write": "写信",
                    "inbox": "收信箱",
                    "capsule": "时光胶囊"
                },
                "pet": {
                    "title": "宠物信息",
                    "name": "昵称",
                    "namePlaceholder": "毛孩子的名字",
                    "type": "类型",
                    "selectType": "请选择类型",
                    "typeCat": "猫咪",
                    "typeDog": "狗狗",
                    "typeOther": "其他",
                    "breed": "品种",
                    "breedPlaceholder": "例如：金毛、布偶猫",
                    "status": "宠物状态",
                    "statusWithMe": "💖 在身边",
                    "statusInHeaven": "🪐 去宠星",
                    "birthDate": "出生日期",
                    "adoptDate": "到家日期",
                    "datePlaceholder": "例如：2025/6/8",
                    "dateFormat": "请按照 年/月/日 的格式输入",
                    "save": "保存宠物信息",
                    "uploadPhoto": "上传宠物照片",
                    "uploadTip": "支持 JPG、PNG、GIF、WEBP 格式，大小不超过 5MB",
                    "unnamed": "未命名",
                    "age": "年龄",
                    "togetherDays": "相伴天数"
                },
                "letter": {
                    "title": "给{name}的信",
                    "placeholder": "写下你想说的话...",
                    "saveDraft": "保存草稿",
                    "send": "寄往彩虹桥",
                    "autoGenerate": "帮我表达思念 ✨",
                    "detail": "信件详情",
                    "reply": "宠物回信",
                    "confirmDelete": "确定要删除这封信吗？",
                    "deleted": "信件已删除",
                    "noLetters": "还没有寄出的信件",
                    "needPetInfo": "请先创建宠物信息",
                    "emptyContent": "请先写点什么吧",
                    "sending": "信件正在飞往彩虹桥...",
                    "sent": "信件已成功寄出",
                    "draftSaved": "草稿已保存",
                    "contentGenerated": "已生成思念内容",
                    "greeting": "亲爱的主人：",
                    "signature": "永远爱你的{name}"
                },
                "capsule": {
                    "upload": "点击上传照片",
                    "photoCount": "已存入 {count} 张照片",
                    "clear": "清空照片",
                    "slideshow": "播放幻灯片",
                    "memoryTitle": "时光记忆",
                    "noPhoto": "没有照片可以投送",
                    "sendSuccess": "照片已成功投送到时光胶囊",
                    "sendFailed": "投送失败，请重试",
                    "initFailed": "初始化失败，请刷新页面重试",
                    "loadFailed": "加载幻灯片失败，请重试",
                    "clearSuccess": "已清空所有照片",
                    "clearFailed": "清空失败，请重试",
                    "saveFailed": "保存失败，请重试",
                    "needMorePhotos": "需要至少3张照片才能播放幻灯片哦~"
                },
                "common": {
                    "appName": "Time Capsule",
                    "edit": "编辑",
                    "save": "保存",
                    "cancel": "取消",
                    "confirm": "确认",
                    "loading": "加载中..."
                },
                "page": {
                    "title": "Time Capsule | 给毛孩子的时光胶囊",
                    "footer": "Time Capsule &copy; 2023 | 每一份爱都值得被永恒珍藏"
                }
            },
            'en': {
                "nav": {
                    "home": "Home",
                    "write": "Write",
                    "inbox": "Inbox",
                    "capsule": "Time Capsule"
                },
                "pet": {
                    "title": "Pet Information",
                    "name": "Name",
                    "namePlaceholder": "Your pet's name",
                    "type": "Type",
                    "selectType": "Select Type",
                    "typeCat": "Cat",
                    "typeDog": "Dog",
                    "typeOther": "Other",
                    "breed": "Breed",
                    "breedPlaceholder": "e.g., Golden Retriever, Ragdoll",
                    "status": "Status",
                    "statusWithMe": "💖 With Me",
                    "statusInHeaven": "🪐 In Heaven",
                    "birthDate": "Birth Date",
                    "adoptDate": "Adoption Date",
                    "datePlaceholder": "e.g., 2025/6/8",
                    "dateFormat": "Please use YYYY/MM/DD format",
                    "save": "Save Pet Info",
                    "uploadPhoto": "Upload Pet Photo",
                    "uploadTip": "Supports JPG, PNG, GIF, WEBP formats, max 5MB",
                    "unnamed": "Unnamed",
                    "age": "Age",
                    "togetherDays": "Days Together"
                },
                "letter": {
                    "title": "Letter to {name}",
                    "placeholder": "Write your message...",
                    "saveDraft": "Save Draft",
                    "send": "Send to Rainbow Bridge",
                    "autoGenerate": "Help Me Express ✨",
                    "detail": "Letter Details",
                    "reply": "Pet's Reply",
                    "confirmDelete": "Are you sure you want to delete this letter?",
                    "deleted": "Letter has been deleted",
                    "noLetters": "No letters sent yet",
                    "needPetInfo": "Please create pet information first",
                    "emptyContent": "Please write something first",
                    "sending": "Letter is flying to the Rainbow Bridge...",
                    "sent": "Letter has been sent successfully",
                    "draftSaved": "Draft has been saved",
                    "contentGenerated": "Content has been generated",
                    "greeting": "Dear Owner:",
                    "signature": "Forever yours,\n{name}"
                },
                "capsule": {
                    "upload": "Click to Upload Photo",
                    "photoCount": "{count} Photos Stored",
                    "clear": "Clear Photos",
                    "slideshow": "Play Slideshow",
                    "memoryTitle": "Time Memories",
                    "noPhoto": "No photo to send",
                    "sendSuccess": "Photo successfully sent to time capsule",
                    "sendFailed": "Failed to send, please try again",
                    "initFailed": "Initialization failed, please refresh the page",
                    "loadFailed": "Failed to load slideshow, please try again",
                    "clearSuccess": "All photos have been cleared",
                    "clearFailed": "Failed to clear, please try again",
                    "saveFailed": "Failed to save, please try again",
                    "needMorePhotos": "Need at least 3 photos to play slideshow"
                },
                "common": {
                    "appName": "Time Capsule",
                    "edit": "Edit",
                    "save": "Save",
                    "cancel": "Cancel",
                    "confirm": "Confirm",
                    "loading": "Loading..."
                },
                "page": {
                    "title": "Time Capsule | Time Capsule for Your Pet",
                    "footer": "Time Capsule &copy; 2023 | Every Love Deserves to be Treasured Forever"
                }
            }
        };
        this.loaded = true;
        console.log('TranslationManager initialized');
    }

    // 获取翻译文本（带参数替换）
    t(key, params = {}) {
        console.log('Getting translation for key:', key, 'with params:', params);
        if (!this.loaded) {
            console.warn('Translations not loaded yet');
            return key;
        }

        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            value = value[k];
            if (!value) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        // 处理带参数的翻译
        if (typeof value === 'string') {
            const result = value.replace(/\{(\w+)\}/g, (match, key) => {
                return params[key] !== undefined ? params[key] : match;
            });
            console.log('Translation result:', result);
            return result;
        }

        return value;
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLang;
    }

    // 获取当前宠物名称
    getCurrentPetName() {
        const petInfo = JSON.parse(localStorage.getItem('pet-info'));
        return petInfo ? petInfo.name : '';
    }

    // 更新信件内容
    updateLetterContent() {
        const letterContent = document.getElementById('letter-content');
        const greetingEl = document.querySelector('.letter-greeting');
        const signatureEl = document.querySelector('.letter-signature');
        
        if (letterContent && letterContent.dataset.i18n) {
            letterContent.placeholder = this.t('letter.placeholder');
        }
        
        if (greetingEl) {
            greetingEl.textContent = this.t('letter.greeting');
        }
        
        if (signatureEl) {
            const petName = this.getCurrentPetName();
            signatureEl.textContent = this.t('letter.signature', { name: petName });
        }
    }

    // 切换语言并更新页面
    setLanguage(lang) {
        console.log('Setting language to:', lang);
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not supported`);
            return;
        }
        
        this.currentLang = lang;
        document.documentElement.lang = lang;
        this.updatePageContent();
        this.updateLetterContent();
    }

    // 更新页面所有文本内容
    updatePageContent() {
        console.log('Updating page content for language:', this.currentLang);
        
        // 1. 更新所有带data-i18n属性的元素
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            let params = {};
            
            // 检查是否有参数
            if (el.hasAttribute('data-i18n-params')) {
                try {
                    params = JSON.parse(el.getAttribute('data-i18n-params'));
                    console.log('Found params for element:', key, params);
                } catch (e) {
                    console.error('Error parsing data-i18n-params:', e);
                }
            }
            
            const translatedText = this.t(key, params);
            console.log('Translating element:', key, 'with params:', params, 'result:', translatedText);
            el.textContent = translatedText;
        });

        // 2. 更新带data-i18n-placeholder的输入框
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = this.t(el.dataset.i18nPlaceholder);
        });

        // 3. 更新带data-i18n-title的元素title属性
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.title = this.t(el.dataset.i18nTitle);
        });

        // 4. 更新页面标题
        document.title = this.t('page.title');

        // 5. 更新页脚文本
        const footerText = document.querySelector('footer p');
        if (footerText) {
            footerText.textContent = this.t('page.footer');
        }

        // 6. 更新语言按钮显示
        this.updateLanguageButton();

        // 触发语言切换事件
        console.log('Dispatching languageChanged event with language:', this.currentLang);
        const event = new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        });
        document.dispatchEvent(event);
    }

    // 更新语言按钮显示
    updateLanguageButton() {
        const langNames = {
            'zh': '中文',
            'en': 'English',
            'ja': '日本語',
            'ko': '한국어',
            'fr': 'Français',
            'de': 'Deutsch',
            'es': 'Español'
        };
        
        const currentLangEl = document.querySelector('.current-lang');
        if (currentLangEl) {
            currentLangEl.textContent = langNames[this.currentLang] || this.currentLang;
        }
    }
}

// 创建全局翻译管理器实例
window.translationManager = new TranslationManager(); 