//Global Application// 

const API_URL = 'https://fakestoreapi.com/products';
let products = []
let cart = JSON.parse(localStorage.getItem('cart')) || [];

//DOM Elements
const productsContainer = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const cartToggle = document.getElementById('cart-toggle');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart')
const cartItemsContainer = document.getElementById('cart-items')
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');

//Initialize App
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupEventListeners();
    updateCartUI();
});


//Fetch Data From Free API
async function fetchProducts(){
    try {
        const response = await fetch(API_URL);
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        productsContainer.innerHTML = '<p class= "error"> failed to load products. try again later </p>'
    }
}

//Render Products Grid
function renderProducts(productsList){
    productsContainer.innerHTML = productsList.map(items =>
        `<div class = 'product-card'>
            <img src=${items.image} alt = ${items.title}></img>
            <h3>${items.title}</h3>
            <p class = 'price'>$${items.price.toFixed(2)}</p>
            <button onClick='addToCart(${items.id})'>Add to Cart</button>
        </div>`   
    ).join('')
}

//Add Item to Cart Array
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push ({...product, quantity: 1});
    }
    saveAndRefreshCart();
};

//Update Cart Modal UI Element
function updateCartUI(){
    //Async toals & notification counts
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotalPrice.textContent = totalPrice.toFixed(2);

    if (cart.length === 0){
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your Cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item =>
        `<div class = "cart-item">
            <img src='${item.image}' width='40'></img>
            <div>
                <h4>${item.title.substring(0, 20)}...</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <button onClick= 'removeFromCart(${item.id})'>X</button>
        </div>`
        
    ).join('');
}

window.removeFromCart = function(productId){
    cart = cart.filter(item => item.id !== productId);
    saveAndRefreshCart();
};

function saveAndRefreshCart(){
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
};

//interactive Features & Filters
function setupEventListeners() {
    //Search Bar Input Event
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.title.toLowerCase().includes(query));
        renderProducts(filtered);
    });

    //Toggle Modal View
    cartToggle.addEventListener('click', () => cartModal.classList.remove('hidden'));
    closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));
}