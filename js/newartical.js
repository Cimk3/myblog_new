// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 编辑区元素
    const editor = document.getElementById('editor');
    const articleTitle = document.getElementById('articleTitle');
    
    // 工具栏元素
    const fontColor = document.getElementById('fontColor');
    const insertImage = document.getElementById('insertImage');
    const insertLink = document.getElementById('insertLink');
    const alignLeft = document.getElementById('alignLeft');
    const alignCenter = document.getElementById('alignCenter');
    const alignRight = document.getElementById('alignRight');
    const saveArticle = document.getElementById('saveArticle');
    const previewArticle = document.getElementById('previewArticle');
    
    // 初始化编辑区
    editor.addEventListener('focus', function() {
        if (this.innerHTML === '<p>请输入文章内容...</p>') {
            this.innerHTML = '';
        }
    });
    
    editor.addEventListener('blur', function() {
        if (this.innerHTML === '') {
            this.innerHTML = '<p>请输入文章内容...</p>';
        }
    });
    
    // 检查是否是编辑模式
    let currentArticleId = null;
    
    function initEditMode() {
        const editArticleId = localStorage.getItem('editArticleId');
        if (editArticleId) {
            currentArticleId = parseInt(editArticleId);
            const articles = JSON.parse(localStorage.getItem('articles') || '[]');
            const article = articles.find(a => a.id === currentArticleId);
            if (article) {
                // 填充文章内容
                articleTitle.value = article.title;
                editor.innerHTML = article.content;
                // 更改页面标题
                document.title = '编辑文章';
                document.querySelector('.page-title').textContent = '编辑文章';
            }
            // 清除编辑ID
            localStorage.removeItem('editArticleId');
        }
    }
    
    // 初始化编辑模式
    initEditMode();
    
    // 字体颜色修改
    fontColor.addEventListener('change', function() {
        document.execCommand('foreColor', false, this.value);
        editor.focus();
    });
    

    
    // 创建隐藏的文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // 插入图片
    insertImage.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 处理文件选择
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                document.execCommand('insertImage', false, imageUrl);
                editor.focus();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 插入超链接
    insertLink.addEventListener('click', function() {
        const linkUrl = prompt('请输入链接URL:');
        if (linkUrl) {
            const linkText = prompt('请输入链接文本:') || linkUrl;
            document.execCommand('createLink', false, linkUrl);
            // 设置链接文本
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const link = range.commonAncestorContainer.closest('a');
                if (link) {
                    link.textContent = linkText;
                }
            }
        }
        editor.focus();
    });
    
    // 左对齐
    alignLeft.addEventListener('click', function() {
        document.execCommand('justifyLeft', false, null);
        editor.focus();
    });
    
    // 居中对齐
    alignCenter.addEventListener('click', function() {
        document.execCommand('justifyCenter', false, null);
        editor.focus();
    });
    
    // 右对齐
    alignRight.addEventListener('click', function() {
        document.execCommand('justifyRight', false, null);
        editor.focus();
    });
    
    // 预览文章
    previewArticle.addEventListener('click', function() {
        const title = articleTitle.value.trim();
        const content = editor.innerHTML.trim();
        
        if (!title) {
            alert('请输入文章标题');
            articleTitle.focus();
            return;
        }
        
        if (!content || content === '<p>请输入文章内容...</p>') {
            alert('请输入文章内容');
            editor.focus();
            return;
        }
        
        // 创建预览窗口
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>文章预览</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background: linear-gradient(135deg, #3399ff 0%, #66b3ff 100%);
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                    }
                    .preview-container {
                        max-width: 800px;
                        margin: 40px auto;
                        background: white;
                        padding: 40px;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        font-size: 2rem;
                        margin-bottom: 20px;
                        color: #333;
                        border-bottom: 2px solid #3399ff;
                        padding-bottom: 10px;
                    }
                    .content {
                        line-height: 1.8;
                    }
                    .content p {
                        margin-bottom: 15px;
                    }
                    .content img {
                        max-width: 100%;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    .content ul {
                        margin-left: 20px;
                        margin-bottom: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="preview-container">
                    <h1>${title}</h1>
                    <div class="content">${content}</div>
                </div>
            </body>
            </html>
        `);
        previewWindow.document.close();
    });
    
    // 保存文章
    saveArticle.addEventListener('click', function() {
        const title = articleTitle.value.trim();
        const content = editor.innerHTML.trim();
        
        if (!title) {
            alert('请输入文章标题');
            articleTitle.focus();
            return;
        }
        
        if (!content || content === '<p>请输入文章内容...</p>') {
            alert('请输入文章内容');
            editor.focus();
            return;
        }
        
        // 获取当前日期
        const today = new Date();
        const date = today.toISOString().split('T')[0];
        
        // 从localStorage获取现有文章
        let articles = JSON.parse(localStorage.getItem('articles') || '[]');
        
        // 检查是否是编辑模式（通过currentArticleId判断）
        const isEditMode = currentArticleId !== null;
        
        if (isEditMode) {
            // 编辑现有文章
            const articleIndex = articles.findIndex(a => a.id === currentArticleId);
            if (articleIndex !== -1) {
                articles[articleIndex] = {
                    ...articles[articleIndex],
                    title: title,
                    content: content,
                    date: date
                };
            } else {
                // 如果找不到对应ID的文章，创建新文章
                const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
                const newArticle = {
                    id: newId,
                    title: title,
                    content: content,
                    date: date
                };
                articles.unshift(newArticle);
            }
        } else {
            // 创建新文章
            const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
            const newArticle = {
                id: newId,
                title: title,
                content: content,
                date: date
            };
            articles.unshift(newArticle);
        }
        
        // 保存回localStorage
        localStorage.setItem('articles', JSON.stringify(articles));
        
        // 显示保存成功提示
        alert('文章保存成功！');
        
        // 跳转到文章管理页面
        window.location.href = 'artical.html';
    });
    
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
    
    // 页面加载完成提示
    console.log('新建文章页面加载完成！');
});