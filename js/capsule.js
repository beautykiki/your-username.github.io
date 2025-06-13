// 时光胶囊功能
// IndexedDB 数据库配置
const DB_NAME = 'TimeCapsuleDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

document.addEventListener('DOMContentLoaded', async function() {
    const photoContainer = document.getElementById('photo-container');
    const uploadTrigger = document.getElementById('upload-trigger');
    const fileInput = document.createElement('input');
    const flipCardElement = document.querySelector('.flip-card');
    const photoFront = document.getElementById('photo-front');
    const backToFront = document.getElementById('back-to-front');
    const editArea = document.querySelector('.edit-area');
    const sendToCapsuleBtn = document.getElementById('send-to-capsule');
    const slideshowBtn = document.getElementById('slideshow-btn');
    const slideshowModal = document.getElementById('slideshow-modal');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const slidesContainer = document.getElementById('slideshow-slides');
    const currentSlideSpan = document.getElementById('current-slide');
    const totalSlidesSpan = document.getElementById('total-slides');
    const photoCounter = document.getElementById('photo-counter');
    const glassCapsule = document.querySelector('.glass-capsule');
    const exitSlideshowBtn = document.querySelector('.exit-slideshow');

    let currentSlide = 0;
    let slides = [];
    let slideshowInterval = null;
    let playbackSpeed = 3000; // 默认播放速度3秒

    // 文件上传设置
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // 初始化函数
    async function initialize() {
        try {
            // 初始化数据库
            await initDB();
            
            // 获取所有照片
            const photos = await getAllPhotos();
            
            // 更新照片计数器
            updatePhotoCounter();
            
            // 更新幻灯片按钮状态
            if (photos.length >= 3) {
                slideshowBtn.classList.remove('disabled');
            } else {
                slideshowBtn.classList.add('disabled');
            }
            
            // 创建星星特效
            if (photos.length > 0 && glassCapsule) {
                // 先清除现有的星星
                const existingStars = document.querySelectorAll('.capsule-star');
                existingStars.forEach(star => star.remove());
                
                // 等待胶囊容器完全渲染
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // 获取胶囊容器的实际尺寸
                const capsuleRect = glassCapsule.getBoundingClientRect();
                const capsuleWidth = capsuleRect.width;
                const capsuleHeight = capsuleRect.height;
                
                // 计算安全区域（留出更大的边距）
                const margin = 30;
                const safeWidth = capsuleWidth - (margin * 2);
                const safeHeight = capsuleHeight - (margin * 2);
                
                // 创建星星
                for (let i = 0; i < photos.length; i++) {
                    const star = document.createElement('div');
                    star.className = 'capsule-star';
                    star.innerHTML = '<i class="fas fa-star"></i>';
                    
                    // 在底部区域生成星星（70%-85%的高度范围）
                    const x = Math.random() * safeWidth + margin;
                    const y = Math.random() * (safeHeight * 0.15) + (safeHeight * 0.7);
                    
                    // 设置星星位置
                    star.style.position = 'absolute';
                    star.style.left = `${x}px`;
                    star.style.top = `${y}px`;
                    
                    // 添加随机旋转角度
                    const rotation = Math.random() * 30 - 15;
                    star.style.transform = `rotate(${rotation}deg)`;
                    
                    // 添加到胶囊容器
                    glassCapsule.appendChild(star);
                    
                    // 强制重绘
                    star.offsetHeight;
                    
                    // 显示星星
                    requestAnimationFrame(() => {
                        star.classList.add('show');
                    });
                }
            }

            // 初始化所有文本内容
            const currentLang = window.translationManager.getCurrentLanguage();
            
            // 更新投送胶囊按钮文本
            if (sendToCapsuleBtn) {
                sendToCapsuleBtn.innerHTML = `
                    <i class="fas fa-paper-plane"></i>
                    ${currentLang === 'en' ? 'Send to Capsule' : '投送胶囊'}
                `;
            }

            // 更新编辑提示文本
            const editPrompt = document.querySelector('.edit-prompt');
            if (editPrompt) {
                editPrompt.textContent = currentLang === 'en' ? 
                    'Click here to write down your feelings at this moment...' : 
                    '点击这里写下这一刻的心情...';
            }

            // 更新日期输入框占位符
            const dateInput = document.querySelector('.date-input');
            if (dateInput) {
                dateInput.placeholder = currentLang === 'en' ? 
                    'Enter date (e.g., 2024/3/21)' : 
                    '输入日期（例如：2024/3/21）';
            }

            // 更新记忆输入框占位符
            const memoryInput = document.querySelector('.memory-input');
            if (memoryInput) {
                memoryInput.placeholder = currentLang === 'en' ? 
                    'Write down your feelings at this moment...' : 
                    '写下这一刻的心情...';
            }

            // 更新保存按钮文本
            const saveButton = document.getElementById('save-memory');
            if (saveButton) {
                saveButton.innerHTML = `
                    <i class="fas fa-save"></i>
                    ${currentLang === 'en' ? 'Save Memory' : '保存记忆'}
                `;
            }

        } catch (error) {
            console.error('初始化失败:', error);
            showToast('capsule.initFailed');
        }
    }

    // 添加前进后退按钮事件监听
    prevBtn.addEventListener('click', () => {
        stopSlideshow();
        showSlide(currentSlide - 1);
        startSlideshow();
    });

    nextBtn.addEventListener('click', () => {
        stopSlideshow();
        showSlide(currentSlide + 1);
        startSlideshow();
    });

    // 播放速度控制按钮
    const speedControls = document.createElement('div');
    speedControls.className = 'speed-controls';
    speedControls.innerHTML = `
        <button class="speed-btn" data-speed="2000">2x</button>
        <button class="speed-btn active" data-speed="3000">1x</button>
        <button class="speed-btn" data-speed="5000">0.5x</button>
    `;
    slideshowModal.querySelector('.modal-header').appendChild(speedControls);

    // 播放速度控制事件
    speedControls.addEventListener('click', (e) => {
        if (e.target.classList.contains('speed-btn')) {
            // 移除其他按钮的active类
            speedControls.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            e.target.classList.add('active');
            // 更新播放速度
            playbackSpeed = parseInt(e.target.dataset.speed);
            // 如果正在播放，重新开始播放
            if (slideshowInterval) {
                clearInterval(slideshowInterval);
                startSlideshow();
            }
        }
    });

    // 开始自动播放
    function startSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
        slideshowInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, playbackSpeed);
    }

    // 停止自动播放
    function stopSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    }

    // 修改幻灯片事件监听
    slideshowBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        try {
            const photos = await getAllPhotos();
            const currentLang = window.translationManager.getCurrentLanguage();
            
            if (photos.length < 3) {
                showToast('capsule.needAtLeast3Photos');
                return;
            }
            
            loadSlides();
            slideshowModal.style.display = 'block';
            setTimeout(() => {
                slideshowModal.classList.add('show');
                // 开始自动播放
                startSlideshow();
            }, 10);
        } catch (error) {
            console.error('加载幻灯片失败:', error);
            const currentLang = window.translationManager.getCurrentLanguage();
            showToast('capsule.loadSlidesFailed');
        }
    });

    // 修改关闭模态框事件
    slideshowModal.addEventListener('click', function(e) {
        if (e.target === slideshowModal) {
            stopSlideshow();
            slideshowModal.classList.remove('show');
            setTimeout(() => {
                slideshowModal.style.display = 'none';
            }, 300);
        }
    });

    // 修改渲染幻灯片函数
    function renderSlides() {
        slidesContainer.innerHTML = '';
        const currentLang = window.translationManager.getCurrentLanguage();
        
        slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            
            // 随机生成布局样式（只保留左右两种）
            const layouts = ['layout-left', 'layout-right'];
            const layoutStyle = layouts[Math.floor(Math.random() * layouts.length)];
            
            slideElement.innerHTML = `
                <div class="slide-content ${layoutStyle}">
                    <div class="slide-image-wrapper">
                        <img src="${slide.image}" alt="${currentLang === 'en' ? 'Memory Photo' : '记忆照片'}">
                    </div>
                    <div class="slide-text-wrapper">
                        <div class="slide-date">${slide.date || (currentLang === 'en' ? 'No Date' : '无日期')}</div>
                        <div class="slide-desc">${slide.description || (currentLang === 'en' ? 'No Description' : '无描述')}</div>
                    </div>
                </div>
            `;
            slidesContainer.appendChild(slideElement);
        });
        updateSlidePosition();
    }

    // 更新幻灯片位置
    function updateSlidePosition() {
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        currentSlideSpan.textContent = currentSlide + 1;
    }

    // 显示指定幻灯片
    function showSlide(index) {
        if (index < 0) {
            currentSlide = slides.length - 1;
        } else if (index >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        updateSlidePosition();
    }

    // 修改键盘控制
    document.addEventListener('keydown', (e) => {
        if (!slideshowModal.classList.contains('show')) return;
        
        if (e.key === 'ArrowLeft') {
            stopSlideshow();
            showSlide(currentSlide - 1);
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            stopSlideshow();
            showSlide(currentSlide + 1);
            startSlideshow();
        } else if (e.key === 'Escape') {
            stopSlideshow();
            slideshowModal.classList.remove('show');
            setTimeout(() => {
                slideshowModal.style.display = 'none';
            }, 300);
        }
    });

    // 修改触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slidesContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            stopSlideshow();
            if (diff > 0) {
                showSlide(currentSlide + 1);
            } else {
                showSlide(currentSlide - 1);
            }
            startSlideshow();
        }
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

    // 加载幻灯片
    async function loadSlides() {
        try {
            slides = await getAllPhotos();
            if (slides.length === 0) return;
            
            totalSlidesSpan.textContent = slides.length;
            currentSlide = 0;
            renderSlides();
            updateSlidePosition();
        } catch (error) {
            console.error('加载幻灯片失败:', error);
            showToast('capsule.loadSlidesFailed');
        }
    }

    // 初始化页面
    await initialize();

    // 上传照片
    uploadTrigger.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // 重置所有状态
                resetPhotoState();
                
                // 显示新照片预览
                const photoPreview = document.getElementById('photo-preview');
                photoPreview.src = event.target.result;
                photoPreview.style.display = 'block';
                photoContainer.style.opacity = '1';
                photoContainer.style.visibility = 'visible';
                photoContainer.style.pointerEvents = 'auto';
                photoContainer.classList.add('show');
            };
            reader.readAsDataURL(file);
        }
    });

    // 照片翻转（点击照片正面）
    photoFront.addEventListener('click', function(e) {
        if (e.target.closest('#send-to-capsule')) {
            e.stopPropagation();
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        flipToBack();
    });

    // 返回按钮点击事件（从背面返回正面）
    backToFront.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        flipToFront();
    });

    // 点击背面进入编辑区域
    const flipBack = document.querySelector('.flip-back');
    flipBack.addEventListener('click', function(e) {
        if (e.target.closest('#back-to-front')) {
            return;
        }
        showEditArea();
    });

    // 保存记忆
    function bindSaveMemoryEvent() {
        const saveButton = document.getElementById('save-memory');
        if (saveButton) {
            saveButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const date = document.querySelector('.date-input').value;
                const desc = document.querySelector('.memory-input').value;
                
                // 更新记忆展示区域
                const memoryDisplay = document.querySelector('.memory-display');
                memoryDisplay.innerHTML = `
                    <div class="memory-date">${date || '无日期'}</div>
                    <div class="memory-text">${desc || '无描述'}</div>
                `;
                memoryDisplay.style.display = 'flex';
                memoryDisplay.style.opacity = '1';
                memoryDisplay.style.visibility = 'visible';

                // 隐藏编辑区域
                const editArea = document.querySelector('.edit-area');
                editArea.style.display = 'none';
                editArea.style.opacity = '0';
                editArea.style.visibility = 'hidden';
            });
        }
    }

    // 投送胶囊按钮点击事件
    sendToCapsuleBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const imgSrc = document.getElementById('photo-preview').src;
        if (!imgSrc) {
            showToast('capsule.noPhoto');
            return;
        }
        
        try {
            // 保存到 IndexedDB
            await saveToTimeCapsule(imgSrc);
            
            // 隐藏照片预览
            const photoPreview = document.getElementById('photo-preview');
            photoPreview.src = '';
            photoPreview.style.display = 'none';
            photoContainer.style.opacity = '0';
            photoContainer.style.visibility = 'hidden';
            photoContainer.style.pointerEvents = 'none';
            photoContainer.classList.remove('show');
            
            // 重置卡片状态
            flipCardElement.classList.remove('flipped');
            
            // 重置文件输入
            fileInput.value = '';
            
            // 创建胶囊星星
            setTimeout(() => {
                createCapsuleStar();
            }, 100);
            
            showToast('capsule.sendSuccess');
        } catch (error) {
            console.error('投送胶囊失败:', error);
            showToast('capsule.sendFailed');
        }
    });

    // 翻转卡片到背面
    function flipToBack() {
        flipCardElement.classList.add('flipped');
        // 确保编辑区域初始状态正确
        const currentLang = window.translationManager.getCurrentLanguage();
        const editArea = document.querySelector('.edit-area');
        editArea.innerHTML = `
            <div class="edit-prompt">${currentLang === 'en' ? 
                'Click here to write down your feelings at this moment...' : 
                '点击这里写下这一刻的心情...'}</div>
            <div class="edit-form" style="display: none;">
                <input type="text" class="date-input" placeholder="${currentLang === 'en' ? 
                    'Enter date (e.g., 2024/3/21)' : 
                    '输入日期（例如：2024/3/21）'}">
                <textarea class="memory-input" placeholder="${currentLang === 'en' ? 
                    'Write down your feelings at this moment...' : 
                    '写下这一刻的心情...'}"></textarea>
                <button type="button" class="save-button" id="save-memory">
                    <i class="fas fa-save"></i>
                    ${currentLang === 'en' ? 'Save Memory' : '保存记忆'}
                </button>
            </div>
        `;
        bindSaveMemoryEvent();
    }

    // 翻转卡片到正面
    function flipToFront() {
        flipCardElement.classList.remove('flipped');
    }

    // 显示编辑区域
    function showEditArea() {
        const editPrompt = document.querySelector('.edit-prompt');
        const editForm = document.querySelector('.edit-form');
        if (editPrompt) {
            editPrompt.style.display = 'none';
            editForm.style.display = 'flex';
        }
    }

    // 重置照片状态
    function resetPhotoState() {
        // 重置照片预览
        const photoPreview = document.getElementById('photo-preview');
        if (photoPreview) {
            photoPreview.src = '';
            photoPreview.style.display = 'none';
        }
        
        // 重置照片容器
        if (photoContainer) {
            photoContainer.style.opacity = '0';
            photoContainer.style.visibility = 'hidden';
            photoContainer.style.pointerEvents = 'none';
            photoContainer.classList.remove('show');
        }
        
        // 重置卡片状态
        if (flipCardElement) {
            flipCardElement.classList.remove('flipped');
        }
        
        // 重置编辑区域
        const editArea = document.querySelector('.edit-area');
        if (editArea) {
            const currentLang = window.translationManager.getCurrentLanguage();
            editArea.style.display = 'flex';
            editArea.style.opacity = '1';
            editArea.style.visibility = 'visible';
            editArea.innerHTML = `
                <div class="edit-prompt">${currentLang === 'en' ? 
                    'Click here to write down your feelings at this moment...' : 
                    '点击这里写下这一刻的心情...'}</div>
                <div class="edit-form" style="display: none;">
                    <input type="text" class="date-input" placeholder="${currentLang === 'en' ? 
                        'Enter date (e.g., 2024/3/21)' : 
                        '输入日期（例如：2024/3/21）'}">
                    <textarea class="memory-input" placeholder="${currentLang === 'en' ? 
                        'Write down your feelings at this moment...' : 
                        '写下这一刻的心情...'}"></textarea>
                    <button type="button" class="save-button" id="save-memory">
                        <i class="fas fa-save"></i>
                        ${currentLang === 'en' ? 'Save Memory' : '保存记忆'}
                    </button>
                </div>
            `;
            bindSaveMemoryEvent();
        }
        
        // 重置记忆展示区域
        const memoryDisplay = document.querySelector('.memory-display');
        if (memoryDisplay) {
            memoryDisplay.style.display = 'none';
            memoryDisplay.style.opacity = '0';
            memoryDisplay.style.visibility = 'hidden';
            memoryDisplay.innerHTML = '';
        }
        
        // 重置文件输入
        if (fileInput) {
            fileInput.value = '';
        }
    }

    // 初始化数据库
    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('数据库打开失败:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('date', 'date', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };
        });
    }

    // 保存照片到 IndexedDB
    async function saveToTimeCapsule(imageData) {
        try {
            const db = await initDB();
            const memoryDate = document.querySelector('.memory-date')?.textContent || '';
            const memoryDesc = document.querySelector('.memory-text')?.textContent || '';
            
            // 压缩图片
            const compressedImage = await compressImage(imageData, 0.5);
            
            const photoData = {
                image: compressedImage,
                date: memoryDate,
                description: memoryDesc,
                createdAt: new Date().toISOString()
            };
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.add(photoData);

                request.onsuccess = () => {
                    resolve();
                    updatePhotoCounter();
                    updateSlideshowButton();
                };

                request.onerror = (event) => {
                    console.error('保存失败:', event.target.error);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error('保存过程出错:', error);
            showToast('capsule.saveFailed');
        }
    }

    // 从 IndexedDB 获取所有照片
    async function getAllPhotos() {
        try {
            const db = await initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.getAll();

                request.onsuccess = () => {
                    // 按创建时间排序
                    const photos = request.result.sort((a, b) => {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    });
                    resolve(photos);
                };

                request.onerror = (event) => {
                    console.error('获取照片失败:', event.target.error);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error('获取照片过程出错:', error);
            return [];
        }
    }

    // 更新照片计数器
    async function updatePhotoCounter() {
        const photos = await getAllPhotos();
        const currentLang = window.translationManager.getCurrentLanguage();
        
        if (photoCounter && photos.length > 0) {
            photoCounter.querySelector('span').textContent = currentLang === 'en' ? 
                `Stored ${photos.length} photos` : 
                `已存入 ${photos.length} 张照片`;
            photoCounter.style.display = 'block';
            photoCounter.classList.add('show');
        }
    }

    // 更新幻灯片按钮状态
    async function updateSlideshowButton() {
        try {
            const photos = await getAllPhotos();
            if (photos.length >= 3) {
                slideshowBtn.classList.remove('disabled');
            } else {
                slideshowBtn.classList.add('disabled');
            }
        } catch (error) {
            console.error('更新幻灯片按钮状态失败:', error);
        }
    }

    // 图片压缩函数
    function compressImage(base64String, quality = 0.5) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = base64String;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 计算压缩后的尺寸
                let width = img.width;
                let height = img.height;
                const maxSize = 800; // 最大尺寸
                
                if (width > height && width > maxSize) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                } else if (height > maxSize) {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // 绘制压缩后的图片
                ctx.drawImage(img, 0, 0, width, height);
                
                // 转换为压缩后的base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            
            img.onerror = reject;
        });
    }

    // 创建胶囊星星
    function createCapsuleStar() {
        const glassCapsule = document.querySelector('.glass-capsule');
        if (glassCapsule) {
            const star = document.createElement('div');
            star.className = 'capsule-star';
            star.innerHTML = '<i class="fas fa-star"></i>';
            
            // 获取胶囊容器的实际尺寸
            const capsuleWidth = glassCapsule.offsetWidth;
            const capsuleHeight = glassCapsule.offsetHeight;
            
            // 计算安全区域（留出更大的边距）
            const margin = 30; // 增加边距
            const safeWidth = capsuleWidth - (margin * 2);
            const safeHeight = capsuleHeight - (margin * 2);
            
            // 在底部区域生成星星（70%-85%的高度范围，缩小范围）
            const x = Math.random() * safeWidth + margin;
            const y = Math.random() * (safeHeight * 0.15) + (safeHeight * 0.7);
            
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
            
            // 添加随机旋转角度，增加摇摆效果
            const rotation = Math.random() * 30 - 15; // -15度到15度之间
            star.style.transform = `rotate(${rotation}deg)`;
            
            // 添加到胶囊容器
            glassCapsule.appendChild(star);
            
            // 强制重绘
            star.offsetHeight;
            
            // 显示星星
            requestAnimationFrame(() => {
                star.classList.add('show');
            });
        }
    }

    // 清空胶囊
    const clearCapsuleBtn = document.getElementById('clear-capsule-btn');
    
    clearCapsuleBtn.addEventListener('click', async function() {
        if (confirm('确定要清空所有照片吗？此操作不可恢复。')) {
            try {
                const db = await initDB();
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                
                // 清空存储
                await new Promise((resolve, reject) => {
                    const request = store.clear();
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
                
                // 移除所有星星
                const stars = document.querySelectorAll('.capsule-star');
                stars.forEach(star => star.remove());
                
                // 更新UI
                if (photoCounter) {
                    photoCounter.querySelector('span').textContent = '已存入 0 张照片';
                    photoCounter.classList.remove('show');
                }
                
                // 更新幻灯片按钮状态
                slideshowBtn.classList.add('disabled');
                
                showToast('capsule.clearSuccess');
            } catch (error) {
                console.error('清空失败:', error);
                showToast('capsule.clearFailed');
            }
        }
    });

    // 更换照片按钮点击事件
    const changePhotoBtn = document.getElementById('change-photo');
    changePhotoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 重置所有状态
        resetPhotoState();
        
        // 触发文件选择
        fileInput.click();
    });

    // 监听语言变化
    window.addEventListener('languageChanged', () => {
        updatePhotoCounter();
        if (sendToCapsuleBtn) {
            const currentLang = window.translationManager.getCurrentLanguage();
            sendToCapsuleBtn.innerHTML = `
                <i class="fas fa-paper-plane"></i>
                ${currentLang === 'en' ? 'Send to Capsule' : '投送胶囊'}
            `;
        }
        if (editPrompt) {
            const currentLang = window.translationManager.getCurrentLanguage();
            editPrompt.textContent = currentLang === 'en' ? 
                'Click here to write down your feelings at this moment...' : 
                '点击这里写下这一刻的心情...';
        }
        if (dateInput) {
            const currentLang = window.translationManager.getCurrentLanguage();
            dateInput.placeholder = currentLang === 'en' ? 
                'Enter date (e.g., 2024/3/21)' : 
                '输入日期（例如：2024/3/21）';
        }
        if (memoryInput) {
            const currentLang = window.translationManager.getCurrentLanguage();
            memoryInput.placeholder = currentLang === 'en' ? 
                'Write down your feelings at this moment...' : 
                '写下这一刻的心情...';
        }
        if (saveButton) {
            const currentLang = window.translationManager.getCurrentLanguage();
            saveButton.innerHTML = `
                <i class="fas fa-save"></i>
                ${currentLang === 'en' ? 'Save Memory' : '保存记忆'}
            `;
        }
    });

    // 添加退出按钮事件监听
    exitSlideshowBtn.addEventListener('click', function() {
        stopSlideshow();
        slideshowModal.classList.remove('show');
        setTimeout(() => {
            slideshowModal.style.display = 'none';
        }, 300);
    });
});