function loadArticle() {
    const articleId = parseInt(getUrlParameter('id'));
    if (!articleId) { window.location.href = 'articles.html'; return; }
    let article = getArticleById(articleId);
    if (!article) { document.querySelector('.article-page').innerHTML = '<div class="container"><p>Статья не найдена</p></div>'; return; }
    
    article.views = (article.views || 0) + 1;
    const index = articlesData.findIndex(a => a.id === articleId);
    if (index !== -1) articlesData[index].views = article.views;
    saveArticlesToStorage();
    
    const container = document.querySelector('.article-page');
    if (!container) return;
    container.innerHTML = `<div class="container"><div class="article-page__image" style="background-image: url('${article.image}')"></div><div class="article-page__meta"><span><i class="far fa-calendar-alt"></i> ${article.date}</span><span><i class="far fa-folder"></i> ${article.category}</span><span><i class="far fa-eye"></i> ${article.views}</span></div><h1 class="article-page__title">${article.title}</h1><div class="article-page__content">${article.content || `<p>${article.excerpt}</p><p>В этой статье мы подробно рассказываем о том, как правильно выбирать и ухаживать за цветами, чтобы они радовали вас как можно дольше.</p><p>Следуйте нашим советам, и ваши букеты будут сохранять свежесть на протяжении долгого времени.</p>`}</div></div>`;
}

document.addEventListener('DOMContentLoaded', loadArticle);