document.addEventListener('DOMContentLoaded', function() {
    const reviewsSection = document.getElementById('reviewsSection');
    if (!reviewsSection) return;

    const productId = reviewsSection.dataset.productId;
    const reviewsList = document.getElementById('reviewsList');
    const reviewsCountEl = document.getElementById('reviewsCount');
    const noReviewsMessage = document.getElementById('noReviewsMessage');
    const reviewForm = document.getElementById('reviewForm');
    const reviewRating = document.getElementById('reviewRating');
    const reviewText = document.getElementById('reviewText');
    const reviewLoginPrompt = document.getElementById('reviewLoginPrompt');
    const openAuthFromReview = document.getElementById('openAuthFromReview');

    function getProductReviewsFromStorage() {
        const key = 'productReviews';
        const stored = localStorage.getItem(key);
        if (!stored) return [];
        try { return JSON.parse(stored); } catch (e) { return []; }
    }

    function saveProductReviewsToStorage(reviews) {
        localStorage.setItem('productReviews', JSON.stringify(reviews));
    }

    function getCurrentUser() {
        if (localStorage.getItem('isLoggedIn') !== 'true') return null;
        try { return JSON.parse(localStorage.getItem('currentUser') || '{}'); } catch (e) { return null; }
    }

    function escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    function renderReviewItem(review) {
        const item = document.createElement('div');
        item.className = 'review-item';
        item.innerHTML = `
            <div class="review-header"><span class="review-author">${escapeHtml(review.author)}</span><span class="review-date">${escapeHtml(review.date)}</span></div>
            <div class="review-rating">${escapeHtml(String(review.rating))}/5</div>
            <p class="review-text">${escapeHtml(review.text)}</p>
        `;
        reviewsList.appendChild(item);
    }

    function updateReviewsStatus() {
        const byProduct = getProductReviewsFromStorage().filter(r => String(r.productId) === String(productId));
        const renderedCount = reviewsList.querySelectorAll('.review-item').length;
        const total = renderedCount;
        if (total === 0) {
            noReviewsMessage.style.display = 'block';
            reviewsCountEl.textContent = '0';
        } else {
            noReviewsMessage.style.display = 'none';
            reviewsCountEl.textContent = total;
        }
        return byProduct;
    }

    function initializeReviews() {
        const savedReviews = getProductReviewsFromStorage().filter(review => String(review.productId) === String(productId));
        if (savedReviews.length > 0) {
            savedReviews.forEach(renderReviewItem);
        }
        setTimeout(updateReviewsStatus, 0);
    }

    function toggleReviewForm() {
        const user = getCurrentUser();
        if (user) {
            reviewForm.style.display = 'block';
            reviewLoginPrompt.style.display = 'none';
        } else {
            if (reviewForm) reviewForm.style.display = 'none';
            if (reviewLoginPrompt) reviewLoginPrompt.style.display = 'block';
        }
    }

    if (openAuthFromReview) {
        openAuthFromReview.addEventListener('click', () => {
            document.getElementById('authModal')?.classList.add('active');
            document.getElementById('profileModal')?.classList.remove('active');
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showNotification('Войдите в аккаунт чтобы оставить отзыв', 'error');
                reviewLoginPrompt.style.display = 'block';
                return;
            }

            const rating = parseInt(reviewRating.value);
            const text = reviewText.value.trim();
            if (!rating || rating < 1 || rating > 5 || !text) {
                showNotification('Пожалуйста, выберите оценку и введите текст отзыва', 'error');
                return;
            }

            const allReviews = getProductReviewsFromStorage();
            const already = allReviews.find(r => String(r.productId) === String(productId) && String(r.userId || '') === String(currentUser.id || currentUser.email));
            if (already) {
                showNotification('Вы уже оставили отзыв для этого товара', 'error');
                return;
            }

            const newReview = {
                id: Date.now(),
                productId: Number(productId),
                userId: currentUser.id || currentUser.email,
                author: currentUser.name || currentUser.email || 'Пользователь',
                rating: rating,
                text: text,
                date: new Date().toLocaleDateString('ru-RU'),
            };

            allReviews.push(newReview);
            saveProductReviewsToStorage(allReviews);
            renderReviewItem(newReview);
            updateReviewsStatus();

            reviewRating.value = '';
            reviewText.value = '';

            showNotification('Спасибо за отзыв!');
        });
    }

    initializeReviews();
    toggleReviewForm();
});
