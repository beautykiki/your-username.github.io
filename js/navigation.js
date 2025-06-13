// 导航功能
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const contents = document.querySelectorAll('.content');
    
    // 默认显示首页
    contents[0].style.display = 'block';
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有导航链接的active类
            navLinks.forEach(l => l.classList.remove('active'));
            // 为当前点击的链接添加active类
            this.classList.add('active');
            
            // 隐藏所有内容
            contents.forEach(content => {
                content.style.display = 'none';
            });
            
            // 显示对应的内容
            contents[index].style.display = 'block';
        });
    });
}); 