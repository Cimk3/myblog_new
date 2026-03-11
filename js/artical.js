// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 示例文章数据
    const defaultArticles = [
        {
            id: 1,
            title: '欢迎来到我的个人博客',
            content: '<p>这是我的第一篇博客文章，记录我开始博客之旅的心情。在这里，我将分享我的生活经历、学习心得和技术见解。希望通过这个平台，能够与更多志同道合的朋友交流，共同成长。</p><p>博客是一个很好的方式来记录自己的成长历程，也是一个与他人分享知识的平台。我会定期更新内容，希望大家喜欢。</p>',
            date: '2026-03-11'
        },
        {
            id: 2,
            title: '前端开发学习心得',
            content: '<p>在学习前端开发的过程中，我深刻体会到了HTML、CSS和JavaScript的重要性。从最初的静态页面到现在的交互式应用，前端技术的发展速度令人惊叹。</p><p>学习前端开发需要不断实践和探索，只有通过实际项目才能真正掌握这些技术。我会在后续的文章中分享更多学习心得和技巧。</p>',
            date: '2026-03-10'
        },
        {
            id: 3,
            title: '如何提高编程效率',
            content: '<p>编程效率是每个开发者都关心的问题。通过合理的工具选择、代码组织和工作习惯，可以显著提高开发效率。</p><p>以下是一些提高编程效率的建议：</p><ul><li>使用合适的IDE和插件</li><li>建立良好的代码组织结构</li><li>使用版本控制系统</li><li>编写清晰的注释</li><li>定期休息，保持精力充沛</li></ul>',
            date: '2026-03-09'
        }
    ];
    
    // 从localStorage获取文章数据，如果没有则使用默认数据
    function getArticles() {
        const articles = localStorage.getItem('articles');
        if (articles) {
            return JSON.parse(articles);
        } else {
            // 存储默认文章数据
            localStorage.setItem('articles', JSON.stringify(defaultArticles));
            return defaultArticles;
        }
    }
    
    // 渲染文章列表
    function renderArticleList() {
        const articleList = document.getElementById('articleList');
        const articles = getArticles();
        
        articleList.innerHTML = '';
        
        articles.forEach(article => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="article-item">
                    <input type="checkbox" class="article-checkbox" data-id="${article.id}">
                    <a href="#" data-id="${article.id}">
                        <div class="article-item-title">${article.title}</div>
                        <div class="article-item-date">${article.date}</div>
                    </a>
                    <div class="article-actions">
                        <button class="edit-btn" data-id="${article.id}">编辑</button>
                        <button class="delete-btn" data-id="${article.id}">删除</button>
                    </div>
                </div>
            `;
            articleList.appendChild(li);
        });
        
        // 添加点击事件监听器
        addArticleClickListeners();
        // 添加删除按钮事件监听器
        addDeleteButtonListeners();
        // 添加编辑按钮事件监听器
        addEditButtonListeners();
        // 添加复选框事件监听器
        addCheckboxListeners();
        // 更新批量删除按钮状态
        updateBatchDeleteButton();
    }
    
    // 添加文章点击事件监听器
    function addArticleClickListeners() {
        const articleLinks = document.querySelectorAll('#articleList li a');
        articleLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const articleId = parseInt(this.getAttribute('data-id'));
                displayArticle(articleId);
            });
        });
    }
    
    // 添加删除按钮事件监听器
    function addDeleteButtonListeners() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                const articleId = parseInt(this.getAttribute('data-id'));
                deleteArticle(articleId);
            });
        });
    }
    
    // 添加编辑按钮事件监听器
    function addEditButtonListeners() {
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                const articleId = parseInt(this.getAttribute('data-id'));
                editArticle(articleId);
            });
        });
    }
    
    // 编辑文章
    function editArticle(articleId) {
        // 将文章ID存储在localStorage中，以便在newartical页面获取
        localStorage.setItem('editArticleId', articleId);
        // 跳转到新建文章页面
        window.location.href = 'newartical.html';
    }
    
    // 删除文章
    function deleteArticle(articleId) {
        if (confirm('确定要删除这篇文章吗？')) {
            let articles = getArticles();
            articles = articles.filter(article => article.id !== articleId);
            localStorage.setItem('articles', JSON.stringify(articles));
            renderArticleList();
            // 清空文章显示区域
            document.getElementById('articleDisplay').innerHTML = `
                <h2 class="article-title">请选择一篇文章</h2>
                <p class="article-placeholder">从左侧列表中选择一篇文章查看内容</p>
            `;
        }
    }
    
    // 添加复选框事件监听器
    function addCheckboxListeners() {
        // 单个复选框事件
        const checkboxes = document.querySelectorAll('.article-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateBatchDeleteButton();
                updateSelectAllStatus();
            });
        });
        
        // 全选复选框事件
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.article-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
                updateBatchDeleteButton();
            });
        }
        
        // 批量删除按钮事件
        const batchDeleteBtn = document.getElementById('batchDelete');
        if (batchDeleteBtn) {
            batchDeleteBtn.addEventListener('click', function() {
                const selectedCheckboxes = document.querySelectorAll('.article-checkbox:checked');
                if (selectedCheckboxes.length > 0) {
                    if (confirm(`确定要删除选中的 ${selectedCheckboxes.length} 篇文章吗？`)) {
                        const selectedIds = Array.from(selectedCheckboxes).map(checkbox => parseInt(checkbox.getAttribute('data-id')));
                        batchDeleteArticles(selectedIds);
                    }
                }
            });
        }
    }
    
    // 更新批量删除按钮状态
    function updateBatchDeleteButton() {
        const selectedCheckboxes = document.querySelectorAll('.article-checkbox:checked');
        const batchDeleteBtn = document.getElementById('batchDelete');
        if (batchDeleteBtn) {
            batchDeleteBtn.disabled = selectedCheckboxes.length === 0;
        }
    }
    
    // 更新全选状态
    function updateSelectAllStatus() {
        const checkboxes = document.querySelectorAll('.article-checkbox');
        const selectAll = document.getElementById('selectAll');
        if (selectAll && checkboxes.length > 0) {
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            selectAll.checked = allChecked;
        }
    }
    
    // 批量删除文章
    function batchDeleteArticles(articleIds) {
        let articles = getArticles();
        articles = articles.filter(article => !articleIds.includes(article.id));
        localStorage.setItem('articles', JSON.stringify(articles));
        renderArticleList();
        // 清空文章显示区域
        document.getElementById('articleDisplay').innerHTML = `
            <h2 class="article-title">请选择一篇文章</h2>
            <p class="article-placeholder">从左侧列表中选择一篇文章查看内容</p>
        `;
    }
    
    // 显示文章内容
    function displayArticle(articleId) {
        const articles = getArticles();
        const article = articles.find(a => a.id === articleId);
        const articleDisplay = document.getElementById('articleDisplay');
        
        if (article) {
            articleDisplay.innerHTML = `
                <h2 class="article-title">${article.title}</h2>
                <div class="article-meta">发布日期: ${article.date}</div>
                <div class="article-body">${article.content}</div>
            `;
        }
    }
    
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
    
    // 页面滚动效果
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // 为文章列表和内容区域添加动画效果
    const articleList = document.querySelector('.article-list');
    const articleContent = document.querySelector('.article-content');
    
    if (articleList) {
        articleList.style.opacity = '0';
        articleList.style.transform = 'translateX(-30px)';
        articleList.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            articleList.style.opacity = '1';
            articleList.style.transform = 'translateX(0)';
        }, 200);
    }
    
    if (articleContent) {
        articleContent.style.opacity = '0';
        articleContent.style.transform = 'translateX(30px)';
        articleContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            articleContent.style.opacity = '1';
            articleContent.style.transform = 'translateX(0)';
        }, 400);
    }
    
    // 新建文章按钮动画
    const newArticleBtn = document.querySelector('.new-article-btn');
    if (newArticleBtn) {
        newArticleBtn.style.opacity = '0';
        newArticleBtn.style.transform = 'scale(0.5)';
        newArticleBtn.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            newArticleBtn.style.opacity = '1';
            newArticleBtn.style.transform = 'scale(1)';
        }, 600);
    }
    
    // 渲染文章列表
    renderArticleList();
    
    // 页面加载完成提示
    console.log('文章管理页面加载完成！');
});