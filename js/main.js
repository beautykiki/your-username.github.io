// 移动端菜单切换
const mobileMenu = document.querySelector('.mobile-menu');
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// 开始写信按钮点击事件
const primaryBtn = document.querySelector('.primary-btn');
if (primaryBtn) {
    primaryBtn.addEventListener('click', () => {
        window.location.href = 'write.html';
    });
}

// 页面切换功能
function switchPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
        setTimeout(() => {
            targetPage.classList.add('active');
        }, 50);
    }

    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
}

// 装饰元素动画
document.querySelectorAll('.decoration').forEach((el, index) => {
    el.style.animationDelay = `${index * 2}s`;
});

// 宠物信息管理功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查本地存储中是否有宠物信息
    const petData = localStorage.getItem('petData');
    
    if (petData) {
        // 如果有宠物信息，显示宠物信息
        displayPetInfo(JSON.parse(petData));
    } else {
        // 否则显示表单
        const petFormContainer = document.getElementById('pet-form-container');
        if (petFormContainer) {
            petFormContainer.style.display = 'block';
        }
    }
    
    // 头像上传预览（表单区域）
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarUpload = document.getElementById('avatar-upload');
    
    // 头像上传（展示区域）
    const petAvatarDisplay = document.getElementById('pet-avatar-display');
    const avatarUploadDisplay = document.getElementById('avatar-upload-display');
    
    // 处理头像上传的通用函数
    function handleAvatarUpload(file, previewElement, callback) {
        if (file && previewElement) {
            // 显示上传中状态
            previewElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>正在处理图片...</span>';
            console.log('开始处理图片...'); // 调试日志
            
            // 检查文件类型
            if (!file.type.startsWith('image/')) {
                alert('请选择图片文件！');
                previewElement.innerHTML = '<i class="fas fa-camera"></i><span>点击选择照片</span>';
                return;
            }
            
            // 检查文件大小（限制为2MB）
            if (file.size > 2 * 1024 * 1024) {
                alert('图片大小不能超过2MB！');
                previewElement.innerHTML = '<i class="fas fa-camera"></i><span>点击选择照片</span>';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                console.log('文件读取完成，开始处理图片...'); // 调试日志
                
                // 创建图片对象以检查尺寸
                const img = new Image();
                img.onload = function() {
                    console.log('图片加载完成，开始压缩...'); // 调试日志
                    
                    // 检查图片尺寸
                    if (img.width < 200 || img.height < 200) {
                        alert('图片尺寸太小，请选择至少200x200像素的图片！');
                        previewElement.innerHTML = '<i class="fas fa-camera"></i><span>点击选择照片</span>';
                        return;
                    }
                    
                    // 创建canvas进行图片压缩
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // 设置最大尺寸
                    const maxSize = 800;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height && width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // 绘制图片
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 转换为base64
                    const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
                    console.log('图片处理完成，准备显示...'); // 调试日志
                    
                    // 调用回调函数处理压缩后的图片
                    callback(compressedImage);
                };
                img.onerror = function() {
                    console.error('图片加载失败'); // 调试日志
                    alert('图片加载失败，请重试！');
                    previewElement.innerHTML = '<i class="fas fa-camera"></i><span>点击选择照片</span>';
                };
                img.src = event.target.result;
            };
            reader.onerror = function() {
                console.error('文件读取失败'); // 调试日志
                alert('文件读取失败，请重试！');
                previewElement.innerHTML = '<i class="fas fa-camera"></i><span>点击选择照片</span>';
            };
            reader.readAsDataURL(file);
        }
    }
    
    // 表单区域头像上传
    if (avatarUpload && avatarPreview) {
        avatarUpload.addEventListener('change', function(e) {
            console.log('文件选择改变'); // 调试日志
            const file = e.target.files[0];
            if (file) {
                handleAvatarUpload(file, avatarPreview, function(compressedImage) {
                    console.log('准备显示预览图片'); // 调试日志
                    // 清除现有内容
                    avatarPreview.innerHTML = '';
                    // 添加新图片
                    const img = document.createElement('img');
                    img.src = compressedImage;
                    img.alt = '头像预览';
                    img.onload = function() {
                        console.log('预览图片加载完成'); // 调试日志
                        avatarPreview.appendChild(img);
                        avatarPreview.classList.add('has-image');
                    };
                    img.onerror = function() {
                        console.error('预览图片加载失败'); // 调试日志
                        alert('图片加载失败，请重试！');
                        avatarPreview.innerHTML = '<i class="fas fa-camera"></i><span>点击选择照片</span>';
                    };
                });
            }
        });
    }
    
    // 展示区域头像上传
    if (avatarUploadDisplay && petAvatarDisplay) {
        avatarUploadDisplay.addEventListener('change', function(e) {
            console.log('展示区域文件选择改变'); // 调试日志
            const file = e.target.files[0];
            if (file) {
                handleAvatarUpload(file, petAvatarDisplay, function(compressedImage) {
                    console.log('准备更新展示区域头像'); // 调试日志
                    // 更新展示区域的头像
                    const avatarImg = document.getElementById('pet-avatar-img');
                    if (avatarImg) {
                        avatarImg.onload = function() {
                            console.log('展示区域头像加载完成'); // 调试日志
                            // 更新本地存储中的头像
                            const petData = JSON.parse(localStorage.getItem('petData'));
                            if (petData) {
                                petData.avatar = compressedImage;
                                localStorage.setItem('petData', JSON.stringify(petData));
                            }
                        };
                        avatarImg.onerror = function() {
                            console.error('展示区域头像加载失败'); // 调试日志
                            alert('图片加载失败，请重试！');
                        };
                        avatarImg.src = compressedImage;
                    }
                });
            }
        });
    }
    
    // 日期格式验证函数
    function isValidDate(dateStr) {
        const regex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
        if (!regex.test(dateStr)) return false;
        
        const [year, month, day] = dateStr.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        
        return date.getFullYear() === year &&
               date.getMonth() === month - 1 &&
               date.getDate() === day;
    }
    
    // 表单验证和按钮状态控制
    function validateForm() {
        const name = document.getElementById('pet-name').value;
        const type = document.getElementById('pet-type').value;
        const breed = document.getElementById('pet-breed').value;
        const birthDate = document.getElementById('birth-date').value;
        const adoptDate = document.getElementById('adopt-date').value;
        const submitBtn = document.querySelector('.primary-btn');

        // 检查所有必填字段
        const isValid = name && type && breed && birthDate && adoptDate;
        
        if (submitBtn) {
            if (isValid) {
                submitBtn.classList.add('active');
            } else {
                submitBtn.classList.remove('active');
            }
        }
    }

    // 为所有输入字段添加事件监听
    const formInputs = document.querySelectorAll('#pet-form input, #pet-form select');
    formInputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });

    // 初始验证
    validateForm();

    // 表单提交
    const petForm = document.getElementById('pet-form');
    if (petForm) {
        petForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('表单提交事件触发'); // 调试日志
            
            const birthDate = document.getElementById('birth-date').value;
            const adoptDate = document.getElementById('adopt-date').value;
            
            // 验证日期格式
            if (!isValidDate(birthDate)) {
                alert('请输入正确的出生日期格式（年/月/日）！');
                return;
            }
            
            if (!isValidDate(adoptDate)) {
                alert('请输入正确的到家日期格式（年/月/日）！');
                return;
            }
            
            // 获取表单数据
            const petData = {
                name: document.getElementById('pet-name').value,
                type: document.getElementById('pet-type').value,
                breed: document.getElementById('pet-breed').value,
                status: document.querySelector('input[name="pet-status"]:checked')?.value || 'living',
                birthDate: birthDate,
                adoptDate: adoptDate,
                avatar: avatarPreview?.querySelector('img')?.src || ''
            };
            
            // 验证必填字段
            if (!petData.name) {
                alert('请输入宠物名字！');
                return;
            }
            
            if (!petData.type) {
                alert('请选择宠物类型！');
                return;
            }
            
            if (!petData.breed) {
                alert('请输入宠物品种！');
                return;
            }
            
            // 验证日期逻辑
            const birthDateObj = new Date(birthDate.replace(/\//g, '-'));
            const adoptDateObj = new Date(adoptDate.replace(/\//g, '-'));
            
            if (adoptDateObj < birthDateObj) {
                alert('到家日期不能早于出生日期！');
                return;
            }
            
            console.log('保存宠物数据:', petData); // 调试日志
            
            // 保存到本地存储
            localStorage.setItem('petData', JSON.stringify(petData));
            
            // 显示宠物信息
            displayPetInfo(petData);
            
            // 显示成功提示
            alert('宠物信息保存成功！');
        });
    }
    
    // 点击头像编辑信息
    document.getElementById('pet-avatar-display').addEventListener('click', function() {
        // 隐藏展示区域，显示表单
        document.getElementById('pet-display').style.display = 'none';
        document.getElementById('pet-form-container').style.display = 'block';
        
        // 加载现有数据到表单
        const petData = JSON.parse(localStorage.getItem('petData'));
        if (petData) {
            document.getElementById('pet-name').value = petData.name;
            document.getElementById('pet-type').value = petData.type;
            document.getElementById('pet-breed').value = petData.breed;
            document.querySelector(`input[name="pet-status"][value="${petData.status}"]`).checked = true;
            document.getElementById('birth-date').value = petData.birthDate;
            document.getElementById('adopt-date').value = petData.adoptDate;
            
            if (petData.avatar) {
                avatarPreview.innerHTML = `<img src="${petData.avatar}" alt="头像预览">`;
            }
        }
    });
});

// 显示宠物信息
function displayPetInfo(petData) {
    // 隐藏表单
    const petFormContainer = document.getElementById('pet-form-container');
    if (petFormContainer) {
        petFormContainer.style.display = 'none';
    }
    
    // 显示宠物信息
    const petDisplay = document.getElementById('pet-display');
    if (petDisplay) {
        petDisplay.style.display = 'block';
        
        // 填充数据
        const petNameDisplay = document.getElementById('pet-name-display');
        if (petNameDisplay) {
            petNameDisplay.textContent = petData.name;
        }
        
        const avatarImg = document.getElementById('pet-avatar-img');
        if (avatarImg) {
            if (petData.avatar) {
                avatarImg.src = petData.avatar;
            } else {
                // 默认头像
                avatarImg.src = petData.type === 'cat' ? 
                    'https://cdn-icons-png.flaticon.com/512/220/220124.png' : 
                    'https://cdn-icons-png.flaticon.com/512/620/620851.png';
            }
        }
        
        // 计算年龄和相伴天数
        const birthDate = new Date(petData.birthDate.replace(/\//g, '-'));
        const adoptDate = new Date(petData.adoptDate.replace(/\//g, '-'));
        const today = new Date();
        
        // 计算年龄（年）
        const ageInYears = today.getFullYear() - birthDate.getFullYear();
        const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                            (today.getMonth() - birthDate.getMonth());
        
        let ageDisplay;
        if (ageInYears > 0) {
            ageDisplay = `${ageInYears}岁`;
        } else {
            ageDisplay = `${ageInMonths}个月`;
        }
        
        const petAgeDisplay = document.getElementById('pet-age-display');
        if (petAgeDisplay) {
            petAgeDisplay.textContent = ageDisplay;
        }
        
        // 计算相伴天数
        const togetherDays = Math.floor((today - adoptDate) / (24 * 60 * 60 * 1000));
        const togetherDaysDisplay = document.getElementById('together-days-display');
        if (togetherDaysDisplay) {
            togetherDaysDisplay.textContent = `${togetherDays}天`;
        }
    }
}

// 初始化Quill编辑器
const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic'],
            ['emoji']
        ]
    },
    placeholder: '亲爱的毛孩子，今天我又想你了...'
});

// 更新信纸头部信息
function updateLetterHeader() {
    const petData = JSON.parse(localStorage.getItem('petData')) || {};
    const petNameLetter = document.getElementById('pet-name-letter');
    const letterDate = document.getElementById('letter-date');
    
    if (petNameLetter) {
        petNameLetter.textContent = petData.name || '毛孩子';
    }
    
    if (letterDate) {
        letterDate.textContent = new Date().toLocaleDateString();
    }
}

// 情感分析函数
function analyzeSentiment(content) {
    const keywords = {
        思念: ['想', '思念', '回忆', '记得', '想念', '怀念'],
        快乐: ['开心', '快乐', '高兴', '幸福', '笑', '玩'],
        悲伤: ['难过', '伤心', '哭', '泪', '痛', '失去'],
        日常: ['今天', '昨天', '明天', '现在', '最近']
    };
    
    let maxCount = 0;
    let dominantSentiment = '日常';
    
    for (const [sentiment, words] of Object.entries(keywords)) {
        const count = words.reduce((acc, word) => {
            return acc + (content.includes(word) ? 1 : 0);
        }, 0);
        
        if (count > maxCount) {
            maxCount = count;
            dominantSentiment = sentiment;
        }
    }
    
    return dominantSentiment;
}

// 生成回信
function generateReply(originalLetter) {
    const petData = JSON.parse(localStorage.getItem('petData')) || {};
    const { name, gender } = petData;
    const content = originalLetter.content;
    const sentiment = analyzeSentiment(content);
    
    // 性别化称呼
    const pronoun = gender === 'male' ? '爸爸' : '妈妈';
    
    // 基于情感的回信模板
    const templates = {
        思念: [
            `${pronoun}别太想我，我在彩虹桥这边很好~`,
            `每次${pronoun}想我的时候，我都会变成小星星⭐来看你`,
            `我在宠星这边过得很好，${pronoun}要开心哦`,
            `记得我的呼噜声吗？那是我在说"我也想你"呢`
        ],
        快乐: [
            `看到${pronoun}开心我也好开心！`,
            `记得我们一起去公园的日子吗？那是我最快乐的时光`,
            `我也在宠星交到了很多新朋友，每天都玩得很开心`,
            `希望${pronoun}永远这么开心，我会一直守护着你`
        ],
        悲伤: [
            `${pronoun}不要难过，我在这里一切都好`,
            `当你想我的时候，就看看天空中最亮的那颗星星吧`,
            `我会一直陪在${pronoun}身边，只是换了一种方式`,
            `记住我们在一起的快乐时光，那是我最珍贵的回忆`
        ],
        日常: [
            `谢谢${pronoun}的关心，我在宠星过得很好`,
            `今天天气真好，我在彩虹桥上晒太阳呢`,
            `我在宠星交到了新朋友，每天都很开心`,
            `${pronoun}要好好照顾自己哦，我会一直守护着你`
        ]
    };
    
    // 特殊关键词触发
    if (content.includes('生日')) {
        return `谢谢${pronoun}记得我的生日！我在宠星吃了好多罐头🎂，还收到了很多小伙伴的祝福呢！`;
    }
    
    if (content.includes('照片')) {
        return `那些照片都是我们最珍贵的回忆呢！每次${pronoun}看照片的时候，我都在旁边偷偷看着哦~`;
    }
    
    if (content.includes('玩具')) {
        return `我在宠星也有好多玩具，但最想念的还是${pronoun}陪我玩的时候~`;
    }
    
    // 随机选择一个模板
    const responses = templates[sentiment];
    return responses[Math.floor(Math.random() * responses.length)];
}

// 发送信件
document.getElementById('send-letter').addEventListener('click', function() {
    const content = quill.root.innerHTML;
    if (content === '<p><br></p>') {
        alert('请先写点内容再发送');
        return;
    }
    
    const letter = {
        id: Date.now(),
        content: content,
        timestamp: new Date(),
        status: 'sent'
    };
    
    const transaction = db.transaction(['letters'], 'readwrite');
    const store = transaction.objectStore('letters');
    const request = store.add(letter);
    
    request.onsuccess = () => {
        quill.setContents([]);
        loadLetters();
        
        // 显示彩虹桥动画
        const rainbowBridge = document.createElement('div');
        rainbowBridge.className = 'rainbow-bridge';
        rainbowBridge.innerHTML = `
            <div class="rainbow">
                <div class="rainbow-layer"></div>
                <div class="rainbow-layer"></div>
                <div class="rainbow-layer"></div>
                <div class="rainbow-layer"></div>
                <div class="rainbow-layer"></div>
                <div class="rainbow-layer"></div>
                <div class="rainbow-layer"></div>
                <div class="rainbow-message">信件正在飞往彩虹桥...</div>
            </div>
        `;
        document.body.appendChild(rainbowBridge);
        
        // 3秒后生成回信
        setTimeout(() => {
            generateReply(letter);
            rainbowBridge.remove();
        }, 3000);
    };
    
    request.onerror = (event) => {
        console.error('保存信件失败:', event.target.error);
        alert('发送失败，请重试');
    };
});

// 页面加载时更新信纸头部
document.addEventListener('DOMContentLoaded', function() {
    updateLetterHeader();
});

// 初始化IndexedDB
let db;
const request = indexedDB.open('TimeCapsuleDB', 1);

request.onerror = (event) => {
    console.error('数据库错误:', event.target.error);
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains('letters')) {
        const store = db.createObjectStore('letters', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('status', 'status', { unique: false });
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadLetters();
};

// 加载信件
function loadLetters() {
    const inboxContainer = document.getElementById('inbox-container');
    const emptyInbox = document.getElementById('empty-inbox');
    
    const transaction = db.transaction(['letters'], 'readonly');
    const store = transaction.objectStore('letters');
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev');
    
    inboxContainer.innerHTML = '';
    
    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const letter = cursor.value;
            const letterElement = document.createElement('div');
            letterElement.className = 'letter';
            
            letterElement.innerHTML = `
                <div class="letter-header">
                    <div class="letter-date">${new Date(letter.timestamp).toLocaleString()}</div>
                </div>
                <div class="letter-content">${letter.content}</div>
            `;
            
            inboxContainer.appendChild(letterElement);
            cursor.continue();
        } else {
            if (inboxContainer.children.length === 0) {
                inboxContainer.appendChild(emptyInbox);
                emptyInbox.style.display = 'block';
            } else {
                emptyInbox.style.display = 'none';
            }
        }
    };
}

// 定时检查是否需要生成回信（早晚8点）
function checkReplyTime() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour === 8 || hour === 20) {
        const transaction = db.transaction(['letters'], 'readonly');
        const store = transaction.objectStore('letters');
        const index = store.index('status');
        const request = index.getAll('sent');
        
        request.onsuccess = (event) => {
            const letters = event.target.result;
            if (letters.length > 0) {
                const lastLetter = letters[letters.length - 1];
                generateReply(lastLetter);
            }
        };
    }
}

// 每小时检查一次是否需要生成回信
setInterval(checkReplyTime, 3600000);

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 导航事件监听
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            switchPage(item.dataset.page);
        });
    });

    // 默认显示首页
    switchPage('home');

    // 添加装饰动画
    document.querySelectorAll('.decoration').forEach((decoration, index) => {
        decoration.style.animationDelay = `${index * 2}s`;
    });
}); 