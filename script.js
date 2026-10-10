
const products = [
  {
    id: 1,
    name: "Cloud Ceramic Vase",
    category: "Home",
    price: 899,
    badge: "BESTSELLER",
    description: "Sculptural stoneware · Cream",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Everyday Tote",
    category: "Accessories",
    price: 699,
    badge: "EVERYDAY PICK",
    description: "Roomy canvas · Natural",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Studio Headphones",
    category: "Tech",
    price: 2499,
    badge: "NEW ARRIVAL",
    description: "Minimal design · Sand",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Soft Glow Lamp",
    category: "Home",
    price: 1799,
    badge: "",
    description: "Ambient lighting · Warm white",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Daily Carry Bottle",
    category: "Accessories",
    price: 549,
    badge: "",
    description: "Reusable steel · Sage",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Pocket Speaker",
    category: "Tech",
    price: 1499,
    badge: "STAFF PICK",
    description: "Compact audio · Charcoal",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"
  }
];

const productGrid = document.getElementById("productGrid");
const productTotal = document.getElementById("productTotal");
const emptyState = document.getElementById("emptyState");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const shippingMessage = document.getElementById("shippingMessage");
const cartFooter = document.getElementById("cartFooter");
const toast = document.getElementById("toast");

let activeCategory = "All";
let cart = [];
let toastTimer;

const formatPrice = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

function getVisibleProducts() {
  const query = searchInput.value.trim().toLowerCase();

  let visible = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const searchableText =
      `${product.name} ${product.category} ${product.description}`.toLowerCase();

    return matchesCategory && searchableText.includes(query);
  });

  const sort = sortSelect.value;

  if (sort === "low") {
    visible.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    visible.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    visible.sort((a, b) => a.name.localeCompare(b.name));
  }

  return visible;
}

function renderProducts() {
  const visible = getVisibleProducts();

  productTotal.textContent =
    `${String(visible.length).padStart(2, "0")} PRODUCTS`;

  productGrid.innerHTML = visible.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 50}ms">
      <div class="product-visual">
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x700/eeeee5/65734d?text=VELORA'"
        >
        ${product.badge
          ? `<span class="product-badge">${product.badge}</span>`
          : ""}
        <button class="quick-add" data-add="${product.id}">
          + Add to bag
        </button>
      </div>

      <div class="product-info">
        <div>
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
        </div>
        <span class="product-price">${formatPrice(product.price)}</span>
      </div>
    </article>
  `).join("");

  emptyState.hidden = visible.length !== 0;
  productGrid.hidden = visible.length === 0;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} added to your bag`);
}

function updateQuantity(id, change) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
  showToast("Item removed from your bag");
}

function renderCart() {
  const count = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  cartCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  cartSubtotal.textContent = formatPrice(subtotal);

  if (count === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <span>♡</span>
        <h3>Your bag is taking a little break.</h3>
        <p>Find something lovely to bring home.</p>
        <button class="primary-button" id="emptyShopButton">
          Explore products ↗
        </button>
      </div>
    `;

    cartFooter.hidden = true;
    return;
  }

  cartFooter.hidden = false;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-line">
      <img
        class="cart-thumb"
        src="${item.image}"
        alt="${item.name}"
        onerror="this.onerror=null;this.src='https://placehold.co/100x120/eeeee5/65734d?text=Item'"
      >
      <div class="cart-line-details">
        <h3>${item.name}</h3>
        <p>${formatPrice(item.price)}</p>

        <div>
          <div class="quantity-control">
            <button data-quantity="${item.id}" data-change="-1" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-quantity="${item.id}" data-change="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-item" data-remove="${item.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join("");

  const freeShippingThreshold = 1999;
  const remaining = freeShippingThreshold - subtotal;

  shippingMessage.textContent = remaining > 0
    ? `You're ${formatPrice(remaining)} away from free shipping!`
    : "You've unlocked free shipping!";
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
}

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    searchPanel.classList.remove("open");
  }
});

document.getElementById("searchToggle").addEventListener("click", () => {
  searchPanel.classList.toggle("open");

  if (searchPanel.classList.contains("open")) {
    searchInput.focus();
  } else {
    searchInput.value = "";
    renderProducts();
  }
});

document.getElementById("closeSearch").addEventListener("click", () => {
  searchPanel.classList.remove("open");
  searchInput.value = "";
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.getElementById("categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter-btn").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  const shopButton = event.target.closest("#emptyShopButton");

  if (quantityButton) {
    updateQuantity(
      Number(quantityButton.dataset.quantity),
      Number(quantityButton.dataset.change)
    );
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }

  if (shopButton) {
    closeCart();
    document.getElementById("products").scrollIntoView({
      behavior: "smooth"
    });
  }
});

document.getElementById("resetFilters").addEventListener("click", () => {
  activeCategory = "All";
  searchInput.value = "";
  sortSelect.value = "featured";

  document.querySelectorAll(".filter-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === "All"
    );
  });

  renderProducts();
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) return;

  const summary = cart.map(item =>
    `${item.name} × ${item.quantity}`
  ).join(", ");

  showToast("Demo checkout only. No payment was made.");

  // This is a mock checkout, not a real payment system.
  console.log("Mock order:", {
    items: summary,
    subtotal: cart.reduce(
      (total, item) => total + item.price * item.quantity, 0
    )
  });
});

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const emailInput = document.getElementById("newsletterEmail");
  const message = document.getElementById("newsletterMessage");

  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  message.textContent =
    "You're on our demo list! No information was sent or stored.";

  emailInput.value = "";
});

renderProducts();
renderCart();
