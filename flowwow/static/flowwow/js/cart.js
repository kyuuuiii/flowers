let cart = JSON.parse(localStorage.getItem('cart') || '[]');

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product-card__btn').forEach(btn => {
        // Prevent double-binding
        if (btn.dataset.cartBound) return;
        btn.dataset.cartBound = 'true';

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = this.dataset.id;
            if (id) addToCart(parseInt(id));
        });
    });
    updateCartCount();
});

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

function addToCart(productId, quantity = 1) {
    let product = null;

    const btn = document.querySelector(`.product-card__btn[data-id="${productId}"]`);
    if (btn && btn.dataset.name && btn.dataset.price) {
        product = {
            id: parseInt(btn.dataset.id),
            name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            image: btn.dataset.image || ''
        };
    }

    if (!product && typeof productsData !== 'undefined') {
        product = productsData.find(p => p.id === productId) || null;
    }

    if (!product || !product.id || !product.name) {
        console.warn('⚠️ Cart: Missing data for product', productId);
        return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} добавлен в корзину`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (typeof renderCartModal === 'function') renderCartModal();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) removeFromCart(productId);
        else {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            if (typeof renderCartModal === 'function') renderCartModal();
        }
    }
    updateCartCount();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
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
                <div class="cart-item__price">${item.price} ₽</div>
                <div class="cart-item__quantity">
                    <button class="cart-qty-btn" data-id="${item.id}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-btn" data-id="${item.id}" data-change="1">+</button>
                </div>
            </div>
            <button class="cart-item__remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
        </div>
    `).join('');

    cartTotalSpan.textContent = getCartTotal() + ' ₽';

    // Rebind modal buttons
    document.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
        document.querySelectorAll('.cart-qty-btn').forEach(b => {
            if (b.dataset.change == btn.dataset.change && b.dataset.id == btn.dataset.id) {
                b.addEventListener('click', (e) => {
                    const id = parseInt(b.dataset.id);
                    const change = parseInt(b.dataset.change);
                    const item = cart.find(i => i.id === id);
                    if (item) updateCartQuantity(id, (item.quantity || 1) + change);
                });
            }
        });
    });

    document.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
        document.querySelectorAll('.cart-item__remove').forEach(b => {
            if (b.dataset.id == btn.dataset.id) {
                b.addEventListener('click', () => removeFromCart(parseInt(b.dataset.id)));
            }
        });
    });
}