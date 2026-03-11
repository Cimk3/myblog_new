// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏交互
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links li a');
    
    // 导航栏悬停效果增强
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // 对于外部链接，直接跳转
            if (targetId.includes('.html')) {
                window.location.href = targetId;
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 页面滚动效果
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // 为site-header添加动画效果
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        siteHeader.style.opacity = '0';
        siteHeader.style.transform = 'translateY(30px)';
        siteHeader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            siteHeader.style.opacity = '1';
            siteHeader.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // 为footer添加动画效果
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(30px)';
        footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            footer.style.opacity = '1';
            footer.style.transform = 'translateY(0)';
        }, 400);
    }
    
    // 背景动态效果 - 模拟云朵飘动
    function createClouds() {
        const body = document.body;
        const cloudCount = 5;
        
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.position = 'fixed';
            cloud.style.top = Math.random() * 30 + 'vh';
            cloud.style.left = -100 + 'px';
            cloud.style.width = Math.random() * 100 + 50 + 'px';
            cloud.style.height = Math.random() * 50 + 20 + 'px';
            cloud.style.background = 'rgba(255, 255, 255, 0.8)';
            cloud.style.borderRadius = '50px';
            cloud.style.zIndex = '0';
            cloud.style.animation = `float ${Math.random() * 20 + 30}s linear infinite`;
            body.appendChild(cloud);
        }
    }
    
    // 添加云朵动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            from {
                transform: translateX(-100%);
            }
            to {
                transform: translateX(100vw);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 创建云朵
    createClouds();
    
    // 页面加载完成提示
    console.log('首页加载完成！');
});