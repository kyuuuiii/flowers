document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initHeroSlider();
    initCategories();
    initPopularProducts();
    initCatalogProducts();
    initTestimonials();
    initModals();
    initProfile();
    initAdminFeatures();
    updateCartCount();
    initSearchOnMain();
});

function initHeader() {
    const hamburger = document.getElementById('hamburgerBtn');
    const nav = document.querySelector('.nav');
    if (hamburger && nav) hamburger.addEventListener('click', () => nav.classList.toggle('active'));
    
    const searchBtn = document.querySelector('.header__search-btn');
    const searchBar = document.getElementById('searchBar');
    const closeSearch = document.getElementById('closeSearchBtn');
    if (searchBtn && searchBar) searchBtn.addEventListener('click', () => searchBar.classList.toggle('active'));
    if (closeSearch) closeSearch.addEventListener('click', () => searchBar.classList.remove('active'));
    
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    if (cartBtn && cartModal) cartBtn.addEventListener('click', () => { renderCartModal(); cartModal.classList.add('active'); });
    
    // const userBtn = document.getElementById('userBtn');
    // const authModal = document.getElementById('authModal');
    // if (userBtn && authModal) userBtn.addEventListener('click', () => authModal.classList.add('active'));
    //
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero__slide');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const dotsContainer = document.getElementById('heroDots');
    let currentSlide = 0;
    if (!slides.length) return;
    
    function updateSlides() {
        slides.forEach((slide, index) => slide.classList.toggle('active', index === currentSlide));
        if (dotsContainer) dotsContainer.querySelectorAll('.hero__dot').forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
    }
    
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('hero__dot');
            if (index === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => { currentSlide = index; updateSlides(); });
            dotsContainer.appendChild(dot);
        });
    }
    
    createDots();
    if (prevBtn) prevBtn.addEventListener('click', () => { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateSlides(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { currentSlide = (currentSlide + 1) % slides.length; updateSlides(); });
    setInterval(() => { currentSlide = (currentSlide + 1) % slides.length; updateSlides(); }, 5000);
}

function initCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    // Server-side rendered, skip JS rendering
    if (container.children.length > 0) return;
}

function initPopularProducts() {
    const container = document.getElementById('popularProducts');
    if (!container) return;
    // Server-side rendered, skip JS rendering
    if (container.children.length > 0) {
        // Rebind event handlers for server-rendered products
        bindProductEvents();
        return;
    }
}

function initCatalogProducts() {
    // Bind event handlers for catalog products (server-rendered)
    bindProductEvents();
}

function bindProductEvents() {
    document.querySelectorAll('.product-card__btn').forEach(btn => {
        btn.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            addToCart(parseInt(btn.dataset.id)); 
        });
    });
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.dataset.slug) window.location.href = `/product/${card.dataset.slug}/`;
            else window.location.href = `product.html?id=${card.dataset.id}`;
        });
    });
}

function initTestimonials() {
    const container = document.getElementById('testimonialsSlides');
    const prevBtn = document.getElementById('testimonialsPrev');
    const nextBtn = document.getElementById('testimonialsNext');
    const dotsContainer = document.getElementById('testimonialsDots');
    let currentIndex = 0;
    if (!container) return;
    
    function renderTestimonials() {
        container.innerHTML = testimonialsData.map((t, i) => `<div class="testimonial-card" style="display: ${i === currentIndex ? 'block' : 'none'}"><div class="testimonial-card__rating">${getStarsHtml(t.rating)}</div><p class="testimonial-card__text">"${t.text}"</p><div class="testimonial-card__author">${t.name}</div><div class="testimonial-card__city">${t.city}</div></div>`).join('');
        if (dotsContainer) {
            dotsContainer.innerHTML = testimonialsData.map((_, i) => `<div class="testimonials__dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></div>`).join('');
            document.querySelectorAll('.testimonials__dot').forEach(dot => dot.addEventListener('click', () => { currentIndex = parseInt(dot.dataset.index); renderTestimonials(); }));
        }
    }
    
    renderTestimonials();
    if (prevBtn) prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + testimonialsData.length) % testimonialsData.length; renderTestimonials(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % testimonialsData.length; renderTestimonials(); });
    setInterval(() => { currentIndex = (currentIndex + 1) % testimonialsData.length; renderTestimonials(); }, 6000);
}

function initModals() {
    document.querySelectorAll('.modal__close, .modal').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__close') || e.target.classList.contains('modal')) {
                document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
            }
        });
    });
    
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (authTabs.length) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabType = tab.dataset.tab;
                if (loginForm && registerForm) {
                    if (tabType === 'login') { loginForm.classList.add('active'); registerForm.classList.remove('active'); }
                    else { loginForm.classList.remove('active'); registerForm.classList.add('active'); }
                }
            });
        });
    }
    
    if (loginForm) {
        // loginForm.addEventListener('submit', (e) => {
        //     e.preventDefault();
        //     const email = loginForm.querySelector('input[type="email"]').value;
        //     const password = loginForm.querySelector('input[type="password"]').value;
        //     const users = JSON.parse(localStorage.getItem('users') || '[]');
        //     const user = users.find(u => u.email === email && u.password === password);
        //     if (user) {
        //         localStorage.setItem('isLoggedIn', 'true');
        //         localStorage.setItem('currentUser', JSON.stringify(user));
        //         showNotification('Вход выполнен успешно!');
        //         document.getElementById('authModal')?.classList.remove('active');
        //         location.reload();
        //     } else showNotification('Неверный email или пароль', 'error');
        // });
    }
    
    if (registerForm) {
        // registerForm.addEventListener('submit', (e) => {
        //     e.preventDefault();
        //     const name = registerForm.querySelector('input[placeholder="Имя"]').value;
        //     const email = registerForm.querySelector('input[placeholder="Email"]').value;
        //     const password = registerForm.querySelector('input[placeholder="Пароль"]').value;
        //     const confirm = registerForm.querySelector('input[placeholder="Подтвердите пароль"]').value;
        //     if (password !== confirm) { showNotification('Пароли не совпадают', 'error'); return; }
        //     const users = JSON.parse(localStorage.getItem('users') || '[]');
        //     if (users.find(u => u.email === email)) { showNotification('Пользователь с таким email уже существует', 'error'); return; }
        //     const newUser = { id: users.length + 1, name: name, email: email, password: password, isAdmin: email === 'admin@flowwow.ru' };
        //     users.push(newUser);
        //     localStorage.setItem('users', JSON.stringify(users));
        //     localStorage.setItem('isLoggedIn', 'true');
        //     localStorage.setItem('currentUser', JSON.stringify(newUser));
        //     showNotification('Регистрация выполнена успешно!');
        //     document.getElementById('authModal')?.classList.remove('active');
        //     location.reload();
        // });
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => { if (cart.length === 0) showNotification('Корзина пуста', 'error'); else window.location.href = '/order/'; });
    
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) newsletterForm.addEventListener('submit', (e) => { e.preventDefault(); showNotification('Спасибо за подписку!'); newsletterForm.reset(); });
}

// function initProfile() {
//     const profileBtn = document.getElementById('userBtn');
//     const profileModal = document.getElementById('profileModal');
//     if (!profileBtn || !profileModal) return;
//     profileBtn.addEventListener('click', () => {
//         if (localStorage.getItem('isLoggedIn') === 'true') {
//             renderProfileContent(JSON.parse(localStorage.getItem('currentUser') || '{}'));
//             profileModal.classList.add('active');
//         } else document.getElementById('authModal').classList.add('active');
//     });
// }

// function renderProfileContent(user) {
//     const container = document.getElementById('profileContent');
//     if (!container) return;
//     const orders = JSON.parse(localStorage.getItem('orders') || '[]');
//     const userOrders = orders.filter(o => o.userId === user.id);
//     container.innerHTML = `
//         <div class="profile-section">
//             <div class="profile-tabs">
//                 <button class="profile-tab active" data-tab="info">Личные данные</button>
//                 <button class="profile-tab" data-tab="orders">Мои заказы</button>
//                 ${user.isAdmin ? '<button class="profile-tab" data-tab="admin">Админ-панель</button>' : ''}
//                 <button class="profile-tab" data-tab="logout">Выйти</button>
//             </div>
//             <div class="profile-content active" id="profileInfo"><h3>Личная информация</h3><p><strong>Имя:</strong> ${user.name || 'Не указано'}</p><p><strong>Email:</strong> ${user.email}</p></div>
//             <div class="profile-content" id="profileOrders"><h3>Мои заказы</h3>${userOrders.length === 0 ? '<p>У вас пока нет заказов</p>' : `<div class="orders-list">${userOrders.map(order => `<div class="order-card"><div class="order-card__header"><span class="order-card__number">Заказ №${order.id}</span><span class="order-card__date">${order.date}</span></div><div class="order-card__items">${order.items.map(item => `<p>${item.name} x ${item.quantity}</p>`).join('')}</div><div class="order-card__total">Сумма: ${formatPrice(order.total)}</div><span class="order-card__status">${order.status}</span></div>`).join('')}</div>`}</div>
//             ${user.isAdmin ? `<div class="profile-content" id="profileAdmin"><div class="admin-panel"><div class="admin-sidebar"><div class="admin-sidebar__nav"><button class="admin-nav-btn active" data-admin-tab="products">Товары</button><button class="admin-nav-btn" data-admin-tab="articles">Статьи</button><button class="admin-nav-btn" data-admin-tab="orders">Заказы</button><button class="admin-nav-btn" data-admin-tab="users">Пользователи</button></div></div><div id="adminContent"></div></div></div>` : ''}
//         </div>
//     `;
//
//     document.querySelectorAll('.profile-tab').forEach(tab => {
//         tab.addEventListener('click', () => {
//             const tabName = tab.dataset.tab;
//             document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
//             document.querySelectorAll('.profile-content').forEach(c => c.classList.remove('active'));
//             tab.classList.add('active');
//             if (tabName === 'info') document.getElementById('profileInfo').classList.add('active');
//             if (tabName === 'orders') document.getElementById('profileOrders').classList.add('active');
//             if (tabName === 'admin') document.getElementById('profileAdmin').classList.add('active');
//             if (tabName === 'logout') logout();
//         });
//     });
//     if (user.isAdmin) initAdminPanel();
// }
//
// function initAdminPanel() {
//     let currentAdminTab = 'products';
//     function renderAdminContent() {
//         const container = document.getElementById('adminContent');
//         if (!container) return;
//         if (currentAdminTab === 'products') {
//             container.innerHTML = `<div class="admin-table"><button class="btn btn--primary" id="openAddProductBtn" style="margin-bottom: 20px;">+ Добавить товар</button><table><thead><tr><th>ID</th><th>Название</th><th>Цена</th><th>Категория</th><th>Действия</th></tr></thead><tbody>${productsData.map(product => `<tr><td>${product.id}</td><td>${product.name}</td><td>${formatPrice(product.price)}</td><td>${product.category}</td><td class="admin-actions"><button class="delete-product" data-id="${product.id}"><i class="fas fa-trash"></i></button></td></tr>`).join('')}</tbody></table></div>`;
//             document.getElementById('openAddProductBtn')?.addEventListener('click', () => document.getElementById('addProductModal').classList.add('active'));
//             document.querySelectorAll('.delete-product').forEach(btn => btn.addEventListener('click', () => { if (confirm('Удалить товар?')) { const index = productsData.findIndex(p => p.id === parseInt(btn.dataset.id)); if (index !== -1) { productsData.splice(index, 1); saveProductsToStorage(); renderAdminContent(); showNotification('Товар удален'); } } }));
//         }
//         if (currentAdminTab === 'articles') {
//             container.innerHTML = `<div class="admin-table"><button class="btn btn--primary" id="openAddArticleBtn" style="margin-bottom: 20px;">+ Добавить статью</button><table><thead><tr><th>ID</th><th>Заголовок</th><th>Категория</th><th>Действия</th></tr></thead><tbody>${articlesData.map(article => `<tr><td>${article.id}</td><td>${article.title}</td><td>${article.category}</td><td class="admin-actions"><button class="delete-article" data-id="${article.id}"><i class="fas fa-trash"></i></button></td></tr>`).join('')}</tbody></table></div>`;
//             document.getElementById('openAddArticleBtn')?.addEventListener('click', () => document.getElementById('addArticleModal').classList.add('active'));
//             document.querySelectorAll('.delete-article').forEach(btn => btn.addEventListener('click', () => { if (confirm('Удалить статью?')) { const index = articlesData.findIndex(a => a.id === parseInt(btn.dataset.id)); if (index !== -1) { articlesData.splice(index, 1); saveArticlesToStorage(); renderAdminContent(); showNotification('Статья удалена'); } } }));
//         }
//         if (currentAdminTab === 'orders') {
//             const orders = JSON.parse(localStorage.getItem('orders') || '[]');
//             container.innerHTML = `<div class="admin-table"><table><thead><tr><th>ID</th><th>Дата</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr></thead><tbody>${orders.map(order => `<tr><td>${order.id}</td><td>${order.date}</td><td>${formatPrice(order.total)}</td><td><select class="order-status" data-id="${order.id}"><option value="Новый" ${order.status === 'Новый' ? 'selected' : ''}>Новый</option><option value="В обработке" ${order.status === 'В обработке' ? 'selected' : ''}>В обработке</option><option value="Доставляется" ${order.status === 'Доставляется' ? 'selected' : ''}>Доставляется</option><option value="Выполнен" ${order.status === 'Выполнен' ? 'selected' : ''}>Выполнен</option></select></td><td class="admin-actions"><button class="delete-order" data-id="${order.id}"><i class="fas fa-trash"></i></button></td></tr>`).join('')}</tbody></table></div>`;
//             document.querySelectorAll('.order-status').forEach(select => select.addEventListener('change', () => { const ordersList = JSON.parse(localStorage.getItem('orders') || '[]'); const order = ordersList.find(o => o.id === parseInt(select.dataset.id)); if (order) { order.status = select.value; localStorage.setItem('orders', JSON.stringify(ordersList)); showNotification('Статус заказа обновлен'); } }));
//             document.querySelectorAll('.delete-order').forEach(btn => btn.addEventListener('click', () => { if (confirm('Удалить заказ?')) { let ordersList = JSON.parse(localStorage.getItem('orders') || '[]'); ordersList = ordersList.filter(o => o.id !== parseInt(btn.dataset.id)); localStorage.setItem('orders', JSON.stringify(ordersList)); renderAdminContent(); showNotification('Заказ удален'); } }));
//         }
//         if (currentAdminTab === 'users') {
//             const users = JSON.parse(localStorage.getItem('users') || '[]');
//             container.innerHTML = `<div class="admin-table"><table><thead><tr><th>ID</th><th>Имя</th><th>Email</th><th>Роль</th><th>Действия</th></tr></thead><tbody>${users.map(user => `<tr><td>${user.id}</td><td>${user.name || '-'}</td><td>${user.email}</td><td>${user.isAdmin ? 'Админ' : 'Пользователь'}</td><td class="admin-actions"><button class="delete-user" data-id="${user.id}"><i class="fas fa-trash"></i></button></td></tr>`).join('')}</tbody></table></div>`;
//             document.querySelectorAll('.delete-user').forEach(btn => btn.addEventListener('click', () => { if (confirm('Удалить пользователя?')) { let usersList = JSON.parse(localStorage.getItem('users') || '[]'); usersList = usersList.filter(u => u.id !== parseInt(btn.dataset.id)); localStorage.setItem('users', JSON.stringify(usersList)); renderAdminContent(); showNotification('Пользователь удален'); } }));
//         }
//     }
//     document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); currentAdminTab = btn.dataset.adminTab; renderAdminContent(); }));
//     renderAdminContent();
// }

function initAdminFeatures() {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newId = Math.max(...productsData.map(p => p.id), 0) + 1;
            const newProduct = {
                id: newId,
                name: document.getElementById('productName').value,
                composition: document.getElementById('productComposition').value,
                price: parseInt(document.getElementById('productPrice').value),
                image: document.getElementById('productImage').value,
                category: document.getElementById('productCategory').value,
                description: document.getElementById('productDescription').value,
                rating: 0,
                reviews: 0,
                inStock: true
            };
            productsData.push(newProduct);
            saveProductsToStorage();
            showNotification('Товар добавлен');
            document.getElementById('addProductModal').classList.remove('active');
            addProductForm.reset();
            if (document.getElementById('adminContent')) location.reload();
        });
    }
    const addArticleForm = document.getElementById('addArticleForm');
    if (addArticleForm) {
        addArticleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newId = Math.max(...articlesData.map(a => a.id), 0) + 1;
            const newArticle = {
                id: newId,
                title: document.getElementById('articleTitle').value,
                excerpt: document.getElementById('articleExcerpt').value,
                image: document.getElementById('articleImage').value,
                category: document.getElementById('articleCategory').value,
                content: document.getElementById('articleContent').value,
                date: new Date().toLocaleDateString('ru-RU'),
                views: 0
            };
            articlesData.push(newArticle);
            saveArticlesToStorage();
            showNotification('Статья добавлена');
            document.getElementById('addArticleModal').classList.remove('active');
            addArticleForm.reset();
            if (document.getElementById('adminContent')) location.reload();
        });
    }
}

function initSearchOnMain() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    if (window.location.search.includes('search=')) {
        const currentSearch = new URLSearchParams(window.location.search).get('search') || '';
        searchInput.value = currentSearch;
    }

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/catalog/?search=${encodeURIComponent(query)}`;
            } else {
                window.location.href = '/catalog/';
            }
        }
    });
}

// function logout() {
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('currentUser');
//     showNotification('Вы вышли из аккаунта');
//     document.getElementById('profileModal')?.classList.remove('active');
//     location.reload();
// }

if (document.querySelector('.order-form')) {
    (function initOrderPage() {
        const form = document.getElementById('orderForm');
        if (!form) return;
        const cartItems = getFromStorage('cart') || [];
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const summaryDiv = document.querySelector('.order-summary');
        if (summaryDiv) summaryDiv.innerHTML = `<h4>Ваш заказ</h4>${cartItems.map(item => `<p>${item.name} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}</p>`).join('')}<p><strong>Итого: ${formatPrice(total)}</strong></p>`;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (!isLoggedIn) { showNotification('Войдите в аккаунт для оформления заказа', 'error'); document.getElementById('authModal').classList.add('active'); return; }
            if (cartItems.length === 0) { showNotification('Корзина пуста', 'error'); return; }
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const newOrder = { id: orders.length + 1, userId: currentUser.id, date: new Date().toLocaleDateString('ru-RU'), items: cartItems, total: total, status: 'Новый' };
            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.removeItem('cart');
            showNotification('Заказ оформлен! С вами свяжется оператор.');
            setTimeout(() => window.location.href = '/catalog/', 2000);
        });
    })();
}