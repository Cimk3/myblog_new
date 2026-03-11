// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 头像上传功能
    const avatarUpload = document.getElementById('avatar-upload');
    const avatar = document.getElementById('avatar');
    
    console.log('Avatar element:', avatar);
    console.log('Avatar upload element:', avatarUpload);
    
    if (avatarUpload && avatar) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                console.log('Selected file:', file);
                // 使用Canvas压缩图片
                compressImage(file, function(compressedDataUrl) {
                    console.log('Image compressed, size:', compressedDataUrl.length);
                    avatar.src = compressedDataUrl;
                    // 保存头像到localStorage
                    console.log('Getting user info');
                    const userInfo = getUserInfo();
                    console.log('Current user info:', userInfo);
                    userInfo.avatar = compressedDataUrl;
                    console.log('Saving user info:', userInfo);
                    const saved = saveUserInfo(userInfo);
                    if (saved) {
                        alert('头像已更新！');
                    }
                });
            }
        });
    }
    
    // 压缩图片函数
    function compressImage(file, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // 设置压缩后的尺寸
            const maxWidth = 300;
            const maxHeight = 300;
            let width = img.width;
            let height = img.height;
            
            // 保持宽高比
            if (width > height) {
                if (width > maxWidth) {
                    height = height * (maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = width * (maxHeight / height);
                    height = maxHeight;
                }
            }
            
            // 设置Canvas尺寸
            canvas.width = width;
            canvas.height = height;
            
            // 绘制压缩后的图片
            ctx.drawImage(img, 0, 0, width, height);
            
            // 获取压缩后的DataURL
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(compressedDataUrl);
        };
        
        img.src = URL.createObjectURL(file);
    }
    
    // 实时更新文章数量
    function updateArticleCount() {
        const articles = JSON.parse(localStorage.getItem('articles') || '[]');
        const articleCountElement = document.getElementById('articleCount');
        if (articleCountElement) {
            articleCountElement.textContent = articles.length;
        }
    }
    
    // 获取用户信息
    function getUserInfo() {
        let userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            console.log('Loaded user info from localStorage');
            return JSON.parse(userInfo);
        } else {
            // 尝试从sessionStorage读取
            userInfo = sessionStorage.getItem('userInfo');
            if (userInfo) {
                console.log('Loaded user info from sessionStorage');
                return JSON.parse(userInfo);
            } else {
                console.log('No user info found, using default');
                return {
                    name: '开发者',
                    id: 'dev_2026',
                    bio: '热爱技术的前端开发者，喜欢分享学习心得和生活感悟。',
                    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20of%20a%20young%20developer&image_size=square'
                };
            }
        }
    }
    
    // 检查存储容量
    function checkStorage() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // 保存用户信息
    function saveUserInfo(userInfo) {
        try {
            // 检查localStorage是否可用
            if (checkStorage()) {
                // 尝试压缩头像数据（如果太大）
                if (userInfo.avatar && userInfo.avatar.length > 1000000) {
                    console.log('Avatar data is large, attempting to compress');
                    // 这里可以添加更复杂的压缩逻辑
                }
                
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                console.log('User info saved successfully to localStorage');
                return true;
            } else {
                console.log('localStorage not available, using sessionStorage');
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                console.log('User info saved successfully to sessionStorage');
                return true;
            }
        } catch (error) {
            console.error('Error saving user info:', error);
            alert('保存失败：' + error.message);
            return false;
        }
    }
    
    // 初始化用户信息
    function initUserInfo() {
        console.log('Initializing user info');
        const userInfo = getUserInfo();
        console.log('Loaded user info:', userInfo);
        
        // 设置头像
        if (avatar) {
            console.log('Setting avatar src:', userInfo.avatar);
            avatar.src = userInfo.avatar;
        }
        
        // 设置名字
        const profileName = document.getElementById('profileName');
        if (profileName) {
            profileName.textContent = userInfo.name;
        }
        
        // 设置ID
        const profileId = document.getElementById('profileId');
        if (profileId) {
            profileId.textContent = userInfo.id;
        }
        
        // 设置个人简介
        const profileBio = document.getElementById('profileBio');
        if (profileBio) {
            profileBio.textContent = userInfo.bio;
        }
    }
    
    // 添加编辑事件监听器
    function addEditListeners() {
        // 名字编辑
        const profileName = document.getElementById('profileName');
        if (profileName) {
            profileName.addEventListener('blur', function() {
                const userInfo = getUserInfo();
                userInfo.name = this.textContent.trim();
                saveUserInfo(userInfo);
            });
        }
        
        // ID编辑
        const profileId = document.getElementById('profileId');
        if (profileId) {
            profileId.addEventListener('blur', function() {
                const userInfo = getUserInfo();
                userInfo.id = this.textContent.trim();
                saveUserInfo(userInfo);
            });
        }
        
        // 个人简介编辑
        const profileBio = document.getElementById('profileBio');
        if (profileBio) {
            profileBio.addEventListener('blur', function() {
                const userInfo = getUserInfo();
                userInfo.bio = this.textContent.trim();
                saveUserInfo(userInfo);
            });
        }
    }
    
    // 初始化
    initUserInfo();
    updateArticleCount();
    addEditListeners();
    
    // 导航栏交互
    const navLinks = document.querySelectorAll('.nav-links li a');
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
    
    // 文章统计图表
    const ctx = document.getElementById('articleChart');
    if (ctx) {
        // 生成最近30天的日期标签和数据
        const labels = [];
        const data = [];
        const today = new Date();
        
        // 获取所有文章
        const articles = JSON.parse(localStorage.getItem('articles') || '[]');
        
        // 统计最近30天每天的文章数量
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
            
            // 统计当天的文章数量
            const dayArticles = articles.filter(article => article.date === dateStr);
            data.push(dayArticles.length);
        }
        
        // 创建图表
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '文章数量',
                    data: data,
                    borderColor: '#3399ff',
                    backgroundColor: 'rgba(51, 153, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    // 页面滚动效果
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // 个人信息卡片动画
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.style.opacity = '0';
        profileCard.style.transform = 'translateY(30px)';
        profileCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            profileCard.style.opacity = '1';
            profileCard.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // 图表区域动画
    const chartSection = document.querySelector('.chart-section');
    if (chartSection) {
        chartSection.style.opacity = '0';
        chartSection.style.transform = 'translateY(30px)';
        chartSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            chartSection.style.opacity = '1';
            chartSection.style.transform = 'translateY(0)';
        }, 400);
    }
    
    // 页面加载完成提示
    console.log('个人主页加载完成！');
});