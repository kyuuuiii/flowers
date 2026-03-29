let currentProduct = null;

function loadProduct() {
    const productId = parseInt(getUrlParameter('id'));
    if (!productId) { window.location.href = 'catalog.html'; return; }
    currentProduct = getProductById(productId);
    if (!currentProduct) { document.querySelector('.product-page__grid').innerHTML = '<p>Товар не найден</p>'; return; }
    renderProduct();
    renderReviews();
}

function renderProduct() {
    const container = document.getElementById('productContent');
    if (!container) return;
    container.innerHTML = `
        <div class="product-page__image" style="background-image: url('${currentProduct.image}')"></div>
        <div class="product-page__info">
            <h1 class="product-page__title">${currentProduct.name}</h1>
            <p class="product-page__composition">${currentProduct.composition}</p>
            <div class="product-page__rating">${getStarsHtml(currentProduct.rating)} (${currentProduct.reviews} отзывов)</div>
            <div class="product-page__price">${formatPrice(currentProduct.price)}</div>
            <p class="product-page__description">${currentProduct.description}</p>
            <button class="btn btn--primary product-page__btn" id="addToCartBtn">Добавить в корзину</button>
            <button class="btn btn--outline product-page__btn" id="orderNowBtn">Заказать сейчас</button>
        </div>
    `;
    document.getElementById('addToCartBtn')?.addEventListener('click', () => { addToCart(currentProduct.id); showNotification('Товар добавлен в корзину'); });
    document.getElementById('orderNowBtn')?.addEventListener('click', () => { addToCart(currentProduct.id); window.location.href = 'order.html'; });
}

function renderReviews() {
    const container = document.getElementById('reviewsSection');
    if (!container) return;
    const productReviews = reviewsData.filter(r => r.productId === currentProduct.id);
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    let reviewsHtml = `<div class="reviews-section"><h3 class="reviews-title">Отзывы покупателей (${productReviews.length})</h3><div class="reviews-list">`;
    if (productReviews.length === 0) reviewsHtml += '<p>Пока нет отзывов. Будьте первым!</p>';
    else productReviews.forEach(review => { reviewsHtml += `<div class="review-item"><div class="review-header"><span class="review-author">${review.author}</span><span class="review-date">${review.date}</span></div><div class="review-rating">${getStarsHtml(review.rating)}</div><p class="review-text">${review.text}</p></div>`; });
    reviewsHtml += `</div>`;
    if (isLoggedIn) reviewsHtml += `<div class="review-form"><h4>Оставить отзыв</h4><select id="reviewRating"><option value="5">5 - Отлично</option><option value="4">4 - Хорошо</option><option value="3">3 - Средне</option><option value="2">2 - Плохо</option><option value="1">1 - Ужасно</option></select><textarea id="reviewText" placeholder="Расскажите о вашем впечатлении от букета..." rows="4"></textarea><button class="btn btn--primary" id="submitReviewBtn">Отправить отзыв</button></div>`;
    else reviewsHtml += `<div class="review-form"><p>Чтобы оставить отзыв, <a href="#" id="loginToReview">войдите</a> в свой аккаунт.</p></div>`;
    reviewsHtml += `</div>`;
    container.innerHTML = reviewsHtml;
    
    document.getElementById('submitReviewBtn')?.addEventListener('click', () => {
        const rating = parseInt(document.getElementById('reviewRating').value);
        const text = document.getElementById('reviewText').value.trim();
        if (!text) { showNotification('Напишите текст отзыва', 'error'); return; }
        const newReview = { id: reviewsData.length + 1, productId: currentProduct.id, author: currentUser.name || 'Пользователь', rating: rating, text: text, date: new Date().toLocaleDateString('ru-RU') };
        reviewsData.push(newReview);
        saveToStorage('reviews', reviewsData);
        renderReviews();
        showNotification('Спасибо за отзыв!');
    });
    document.getElementById('loginToReview')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('authModal').classList.add('active'); });
}

document.addEventListener('DOMContentLoaded', loadProduct);