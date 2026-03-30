
let currentFilter = getUrlParameter('category') || 'all';
let currentSort = 'default';
let currentSearch = getUrlParameter('search') || '';

function initCatalogFilters() {
    const filterContainer = document.getElementById('filterCategories');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    if (!filterContainer) return;
    const categories = ['all', ...new Set(productsData.map(p => p.category))];
    const categoryNames = { all: 'Все букеты', romantic: 'Романтические', wedding: 'Свадебные', birthday: 'День рождения', business: 'Деловые', spring: 'Весенние', luxury: 'Премиум' };
    filterContainer.innerHTML = categories.map(cat => `<button class="filter-btn ${currentFilter === cat ? 'active' : ''}" data-category="${cat}">${categoryNames[cat] || cat}</button>`).join('');
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.category;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatalogProducts();
        });
    });
    if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; renderCatalogProducts(); });
    if (searchInput) {
        if (currentSearch) searchInput.value = currentSearch;
        searchInput.addEventListener('input', (e) => { currentSearch = e.target.value.toLowerCase(); renderCatalogProducts(); });
    }
    renderCatalogProducts();
}

function filterProducts() {
    let filtered = [...productsData];
    if (currentFilter !== 'all') filtered = filtered.filter(p => p.category === currentFilter);
    if (currentSearch) filtered = filtered.filter(p => p.name.toLowerCase().includes(currentSearch) || p.composition.toLowerCase().includes(currentSearch));
    switch (currentSort) {
        case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
        case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
        default: filtered.sort((a, b) => a.id - b.id);
    }
    return filtered;
}

function renderCatalogProducts() {
    const container = document.getElementById('catalogProducts');
    if (!container) return;
    const filtered = filterProducts();
    if (filtered.length === 0) { container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 40px;">Ничего не найдено. Попробуйте изменить параметры поиска.</p>'; return; }
    container.innerHTML = filtered.map(product => `<div class="product-card" data-id="${product.id}"><div class="product-card__image" style="background-image: url('${product.image}')">${product.oldPrice ? '<span class="product-card__badge">Хит продаж</span>' : ''}</div><div class="product-card__info"><h3 class="product-card__title">${product.name}</h3><p class="product-card__composition">${product.composition}</p><div class="product-card__rating">${getStarsHtml(product.rating)}<span>(${product.reviews})</span></div><div class="product-card__price">${formatPrice(product.price)}${product.oldPrice ? `<span style="text-decoration: line-through; font-size: 14px; opacity: 0.6; margin-left: 8px;">${formatPrice(product.oldPrice)}</span>` : ''}</div><button class="btn product-card__btn" data-id="${product.id}">В корзину</button><button class="btn btn--outline product-card__view" data-id="${product.id}" style="margin-top: 8px; width: 100%;">Подробнее</button></div></div>`).join('');
    document.querySelectorAll('.product-card__btn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); addToCart(parseInt(btn.dataset.id)); }));
    document.querySelectorAll('.product-card__view').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); window.location.href = `product.html?id=${btn.dataset.id}`; }));
    document.querySelectorAll('.product-card').forEach(card => card.addEventListener('click', () => window.location.href = `product.html?id=${card.dataset.id}`));
}

