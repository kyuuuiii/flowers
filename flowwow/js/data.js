let categoriesData = [
    { id: 'romantic', name: 'Романтические', icon: 'fa-heart', count: 12 },
    { id: 'wedding', name: 'Свадебные', icon: 'fa-ring', count: 8 },
    { id: 'birthday', name: 'День рождения', icon: 'fa-cake-candles', count: 15 },
    { id: 'business', name: 'Деловые', icon: 'fa-briefcase', count: 6 },
    { id: 'spring', name: 'Весенние', icon: 'fa-seedling', count: 10 },
    { id: 'luxury', name: 'Премиум', icon: 'fa-gem', count: 5 }
];

let productsData = [
    { id: 1, name: 'Нежность', composition: 'Розы, пионы, эвкалипт', price: 3500, oldPrice: 4200, image: 'https://images.pexels.com/photos/1300585/pexels-photo-1300585.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.5, reviews: 24, category: 'romantic', description: 'Нежный букет из роз и пионов с добавлением эвкалипта. Идеально подходит для признания в любви или романтического свидания.', inStock: true },
    { id: 2, name: 'Элегантность', composition: 'Белые розы, гортензии', price: 4200, image: 'https://images.pexels.com/photos/6943690/pexels-photo-6943690.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.8, reviews: 32, category: 'wedding', description: 'Изысканный свадебный букет из белых роз и гортензий.', inStock: true },
    { id: 3, name: 'Весеннее настроение', composition: 'Тюльпаны, гиацинты, ирис', price: 2800, image: 'https://images.pexels.com/photos/1345467/pexels-photo-1345467.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.3, reviews: 18, category: 'spring', description: 'Яркий весенний букет, который поднимет настроение.', inStock: true },
    { id: 4, name: 'Королевский', composition: 'Орхидеи, розы, каллы', price: 6500, image: 'https://images.pexels.com/photos/568018/pexels-photo-568018.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 5.0, reviews: 6, category: 'luxury', description: 'Роскошный букет для особых случаев.', inStock: true },
    { id: 5, name: 'Любимой', composition: 'Красные розы, гипсофила', price: 3200, image: 'https://images.pexels.com/photos/696996/pexels-photo-696996.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.7, reviews: 45, category: 'romantic', description: 'Классический букет из красных роз.', inStock: true },
    { id: 6, name: 'Радость', composition: 'Герберы, хризантемы', price: 3200, image: 'https://images.pexels.com/photos/1261260/pexels-photo-1261260.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.2, reviews: 12, category: 'birthday', description: 'Яркий и жизнерадостный букет.', inStock: true }
];

let articlesData = [
    { id: 1, title: 'Как продлить жизнь срезанным цветам: 7 проверенных способов', excerpt: 'Узнайте, как правильно ухаживать за срезанными цветами, чтобы они дольше радовали вас.', image: 'https://images.pexels.com/photos/1105437/pexels-photo-1105437.jpeg?auto=compress&cs=tinysrgb&w=800', date: '1 марта 2025', category: 'Уход за цветами', views: 1240, content: '<p>Полный текст статьи о том, как продлить жизнь срезанным цветам...</p>' },
    { id: 2, title: 'Как выбрать идеальный букет для любого случая', excerpt: 'Руководство по выбору цветов для разных мероприятий.', image: 'https://images.pexels.com/photos/1300585/pexels-photo-1300585.jpeg?auto=compress&cs=tinysrgb&w=800', date: '3 мая 2025', category: 'Советы', views: 890, content: '<p>Полный текст статьи о выборе букета...</p>' },
    { id: 3, title: 'Тенденции флористики 2025: какие букеты будут в моде', excerpt: 'Обзор главных трендов в мире флористики в этом году.', image: 'https://images.pexels.com/photos/6943690/pexels-photo-6943690.jpeg?auto=compress&cs=tinysrgb&w=800', date: '20 апреля 2025', category: 'Новости', views: 1500, content: '<p>Полный текст статьи о трендах флористики...</p>' }
];

let testimonialsData = [
    { name: 'Екатерина Смирнова', city: 'Москва', text: 'Заказывала букет на юбилей мамы. Цветы были свежие, красивые, доставка точно в срок. Мама была в восторге!', rating: 5 },
    { name: 'Дмитрий Иванов', city: 'Санкт-Петербург', text: 'Потрясающий сервис! Заказал букет для девушки с доставкой в офис. Все прошло идеально.', rating: 5 },
    { name: 'Елена Петрова', city: 'Екатеринбург', text: 'Регулярно заказываю цветы для бизнес-партнеров. Всегда профессиональный подход.', rating: 4.5 }
];

let reviewsData = [
    { id: 1, productId: 1, author: 'Анна С.', rating: 5, text: 'Очень красивый букет! Цветы свежие, доставили вовремя.', date: '15.03.2025' },
    { id: 2, productId: 1, author: 'Михаил К.', rating: 4, text: 'Букет понравился, но курьер немного опоздал.', date: '10.03.2025' }
];

function getArticleById(id) { return articlesData.find(a => a.id === parseInt(id)); }
function getProductById(id) { return productsData.find(p => p.id === parseInt(id)); }
function saveProductsToStorage() { localStorage.setItem('products', JSON.stringify(productsData)); }
function saveArticlesToStorage() { localStorage.setItem('articles', JSON.stringify(articlesData)); }
function loadProductsFromStorage() { const stored = localStorage.getItem('products'); if (stored) productsData = JSON.parse(stored); }
function loadArticlesFromStorage() { const stored = localStorage.getItem('articles'); if (stored) articlesData = JSON.parse(stored); }

loadProductsFromStorage();
loadArticlesFromStorage();