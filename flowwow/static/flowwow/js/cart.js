let cart = getFromStorage('cart') || [];

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function addToCart(productId, quantity = 1) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: quantity });
    }
    
    saveToStorage('cart', cart);
    updateCartCount();
    showNotification(`${product.name} добавлен в корзину`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToStorage('cart', cart);
    updateCartCount();
    renderCartModal();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) removeFromCart(productId);
        else { item.quantity = quantity; saveToStorage('cart', cart); renderCartModal(); }
    }
    updateCartCount();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderCartModal() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center;">Корзина пуста</p>';
        cartTotalSpan.textContent = '0 ₽';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item__image" style="background-image: url('${item.image}')"></div>
            <div class="cart-item__info">
                <div class="cart-item__title">${item.name}</div>
                <div class="cart-item__price">${formatPrice(item.price)}</div>
                <div class="cart-item__quantity">
                    <button class="cart-qty-btn" data-id="${item.id}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-btn" data-id="${item.id}" data-change="1">+</button>
                </div>
            </div>
            <button class="cart-item__remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
        </div>
    `).join('');
    
    cartTotalSpan.textContent = formatPrice(getCartTotal());
    
    document.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const change = parseInt(btn.dataset.change);
            const item = cart.find(i => i.id === id);
            if (item) updateCartQuantity(id, item.quantity + change);
        });
    });
    
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeFromCart(parseInt(btn.dataset.id));
        });
    });
}