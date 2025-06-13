document.addEventListener('DOMContentLoaded', () => {
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    const currentLang = document.querySelector('.current-lang');

    // 初始化语言
    const savedLang = localStorage.getItem('language') || 'zh';
    window.translationManager.setLanguage(savedLang);

    // 切换下拉菜单显示
    languageBtn.addEventListener('click', () => {
        languageDropdown.classList.toggle('show');
    });

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
            languageDropdown.classList.remove('show');
        }
    });

    // 语言切换处理
    languageDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const lang = e.target.getAttribute('data-lang');
            
            // 更新UI状态
            languageDropdown.querySelectorAll('a').forEach(a => {
                a.classList.toggle('active', a.getAttribute('data-lang') === lang);
            });
            
            // 设置新语言并更新整个页面
            window.translationManager.setLanguage(lang);
            localStorage.setItem('language', lang);
            
            languageDropdown.classList.remove('show');
        }
    });

    // 更新当前语言显示
    function updateCurrentLangDisplay(lang) {
        const langMap = {
            'zh': '中文',
            'en': 'English',
            'ja': '日本語',
            'ko': '한국어',
            'fr': 'Français',
            'de': 'Deutsch',
            'es': 'Español'
        };
        currentLang.textContent = langMap[lang] || lang;
    }
}); 