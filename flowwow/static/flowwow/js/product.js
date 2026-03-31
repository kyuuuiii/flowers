// product.js
document.addEventListener('DOMContentLoaded', function() {
    const reviewsSection = document.getElementById('reviewsSection');
    if (!reviewsSection) return;

    const form = document.getElementById('reviewForm');
    const authPrompt = document.getElementById('authPrompt');
    const submitBtn = document.getElementById('submitReviewBtn');
    const openAuthBtn = document.getElementById('openAuthModalBtn');
    const reviewsList = document.getElementById('reviewsList');
    const countEl = document.getElementById('reviewsCount');
    const emptyMsg = document.getElementById('noReviewsMessage');

    // 🔒 CSRF Helper
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    // 🔐 Read auth state from HTML data attribute (NO DJANGO SYNTAX IN JS)
    const isAuthenticated = reviewsSection.dataset.authenticated === 'true';

    function updateAuthState() {
        if (isAuthenticated) {
            form.style.display = 'block';
            authPrompt.style.display = 'none';
        } else {
            form.style.display = 'none';
            authPrompt.style.display = 'block';
        }
    }
    updateAuthState();

    // 🚪 Open Login Modal
    if (openAuthBtn) {
        openAuthBtn.addEventListener('click', () => {
            document.getElementById('authModal')?.classList.add('active');
        });
    }

    // 📤 Submit Review
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            const data = {
                product_id: form.querySelector('[name="product_id"]').value,
                rating: parseInt(document.getElementById('reviewRating').value),
                comment: document.getElementById('reviewText').value.trim()
            };

            try {
                const res = await fetch('/review/submit/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (res.ok) {
                    const r = result.review;
                    const html = `<div class="review-item"><div class="review-header"><span class="review-author">${r.author}</span><span class="review-date">${r.date}</span></div><div class="review-rating">${r.rating}/5</div><p class="review-text">${r.comment}</p></div>`;
                    reviewsList.insertAdjacentHTML('afterbegin', html);
                    
                    countEl.textContent = parseInt(countEl.textContent) + 1;
                    emptyMsg.style.display = 'none';
                    form.reset();
                    alert('✅ Отзыв опубликован!');
                } else {
                    alert('❌ ' + (result.error || 'Ошибка'));
                }
            } catch (err) {
                alert('❌ Ошибка сети');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить отзыв';
            }
        });
    }

    // 🛒 Keep your cart logic here
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => addToCart(parseInt(addToCartBtn.dataset.id)));
    }
});