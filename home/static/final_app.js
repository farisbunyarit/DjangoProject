// ════════════════════════════════════════════
//  DATA STRUCTURE
// ════════════════════════════════════════════
const categories = [
  { id: 'all',          name: 'All Products',        icon: '✦' },
  { id: 'engine',       name: 'Engine Parts',        icon: '⚙️' },
  { id: 'brakes',       name: 'Brake System',        icon: '🛑' },
  { id: 'electrical',   name: 'Electrical Parts',    icon: '⚡' },
  { id: 'suspension',   name: 'Suspension',          icon: '🔩' },
  { id: 'drivetrain',   name: 'Chain & Sprockets',    icon: '⛓️' },
];

const products = [
  // ENGINE PARTS
  { id:1,  cat:'engine',     name:'High-Flow Oil Filter',       desc:'Premium Performance · Universal Fit',       price:24,  badge:'Bestseller', badgeClass:'gold', icon:'⚙️', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPQTQXmdGCDD6xlBjFBXvbuzqIgNJRguNVO2Znm1YYng&s=10' },
  { id:2,  cat:'engine',     name:'Performance Air Filter',     desc:'High Flow · Reusable Performance Filter',   price:58,  badge:'New',        badgeClass:'dark', icon:'🔧', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbyo6thVmyMAxZxv8ihaPwpqJAC1RN-hkcGNdnMpBv_w&s=10' },
  { id:3,  cat:'engine',     name:'Engine Performance Kit',     desc:'Precision Components · Big Bike Series',    price:185, badge:'Premium',    badgeClass:'gold', icon:'⚙️', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjp0koBQzvt3QvmeJ2BiFDUaaajmyW8SPSC6COtPFvXQ&s=10' },
  { id:4,  cat:'engine',     name:'Heavy-Duty Spark Plugs',     desc:'Iridium Core · High Temperature Rated',     price:42,  badge:'',           badgeClass:'',     icon:'🔩', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTWPxXXy3BPNmpQ0Ozf0wgKOedBri1kV3ph9MtoAamAA&s=10' },

  // BRAKE SYSTEM
  { id:5,  cat:'brakes',     name:'Front Brake Disc',           desc:'Stainless Steel · High Performance',        price:145, badge:'Premium',    badgeClass:'gold', icon:'🛑', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYZCNP32uUgo7dyH4ijy8Rc-AgeH_21sc0zDpfelMMvA&s=10' },
  { id:6,  cat:'brakes',     name:'Brembo-Style Brake Pads',    desc:'Ceramic Compound · Low Dust',              price:72,  badge:'Bestseller', badgeClass:'gold', icon:'🛑', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmSy-XVn11k7S4FYM1afpFd4LbnPPHkFrDMVO-43ixBA&s=10' },
  { id:7,  cat:'brakes',     name:'Front Brake Caliper',        desc:'CNC Aluminum · High Performance',           price:220, badge:'New',        badgeClass:'dark', icon:'🔧', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXuBKW5pxaKv2Hb_WxjXOFN5yvkloD9QGgG3n23GtRqA&s=10' },

  // ELECTRICAL
  { id:8,  cat:'electrical', name:'LED Headlight Assembly',     desc:'Ultra Bright · Plug & Play',                price:119, badge:'Bestseller', badgeClass:'gold', icon:'💡', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXX5MmHCg-3qVDQCB5h4wCjoU4VHkuZsNbEurPLux88g&s=10' },
  { id:9,  cat:'electrical', name:'Lithium Motorcycle Battery',  desc:'Lightweight · High Starting Power',         price:165, badge:'Premium',    badgeClass:'gold', icon:'🔋', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmZd7Mi5RrBnfOb63uN9gDL1WAXtBD84QyzypLa5-tnw&s=10' },
  { id:10, cat:'electrical', name:'Digital Voltage Regulator',  desc:'Stable Output · Thermal Protection',        price:64,  badge:'New',        badgeClass:'dark', icon:'⚡', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Qk5zDVsQddUWzFFLWvnOQIGNPSHRtepXhB5fC_WKNA&s=10' },

  // SUSPENSION
  { id:11, cat:'suspension', name:'Adjustable Rear Shock',      desc:'Fully Adjustable · Sport Performance',       price:295, badge:'Premium',    badgeClass:'gold', icon:'🔩', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQfWj14vFUPLwEGl_x4oX7GaZpGWl4IEy6RZwxujQWYA&s=10' },
  { id:12, cat:'suspension', name:'Front Fork Upgrade Kit',     desc:'High Performance · Precision Damping',      price:340, badge:'New',        badgeClass:'dark', icon:'🔧', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ51zSgGyV257G3LP2hIxkJY9lT4Um3yxOhXptN00ZtFw&s=10' },

  // CHAIN & SPROCKETS
  { id:13, cat:'drivetrain', name:'Gold Chain & Sprocket Kit',  desc:'520 Series · Racing Performance',           price:189, badge:'Bestseller', badgeClass:'gold', icon:'⛓️', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCV4Iqp7XysAYWkh3B_9yOzyZ5hbtiW057mVCj6m1_4Q&s=10' },
  { id:14, cat:'drivetrain', name:'Rear Performance Sprocket',  desc:'Lightweight Aluminum · CNC Machined',       price:92,  badge:'',           badgeClass:'',     icon:'⚙️', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgJL7mtF7hDu2JMheIGOgfd-jutccw96EFayYFO7SDkA&s=10' },
  { id:15, cat:'drivetrain', name:'Heavy-Duty Drive Chain',     desc:'High Tensile Strength · Racing Grade',      price:128, badge:'New',        badgeClass:'dark', icon:'⛓️', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBotJeshi09CPiwlfaPrvL1U2OKzwcwCV8TYq6uydeFA&s=10' },
  { id:16, cat:'drivetrain', name:'Front Sprocket 15T',         desc:'Hardened Steel · Precision Machined',       price:39,  badge:'',           badgeClass:'',     icon:'⚙️', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGMTbWvaGaLHZ1wv32LpCZ4suf1N9nNqrXyq_JD1D0Ow&s=10' },
];

// ════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════
let selectedCategory = 'all';
const quantities = {};
const wishlist   = new Set();
const cart       = {};

products.forEach(p => { quantities[p.id] = 1; });

// ════════════════════════════════════════════
//  RENDER CATEGORIES
// ════════════════════════════════════════════
function renderCategories() {
  document.getElementById('categoryList').innerHTML = categories.map(cat => {
    const count = cat.id === 'all' ? products.length : products.filter(p => p.cat === cat.id).length;
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
  const filtered = selectedCategory === 'all' ? products : products.filter(p => p.cat === selectedCategory);
  const cat = categories.find(c => c.id === selectedCategory);
  document.getElementById('categoryTitle').textContent = cat.name;
  document.getElementById('productCount').textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

  document.getElementById('productsGrid').innerHTML = filtered.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.06}s">
      <div class="card-image">
        <img src="${p.img}" alt="${p.name}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
        <div class="fallback" style="display:none">${p.icon}</div>
        ${p.badge ? `<span class="card-badge ${p.badgeClass}">${p.badge}</span>` : ''}
        <button class="wishlist-btn" onclick="toggleWishlist(${p.id},this)" title="Wishlist">
          ${wishlist.has(p.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <div class="card-category">${categories.find(c=>c.id===p.cat)?.name||''}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-price-row">
          <span class="card-price">$${p.price}.00</span>
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
  selectedCategory = catId;
  renderCategories();
  renderProducts();
  document.getElementById('shopSection').scrollIntoView({behavior:'smooth', block:'start'});
}

// ════════════════════════════════════════════
//  QUANTITY ON CARD
// ════════════════════════════════════════════
function changeQty(id, delta) {
  quantities[id] = Math.max(1, Math.min(10, (quantities[id]||1) + delta));
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
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const qty = quantities[id] || 1;
  cart[id] ? cart[id].qty += qty : (cart[id] = { product, qty });

  const btn = document.getElementById(`addbtn-${id}`);
  if (btn) {
    btn.classList.add('added');
    btn.textContent = `✓ Added (${cart[id].qty})`;
    setTimeout(() => { btn.classList.remove('added'); btn.textContent = 'Add to Cart'; }, 1600);
  }
  showToast(`${product.name} added to cart`);
  updateCartUI();
}

// ════════════════════════════════════════════
//  CART QTY
// ════════════════════════════════════════════
function changeCartQty(id, delta) {
  if (!cart[id]) return;
  const newQty = cart[id].qty + delta;
  if (newQty < 1) { removeFromCart(id); return; }
  cart[id].qty = Math.min(10, newQty);
  updateCartUI();
}

function removeFromCart(id) {
  const name = cart[id]?.product?.name;
  delete cart[id];
  updateCartUI();
  if (name) showToast(`${name} removed`);
}

function clearCart() {
  Object.keys(cart).forEach(k => delete cart[k]);
  updateCartUI();
  showToast('Cart cleared');
}

// ════════════════════════════════════════════
//  UPDATE CART UI — PRICING ALGORITHM
// ════════════════════════════════════════════
function updateCartUI() {
  const items      = Object.values(cart);
  const totalQty   = items.reduce((s,i) => s + i.qty, 0);
  const subtotal   = items.reduce((s,i) => s + i.product.price * i.qty, 0);
  const shipping   = subtotal === 0 ? 0 : subtotal >= 150 ? 0 : 9.99;
  const grandTotal = subtotal + shipping;

  document.getElementById('cartCount').textContent  = totalQty;
  document.getElementById('itemCount').textContent  = `${totalQty} item${totalQty!==1?'s':''}`;
  document.getElementById('subtotal').textContent   = `$${subtotal.toFixed(2)}`;
  document.getElementById('shipping').textContent   = subtotal===0 ? '—' : shipping===0 ? 'FREE ✓' : `$${shipping.toFixed(2)}`;
  document.getElementById('grandTotal').textContent = `$${grandTotal.toFixed(2)}`;
  document.getElementById('checkoutBtn').disabled   = items.length === 0;

  const note = document.getElementById('shippingNote');
  note.textContent = subtotal>0 && subtotal<150
    ? `Add $${(150-subtotal).toFixed(2)} more for free shipping`
    : subtotal>=150 ? '✓ You qualify for free shipping!' : '';

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
      <img class="cart-item-img" src="${item.product.img}" alt="${item.product.name}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
      <div class="cart-item-fb" style="display:none">${item.product.icon}</div>
      <div>
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-item-sub">${item.product.desc}</div>
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
        <div class="cart-item-price">$${(item.product.price*item.qty).toFixed(2)}</div>
        <div class="cart-item-unit">$${item.product.price} × ${item.qty}</div>
      </div>
    </div>
  `).join('');
}

// ════════════════════════════════════════════
//  CHECKOUT
// ════════════════════════════════════════════
function checkout() {
  const items    = Object.values(cart);
  const subtotal = items.reduce((s,i) => s + i.product.price * i.qty, 0);
  const total    = subtotal + (subtotal<150 ? 9.99 : 0);
  document.getElementById('modalTotal').textContent = `Order Total: $${total.toFixed(2)}`;
  document.getElementById('modalOverlay').classList.add('open');
  toggleCart();
  Object.keys(cart).forEach(k => delete cart[k]);
  updateCartUI();
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