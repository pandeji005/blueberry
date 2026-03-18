// ============================================
// BLUEBERRY APP — main.js
// All JavaScript for all pages lives here
// ============================================
// ============================================
// API BASE URL
// Change this when deploying
// ============================================
const API_URL = 'https://blueberry-backend-19ez.onrender.com'

// ============================================
// LOGIN PAGE
// ============================================

async function handleSignIn() {

  const email    = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value.trim()

  if (email === '') { alert('Please enter your email!'); return }
  if (password === '') { alert('Please enter your password!'); return }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) { alert('Please enter a valid email!'); return }

  try {
    const response = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('access_token',  data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      localStorage.setItem('user',          JSON.stringify(data.user))
      window.location.href = 'home.html'
    } else {
      alert(data.error || 'Login failed!')
    }

  } catch (error) {
    alert('Cannot connect to server. Make sure Django is running!')
    console.log(error)
  }
}

// ============================================
// SIGNUP PAGE
// ============================================
async function handleSignUp() {

  const username = document.getElementById('username').value.trim()
  const email    = document.getElementById('signup-email').value.trim()
  const password = document.getElementById('signup-password').value.trim()

  if (username === '') { alert('Please enter a username!'); return }
  if (email === '')    { alert('Please enter your email!'); return }
  if (password === '') { alert('Please enter a password!'); return }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) { alert('Please enter a valid email!'); return }
  if (password.length < 6) { alert('Password must be at least 6 characters!'); return }
  if (!/[0-9]/.test(password)) { alert('Password must contain at least one number!'); return }
  if (!/[a-zA-Z]/.test(password)) { alert('Password must contain at least one letter!'); return }

  try {
    const response = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('access_token',  data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      localStorage.setItem('user',          JSON.stringify(data.user))
      window.location.href = 'home.html'
    } else {
      const errorMsg = data.email?.[0] || data.username?.[0] || data.password?.[0] || 'Signup failed!'
      alert(errorMsg)
    }

  } catch (error) {
    alert('Cannot connect to server. Make sure Django is running!')
    console.log(error)
  }
}

// ============================================
// CART PAGE
// ============================================

// ============================================
// CART PAGE
// ============================================

// This runs automatically when cart.html loads
function loadCart() {

  // STEP 1 — Read cart from localStorage
  const savedCart = localStorage.getItem('cart')
  const cart = savedCart ? JSON.parse(savedCart) : []

  // STEP 2 — Get references to HTML elements
  const emptyCart     = document.getElementById('empty-cart')
  const cartList      = document.getElementById('cart-list')
  const orderSummary  = document.getElementById('order-summary')
  const placeOrderBtn = document.getElementById('place-order-btn')
  const subtotalEl    = document.getElementById('subtotal')
  const totalEl       = document.getElementById('total')

  // STEP 3 — If cart is empty show empty state
  if (cart.length === 0) {
    emptyCart.style.display    = 'flex'
    orderSummary.style.display = 'none'
    placeOrderBtn.style.display = 'none'
    cartList.innerHTML = ''
    return
  }

  // STEP 4 — Hide empty state
  emptyCart.style.display = 'none'

  // STEP 5 — Build cart items HTML with quantity controls
  let cartHTML = ''
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity
    cartHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-subtotal">₹${itemTotal}</span>
        </div>
        <div class="cart-qty-controls">
          <button class="qty-btn cart-qty-btn"
            onclick="cartRemove('${item.name}')">−</button>
          <span class="qty-count dark">${item.quantity}</span>
          <button class="qty-btn cart-qty-btn"
            onclick="cartAdd('${item.name}', ${item.price})">+</button>
        </div>
      </div>
    `
  })

  // STEP 6 — Inject HTML
  cartList.innerHTML = cartHTML

  // STEP 7 — Calculate totals
  const subtotal    = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 30
  const total       = subtotal + deliveryFee

  // STEP 8 — Fill price values
  subtotalEl.textContent = '₹' + subtotal
  totalEl.textContent    = '₹' + total

  // STEP 9 — Show summary and button
  orderSummary.style.display  = 'block'
  placeOrderBtn.style.display = 'block'

}

function cartAdd(name, price) {

  // Read cart
  const savedCart = localStorage.getItem('cart')
  const cart = savedCart ? JSON.parse(savedCart) : []

  // Find item and increase quantity
  const index = cart.findIndex(item => item.name === name)
  if (index !== -1) {
    cart[index].quantity++
  } else {
    cart.push({ name, price, quantity: 1 })
  }

  // Save and refresh cart display
  localStorage.setItem('cart', JSON.stringify(cart))
  loadCart()  // ← reload cart page display

}

function cartRemove(name) {

  // Read cart
  const savedCart = localStorage.getItem('cart')
  const cart = savedCart ? JSON.parse(savedCart) : []

  // Find item
  const index = cart.findIndex(item => item.name === name)
  if (index !== -1) {
    cart[index].quantity--
  }

  // Remove items with 0 quantity
  const updatedCart = cart.filter(item => item.quantity > 0)

  // Save and refresh cart display
  localStorage.setItem('cart', JSON.stringify(updatedCart))
  loadCart()  // ← reload cart page display

}

function placeOrder() {
  // Clear cart from localStorage after ordering
  localStorage.removeItem('cart')
  alert('Order placed successfully! 🎉')
  window.location.href = 'home.html'
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = 'home.html'
  }
}

// ============================================
// HAMBURGER MENU
// ============================================

function toggleMenu() {
  alert('Menu coming in Phase 2!')
}

// ============================================
// MENU PAGE
// ============================================

function addToCart(name, price) {

  // STEP 1 — Read existing cart
  const savedCart = localStorage.getItem('cart')
  const cart = savedCart ? JSON.parse(savedCart) : []

  // STEP 2 — Check if item already exists in cart
  const existingIndex = cart.findIndex(item => item.name === name)

  if (existingIndex !== -1) {
    // Item EXISTS — just increase quantity
    cart[existingIndex].quantity++
  } else {
    // Item is NEW — add it with quantity 1
    cart.push({
      name: name,
      price: price,
      quantity: 1
    })
  }

  // STEP 3 — Save updated cart
  localStorage.setItem('cart', JSON.stringify(cart))

  // STEP 4 — Update the button on the page to show - quantity +
  updateMenuButton(name, cart[existingIndex !== -1 ? existingIndex : cart.length - 1].quantity)

}

function removeFromCart(name) {

  // STEP 1 — Read existing cart
  const savedCart = localStorage.getItem('cart')
  const cart = savedCart ? JSON.parse(savedCart) : []

  // STEP 2 — Find the item
  const existingIndex = cart.findIndex(item => item.name === name)

  if (existingIndex !== -1) {
    // Decrease quantity
    cart[existingIndex].quantity--

    // If quantity hits 0, remove it completely
    const updatedCart = cart.filter(item => item.quantity > 0)
    localStorage.setItem('cart', JSON.stringify(updatedCart))

    // Update button back to + if quantity is 0
    const newQty = cart[existingIndex].quantity
    updateMenuButton(name, newQty)
  }

}

function updateMenuButton(name, quantity) {

  // Find the button container for this item
  // We use data-name attribute to identify it
  const container = document.querySelector(`[data-name="${name}"]`)
  if (!container) return

  if (quantity > 0) {
    // Show  -  quantity  +  controls
    container.innerHTML = `
      <button class="qty-btn" onclick="removeFromCart('${name}')">−</button>
      <span class="qty-count">${quantity}</span>
      <button class="qty-btn" onclick="addToCart('${name}', ${container.dataset.price})">+</button>
    `
    container.classList.add('qty-controls')
  } else {
    // Show plain + button again
    container.innerHTML = `
      <button class="add-btn" onclick="addToCart('${name}', ${container.dataset.price})">+</button>
    `
    container.classList.remove('qty-controls')
  }

}


// ============================================
// HOME PAGE — Load real restaurants
// ============================================

async function loadRestaurants() {
  const grid = document.getElementById('restaurant-grid')
  if (!grid) return

  try {
    const response = await fetch(`${API_URL}/api/restaurants/`)
    const restaurants = await response.json()

    let html = ''
    restaurants.forEach(restaurant => {
      html += `
        <a href="menu.html?id=${restaurant.id}" class="restaurant-card">
          <div class="restaurant-card-img">🍛</div>
          <span class="restaurant-card-name">${restaurant.name}</span>
        </a>
      `
    })

    grid.innerHTML = html

  } catch (error) {
    grid.innerHTML = '<p>Could not load restaurants. Is Django running?</p>'
    console.log(error)
  }
}

// ============================================
// MENU PAGE — Load real menu
// ============================================

async function loadMenu() {
  const menuList = document.getElementById('menu-list')
  if (!menuList) return

  // Get restaurant id from URL
  const urlParams  = new URLSearchParams(window.location.search)
  const restaurantId = urlParams.get('id')

  if (!restaurantId) {
    menuList.innerHTML = '<p>No restaurant selected.</p>'
    return
  }

  try {
    const response   = await fetch(`${API_URL}/api/restaurants/${restaurantId}/`)
    const restaurant = await response.json()

    // Update page title
    const navLogo = document.querySelector('.nav-logo')
    if (navLogo) navLogo.textContent = restaurant.name

    // Build menu items
    let html = ''
    restaurant.menu_items.forEach(item => {
      html += `
        <div class="menu-item">
          <div class="menu-item-info">
            <span class="menu-item-name">${item.name}</span>
            <span class="menu-item-price">₹${item.price}</span>
          </div>
          <div class="cart-control" data-name="${item.name}" data-price="${item.price}">
            <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">+</button>
          </div>
        </div>
      `
    })

    menuList.innerHTML = html

  } catch (error) {
    menuList.innerHTML = '<p>Could not load menu. Is Django running?</p>'
    console.log(error)
  }
}


if (document.getElementById('cart-list')) {
  loadCart()
}

if (document.getElementById('restaurant-grid')) {
  loadRestaurants()
}

if (document.getElementById('menu-list')) {
  loadMenu()
}


