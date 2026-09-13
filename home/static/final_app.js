// ════════════════════════════════════════════ 
//  DATA STRUCTURE 
// ════════════════════════════════════════════ 
const categories = [
  { id: 'all', name: 'All Products', icon: '✦' },
  ...JSON.parse(document.getElementById('categories-data').textContent)
];

const products = JSON.parse(document.getElementById('products-data').textContent);

// ════════════════════════════════════════════ 
//  STATE 
// ════════════════════════════════════════════ 
let selectedCategory = 'all';
const quantities = {};
const wishlist = new Set();
const cart = {};

const savedCart = JSON.parse(
  document.getElementById('cart-items-data').textContent
);

const initialCart = Object.fromEntries(
  savedCart
    .map(item => {
      const product = products.find(
        p => Number(p.id) === Number(item.product_id)
      );

      if (!product) {
        return null;
      }

      return [
        item.product_id,
        {
          product: product,
          qty: Number(item.quantity)
        }
      ];
    })
    .filter(Boolean)
);

Object.assign(cart, initialCart);



products.forEach(p => { quantities[p.id] = 1; });

// ════════════════════════════════════════════ 
//  RENDER CATEGORIES 
// ════════════════════════════════════════════ 
function renderCategories() {
  document.getElementById('categoryList').innerHTML = categories.map(cat => {
    const count = cat.id === 'all' ? products.length : products.filter(p => p.category_id === cat.id).length;
    return ` 
      <button class="category-btn ${selectedCategory === cat.id ? 'active' : ''}" onclick="selectCategory('${cat.id}')"> 
        <span class="cat-icon">${cat.icon}</span> 
        ${cat.name} 
        <span class="cat-count">${count}</span> 
      </button>`;
  }).join('');
}

// ════════════════════════════════════════════ 
//  RENDER PRODUCTS 
// ════════════════════════════════════════════ 
function renderProducts() {
  const filtered = selectedCategory === 'all' ? products : products.filter(p => Number(p.category_id) === Number(selectedCategory));
  const cat = categories.find(c => c.id === selectedCategory);
  document.getElementById('categoryTitle').textContent = cat.name;
  document.getElementById('productCount').textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

  document.getElementById('productsGrid').innerHTML = filtered.map((p, i) => ` 
    <div class="product-card" style="animation-delay:${i * 0.06}s"> 
      <div class="card-image"> 
        <img src="${p.image}" alt="${p.name}" loading="lazy" 
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/> 
        <div class="fallback" style="display:none">${p.icon}</div> 
        ${p.badge ? `<span class="card-badge ${p.badge_class}">${p.badge}</span>` : ''} 
        <button class="wishlist-btn" onclick="toggleWishlist(${p.id},this)" title="Wishlist"> 
          ${wishlist.has(p.id) ? '❤️' : '🤍'} 
        </button> 
      </div> 
      <div class="card-body"> 
        <div class="card-category">${categories.find(c => c.id === p.category_id)?.name || ''}</div> 
        <div class="card-name">${p.name}</div> 
        <div class="card-desc">${p.description}</div> 
        <div class="card-price-row"> 
          <span class="card-price">$${Number(p.price).toFixed(2)}</span>
          <span class="card-price-unit">USD</span> 
        </div> 
        <div class="qty-row"> 
          <span class="qty-label">Quantity</span> 
          <div class="qty-controls"> 
            <button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button> 
            <div class="qty-value" id="qty-${p.id}">${quantities[p.id]}</div> 
            <button class="qty-btn" onclick="changeQty(${p.id},+1)">+</button> 
          </div> 
        </div> 
        <button class="add-btn" id="addbtn-${p.id}" onclick="addToCart(${p.id})"> 
          Add to Cart 
        </button> 
      </div> 
    </div> 
  `).join('');
}

// ════════════════════════════════════════════ 
//  CATEGORY 
// ════════════════════════════════════════════ 
function selectCategory(catId) {

  selectedCategory = catId === 'all' ? 'all' : Number(catId);

  renderCategories();
  renderProducts();

  document.getElementById('shopSection').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

}
// ════════════════════════════════════════════ 
//  QUANTITY ON CARD 
// ════════════════════════════════════════════ 
function changeQty(id, delta) {
  quantities[id] = Math.max(1, Math.min(10, (quantities[id] || 1) + delta));
  const el = document.getElementById(`qty-${id}`);
  if (el) el.textContent = quantities[id];
}

// ════════════════════════════════════════════ 
//  WISHLIST 
// ════════════════════════════════════════════ 
function toggleWishlist(id, btn) {
  if (wishlist.has(id)) { wishlist.delete(id); btn.textContent = '🤍'; }
  else { wishlist.add(id); btn.textContent = '❤️'; showToast('Added to wishlist'); }
}

// ════════════════════════════════════════════ 
//  ADD TO CART 
// ════════════════════════════════════════════ 
function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split(';') : [];

  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

async function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const qty = quantities[id] || 1;

  const formData = new FormData();
  formData.append('product_id', id);
  formData.append('quantity', qty);

  try {
    const response = await fetch('/add-to-cart/', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      showToast('Please log in first');
      return;
    }

    cart[id]
      ? cart[id].qty = data.quantity
      : (cart[id] = { product, qty: data.quantity });

    const btn = document.getElementById(`addbtn-${id}`);

    if (btn) {
      btn.classList.add('added');
      btn.textContent = `✓ Added (${cart[id].qty})`;

      setTimeout(() => {
        btn.classList.remove('added');
        btn.textContent = 'Add to Cart';
      }, 1600);
    }

    showToast(`${product.name} added to cart`);
    updateCartUI();

  } catch (error) {
    console.error(error);
    showToast('Something went wrong');
  }
}

// ════════════════════════════════════════════ 
//  CART QTY 
// ════════════════════════════════════════════ 
// ════════════════════════════════════════════
//  CART QTY
// ════════════════════════════════════════════

async function changeCartQty(id, delta) {
  if (!cart[id]) return;

  const newQty = cart[id].qty + delta;

  if (newQty < 1) {
    await removeFromCart(id);
    return;
  }

  const quantity = Math.min(10, newQty);

  const formData = new FormData();
  formData.append('product_id', id);
  formData.append('quantity', quantity);

  try {
    const response = await fetch('/update-cart/', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      showToast('Unable to update cart');
      return;
    }

    cart[id].qty = data.quantity;
    updateCartUI();

  } catch (error) {
    console.error(error);
    showToast('Something went wrong');
  }
}


async function removeFromCart(id) {
  if (!cart[id]) return;

  const name = cart[id]?.product?.name;

  const formData = new FormData();
  formData.append('product_id', id);

  try {
    const response = await fetch('/remove-from-cart/', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      showToast('Unable to remove item');
      return;
    }

    delete cart[id];
    updateCartUI();

    if (name) {
      showToast(`${name} removed`);
    }

  } catch (error) {
    console.error(error);
    showToast('Something went wrong');
  }
}


async function clearCart() {
  try {
    const response = await fetch('/clear-cart/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      showToast('Unable to clear cart');
      return;
    }

    Object.keys(cart).forEach(k => delete cart[k]);

    updateCartUI();
    showToast('Cart cleared');

  } catch (error) {
    console.error(error);
    showToast('Something went wrong');
  }
}

// ════════════════════════════════════════════ 
//  UPDATE CART UI — PRICING ALGORITHM 
// ════════════════════════════════════════════ 
function updateCartUI() {
  const items = Object.values(cart);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 150 ? 0 : 9.99;
  const grandTotal = subtotal + shipping;

  document.getElementById('cartCount').textContent = totalQty;
  document.getElementById('itemCount').textContent = `${totalQty} item${totalQty !== 1 ? 's' : ''}`;
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('shipping').textContent = subtotal === 0 ? '—' : shipping === 0 ? 'FREE ✓' : `$${shipping.toFixed(2)}`;
  document.getElementById('grandTotal').textContent = `$${grandTotal.toFixed(2)}`;
  document.getElementById('checkoutBtn').disabled = items.length === 0;

  const note = document.getElementById('shippingNote');
  note.textContent = subtotal > 0 && subtotal < 150
    ? `Add $${(150 - subtotal).toFixed(2)} more for free shipping`
    : subtotal >= 150 ? '✓ You qualify for free shipping!' : '';

  const itemsEl = document.getElementById('cartItems');
  if (items.length === 0) {
    itemsEl.innerHTML = ` 
      <div class="empty-cart"> 
        <div class="big-icon">🛍</div> 
        <p>Your cart is empty</p> 
        <small>Add items to get started</small> 
      </div>`;
    return;
  }

  itemsEl.innerHTML = items.map(item => ` 
    <div class="cart-item"> 
      <img class="cart-item-img" src="${item.product.image}" alt="${item.product.name}" 
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/> 
      <div class="cart-item-fb" style="display:none">${item.product.icon}</div> 
      <div> 
        <div class="cart-item-name">${item.product.name}</div> 
        <div class="cart-item-sub">${item.product.description}</div> 
        <div class="cart-item-controls"> 
          <div class="qty-controls"> 
            <button class="qty-btn" onclick="changeCartQty(${item.product.id},-1)">−</button> 
            <div class="qty-value" style="width:34px;height:30px;font-size:13px">${item.qty}</div> 
            <button class="qty-btn" onclick="changeCartQty(${item.product.id},+1)">+</button> 
          </div> 
        </div> 
        <button class="cart-remove" onclick="removeFromCart(${item.product.id})">Remove</button> 
      </div> 
      <div> 
        <div class="cart-item-price">$${(item.product.price * item.qty).toFixed(2)}</div> 
        <div class="cart-item-unit">$${item.product.price} × ${item.qty}</div> 
      </div> 
    </div> 
  `).join('');
}

// ════════════════════════════════════════════ 
//  CHECKOUT 
// ════════════════════════════════════════════ 
async function checkout() {
  try {
    const response = await fetch('/checkout/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!data.success) {
      showToast(data.error || 'Checkout failed.');
      return;
    }

    document.getElementById('modalTotal').textContent =
      `Order Total: $${data.total.toFixed(2)}`;

    document.getElementById('modalOverlay').classList.add('open');

    toggleCart();

    Object.keys(cart).forEach(k => delete cart[k]);

    updateCartUI();

  } catch (error) {
    console.error('Checkout error:', error);
    showToast('Something went wrong during checkout.');
  }
}




function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

// ════════════════════════════════════════════ 
//  CART TOGGLE 
// ════════════════════════════════════════════ 
function toggleCart() {
  document.getElementById('cartPanel').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ════════════════════════════════════════════ 
//  TOAST 
// ════════════════════════════════════════════ 
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

// ════════════════════════════════════════════ 
//  INIT 
// ════════════════════════════════════════════ 
renderCategories();
renderProducts();
updateCartUI();
// ════════════════════════════════════════════
//  AI SHOPPING ASSISTANT
// ════════════════════════════════════════════

let currentConversationId = null;
let aiIsLoading = false;


// ════════════════════════════════════════════
//  TOGGLE AI PANEL
// ════════════════════════════════════════════

function toggleAI() {

  const panel = document.getElementById('aiPanel');

  if (!panel) return;

  panel.classList.toggle('open');

  if (panel.classList.contains('open')) {

    const input = document.getElementById('aiInput');

    if (input) {
      setTimeout(() => input.focus(), 150);
    }

  }

}


// ════════════════════════════════════════════
//  ADD AI MESSAGE TO UI
// ════════════════════════════════════════════

function addAIMessage(text, type = 'bot') {

  const messages = document.getElementById('aiMessages');

  if (!messages) return;

  const message = document.createElement('div');

  message.className =
    type === 'user'
      ? 'ai-message ai-user'
      : 'ai-message ai-bot';

  message.textContent = text;

  messages.appendChild(message);

  messages.scrollTop = messages.scrollHeight;

  return message;
}


// ════════════════════════════════════════════
//  SEND AI MESSAGE
// ════════════════════════════════════════════

async function sendAIMessage() {

  if (aiIsLoading) return;

  const input = document.getElementById('aiInput');
  const sendButton = document.querySelector('.ai-input-area button');

  if (!input) return;

  const message = input.value.trim();

  if (!message) return;


  // =========================================
  // SHOW USER MESSAGE
  // =========================================

  addAIMessage(message, 'user');

  input.value = '';

  aiIsLoading = true;


  // =========================================
  // LOADING STATE
  // =========================================

  if (sendButton) {
    sendButton.disabled = true;
    sendButton.classList.add('ai-loading');
    sendButton.textContent = '...';
  }

  const loadingMessage = addAIMessage(
    'Thinking...',
    'bot'
  );


  // =========================================
  // SEND REQUEST
  // =========================================

  try {

    const response = await fetch('/api/ai/', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },

      body: JSON.stringify({
        message: message,
        conversation_id: currentConversationId
      })

    });


    const data = await response.json();


    // =========================================
    // REMOVE LOADING
    // =========================================

    if (loadingMessage) {
      loadingMessage.remove();
    }


    // =========================================
    // ERROR FROM SERVER
    // =========================================

    if (!response.ok || !data.success) {

      addAIMessage(
        data.error || 'Sorry, something went wrong.',
        'bot'
      );

      return;
    }


    // =========================================
    // SAVE CONVERSATION
    // =========================================

    currentConversationId = data.conversation_id;


    // =========================================
    // AI RESPONSE
    // =========================================

    addAIMessage(
      data.response,
      'bot'
    );

    // =========================================
    // AI PRODUCT RECOMMENDATIONS
    // =========================================

    if (data.product_ids && data.product_ids.length > 0) {

      const messages = document.getElementById('aiMessages');

      data.product_ids.forEach(productId => {

        const product = products.find(
          p => Number(p.id) === Number(productId)
        );

        if (!product) return;

        const card = document.createElement('div');

        card.className = 'ai-product-card';

        card.innerHTML = `
  <div class="ai-product-image">
    <img
      src="${product.image}"
      alt="${product.name}"
      onerror="this.style.display='none';"
    >
  </div>

  <div class="ai-product-info">

    <div class="ai-product-name">
      ${product.name}
    </div>

    <div class="ai-product-description">
      ${product.description}
    </div>

    <div class="ai-product-price">
      $${Number(product.price).toFixed(2)}
    </div>

    <button
      class="ai-add-cart-btn"
      onclick="addToCart(${product.id})">

      Add to Cart

    </button>

  </div>
`;


        messages.appendChild(card);

      });

      messages.scrollTop = messages.scrollHeight;
    }



  } catch (error) {

    console.error('AI Error:', error);


    if (loadingMessage) {
      loadingMessage.remove();
    }


    addAIMessage(
      'Unable to connect to the AI service. Please try again.',
      'bot'
    );


  } finally {

    // =========================================
    // RESET
    // =========================================

    aiIsLoading = false;

    if (sendButton) {
      sendButton.disabled = false;
      sendButton.classList.remove('ai-loading');
      sendButton.textContent = 'Send';
    }

    input.focus();

  }

}


