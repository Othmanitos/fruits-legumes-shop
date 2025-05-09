// Données des produits
const products = [
    {
        id: 1,
        title: "Pommes Bio",
        price: 2.99,
        category: "fruit",
        image: "images/apple.jpg",
        description: "Pommes bio cultivées localement, croquantes et juteuses."
    },
    {
        id: 2,
        title: "Bananes",
        price: 1.49,
        category: "fruit",
        image: "images/banana.jpg",
        description: "Bananes mûres à point, riches en potassium."
    },
    {
        id: 3,
        title: "Carottes",
        price: 1.99,
        category: "legume",
        image: "images/carrot.jpg",
        description: "Carottes bio, parfaites pour vos jus et plats cuisinés."
    },
    {
        id: 4,
        title: "Tomates",
        price: 3.49,
        category: "legume",
        image: "images/tomato.jpg",
        description: "Tomates cerises sucrées, idéales pour les salades."
    },
    {
        id: 5,
        title: "Fraises",
        price: 4.99,
        category: "fruit",
        image: "https://source.unsplash.com/random/300x200/?strawberry",
        description: "Fraises juteuses et parfumées, cueillies à maturité."
    },
    {
        id: 6,
        title: "Salade Verte",
        price: 1.29,
        category: "legume",
        image: "https://source.unsplash.com/random/300x200/?lettuce",
        description: "Salade verte croquante, prête à être dégustée."
    },
    {
        id: 7,
        title: "Oranges",
        price: 2.79,
        category: "fruit",
        image: "https://source.unsplash.com/random/300x200/?orange",
        description: "Oranges juteuses, riches en vitamine C."
    },
    {
        id: 8,
        title: "Courgettes",
        price: 2.19,
        category: "legume",
        image: "https://source.unsplash.com/random/300x200/?zucchini",
        description: "Courgettes fraîches, parfaites pour les grillades."
    }
];

// Panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartModal = document.getElementById('cart-modal');
const cartCount = document.querySelector('.cart-count');
const filterButtons = document.querySelectorAll('.filter-btn');

// Afficher les produits
function displayProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price.toFixed(2)} €</p>
                <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Ajouter les événements aux boutons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Ajouter au panier
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.title} ajouté au panier`);
}

// Mettre à jour le panier
function updateCart() {
    // Sauvegarder dans localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Mettre à jour le compteur
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Mettre à jour le modal du panier
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Votre panier est vide</p>';
            cartTotal.textContent = '0.00';
        } else {
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-info">
                        <p class="cart-item-title">${item.title}</p>
                        <p class="cart-item-price">${item.price.toFixed(2)} €</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
                `;
                cartItems.appendChild(cartItem);
            });
            
            cartTotal.textContent = total.toFixed(2);
            
            // Ajouter les événements
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', decreaseQuantity);
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', increaseQuantity);
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', removeItem);
            });
        }
    }
}

// Augmenter la quantité
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

// Diminuer la quantité
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

// Supprimer un article
function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Filtrer les produits
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        displayProducts(button.getAttribute('data-filter'));
    });
});

// Gérer le modal du panier
document.querySelector('.cart-icon').addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

document.querySelector('.close-cart').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Gérer le formulaire de contact
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Merci pour votre message! Nous vous contacterons bientôt.');
    e.target.reset();
});

// Gérer le formulaire de newsletter
document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Merci pour votre inscription à notre newsletter!');
    e.target.reset();
});

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
    
    // Smooth scrolling pour les liens
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Style pour les notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 3000;
    }
    .notification.show {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyle);
