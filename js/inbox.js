// 收信箱功能
document.addEventListener('DOMContentLoaded', function() {
    const lettersList = document.getElementById('letters-list');
    const letterDetailModal = document.getElementById('letter-detail-modal');
    const originalLetterContent = document.getElementById('original-letter-content');
    const replyContent = document.getElementById('reply-content');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    // 加载信件列表
    window.loadLetters = function() {
        const letters = JSON.parse(localStorage.getItem('pet-letters')) || [];
        
        if (letters.length === 0) {
            lettersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>还没有寄出的信件</p>
                </div>
            `;
            return;
        }
        
        // 按照时间戳降序排序信件
        letters.sort((a, b) => b.timestamp - a.timestamp);
        
        lettersList.innerHTML = letters.map(letter => {
            const date = new Date(letter.timestamp);
            const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            const preview = letter.content.substring(0, 20) + (letter.content.length > 20 ? '...' : '');
            
            return `
                <div class="letter-item ${!letter.isRead ? 'unread' : ''}" data-id="${letter.id}">
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
        
        // 绑定信件点击事件
        document.querySelectorAll('.letter-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('.delete-letter')) {
                    const letterId = this.dataset.id;
                    showLetterDetail(letterId);
                }
            });
        });

        // 绑定删除按钮事件
        document.querySelectorAll('.delete-letter').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const letterId = this.closest('.letter-item').dataset.id;
                deleteLetter(letterId);
            });
        });
    };

    // 显示信件详情
    function showLetterDetail(letterId) {
        const letters = JSON.parse(localStorage.getItem('pet-letters')) || [];
        const letter = letters.find(l => l.id === parseInt(letterId));
        
        if (!letter) return;
        
        // 生成并显示回信
        if (!letter.reply) {
            letter.reply = generateReply(letter.content);
            // 更新存储中的回信
            const updatedLetters = letters.map(l => {
                if (l.id === letter.id) {
                    return { ...l, reply: letter.reply };
                }
                return l;
            });
            localStorage.setItem('pet-letters', JSON.stringify(updatedLetters));
        }
        
        // 更新回信内容
        const replyContent = document.getElementById('reply-content');
        const petInfo = JSON.parse(localStorage.getItem('pet-info')) || {};
        replyContent.textContent = letter.reply;
        
        // 更新署名
        const signature = document.querySelector('.letter-signature');
        if (signature) {
            signature.textContent = petInfo.name ? `永远爱你的 ${petInfo.name}` : '永远爱你的毛孩子';
        }
        
        // 标记为已读
        if (!letter.isRead) {
            const updatedLetters = letters.map(l => {
                if (l.id === letter.id) {
                    return { ...l, isRead: true };
                }
                return l;
            });
            localStorage.setItem('pet-letters', JSON.stringify(updatedLetters));
            document.querySelector(`.letter-item[data-id="${letterId}"]`).classList.remove('unread');
        }
        
        // 显示模态框
        const modal = document.getElementById('letter-detail-modal');
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // 关闭模态框
    function closeModal() {
        const modal = document.getElementById('letter-detail-modal');
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    // 删除信件
    function deleteLetter(letterId) {
        if (confirm('确定要删除这封信吗？')) {
            const letters = JSON.parse(localStorage.getItem('pet-letters')) || [];
            const updatedLetters = letters.filter(l => l.id !== parseInt(letterId));
            localStorage.setItem('pet-letters', JSON.stringify(updatedLetters));
            
            // 移除信件元素
            const letterElement = document.querySelector(`.letter-item[data-id="${letterId}"]`);
            letterElement.style.opacity = '0';
            letterElement.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                letterElement.remove();
                // 如果删除后没有信件了，显示空状态
                if (updatedLetters.length === 0) {
                    document.getElementById('letters-list').innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>还没有寄出的信件</p>
                        </div>
                    `;
                }
            }, 300);
        }
    }

    // 生成回信
    function generateReply(content) {
        const currentLang = window.translationManager.getCurrentLanguage();
        
        const responses = {
            zh: {
                miss: [
                    "我也很想你，每次看到云朵飘过，都会想起我们一起度过的美好时光。",
                    "收到你的信了，我在这里过得很好，每天都有新的朋友陪伴。",
                    "别太想我，我在这里很开心，每天都能看到美丽的彩虹。",
                    "你的思念我都收到了，我会一直守护着你。",
                    "我在这里交到了很多新朋友，但最想念的还是和你在一起的时光。"
                ],
                happy: [
                    "看到你开心我也很开心！",
                    "你的快乐就是我的快乐，要一直这样开心下去哦！",
                    "我也在宠星过得很好，每天都很充实。",
                    "希望你能一直保持这样的好心情！",
                    "你的笑容是我最珍贵的回忆。"
                ],
                sad: [
                    "别难过，我在这里一切都好。",
                    "当你想我的时候，就看看天空中最亮的那颗星星吧。",
                    "我会一直陪在你身边，只是换了一种方式。",
                    "记住我们在一起的快乐时光，那是我最珍贵的回忆。",
                    "你的思念我都收到了，要好好照顾自己哦。"
                ],
                default: [
                    "收到你的信了，我在这里过得很好。",
                    "谢谢你的关心，我会一直守护着你。",
                    "我在这里交到了新朋友，每天都很开心。",
                    "要记得好好照顾自己哦。",
                    "我会一直在这里，守护着你的幸福。"
                ]
            },
            en: {
                miss: [
                    "I miss you too, every time I see clouds passing by, I remember our wonderful times together.",
                    "I received your letter, I'm doing well here, making new friends every day.",
                    "Don't miss me too much, I'm very happy here, seeing beautiful rainbows every day.",
                    "I've received your thoughts, I'll always be watching over you.",
                    "I've made many new friends here, but I still miss our time together the most."
                ],
                happy: [
                    "I'm so happy to see you happy!",
                    "Your happiness is my happiness, keep being happy!",
                    "I'm doing well in pet heaven, every day is fulfilling.",
                    "I hope you can maintain this good mood!",
                    "Your smile is my most precious memory."
                ],
                sad: [
                    "Don't be sad, I'm doing well here.",
                    "When you miss me, look at the brightest star in the sky.",
                    "I'll always be by your side, just in a different way.",
                    "Remember our happy times together, those are my most precious memories.",
                    "I've received your thoughts, take good care of yourself."
                ],
                default: [
                    "I received your letter, I'm doing well here.",
                    "Thank you for your concern, I'll always be watching over you.",
                    "I've made new friends here, every day is happy.",
                    "Remember to take good care of yourself.",
                    "I'll always be here, watching over your happiness."
                ]
            }
        };

        // 分析信件内容的情感
        let sentiment = 'default';
        if (content.includes('想') || content.includes('思念') || content.includes('miss')) {
            sentiment = 'miss';
        } else if (content.includes('开心') || content.includes('快乐') || content.includes('happy')) {
            sentiment = 'happy';
        } else if (content.includes('难过') || content.includes('伤心') || content.includes('sad')) {
            sentiment = 'sad';
        }

        // 获取当前语言的回复数组
        const currentResponses = responses[currentLang] || responses.zh;
        const sentimentResponses = currentResponses[sentiment];
        
        // 随机选择一个回复
        return sentimentResponses[Math.floor(Math.random() * sentimentResponses.length)];
    }

    // 显示提示
    function showToast(message) {
        const currentLang = window.translationManager.getCurrentLanguage();
        let translatedMessage = message;

        // 根据当前语言翻译消息
        if (currentLang === 'en') {
            switch (message) {
                case '信件已删除':
                    translatedMessage = 'Letter has been deleted';
                    break;
                case '确定要删除这封信吗？':
                    translatedMessage = 'Are you sure you want to delete this letter?';
                    break;
                case '还没有寄出的信件':
                    translatedMessage = 'No letters sent yet';
                    break;
                case '生成回复失败，请重试':
                    translatedMessage = 'Failed to generate reply, please try again';
                    break;
            }
        }

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

    // 初始化加载信件
    window.loadLetters();

    // 绑定关闭模态框事件
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('letter-detail-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
}); 