
// ===== MOBILE NAVIGATION MENU =====
const menu = document.querySelector(".menu");
const menuIcon = document.querySelector(".menu i");
const navList = document.querySelector(".nav-links");

menu.addEventListener("click", () => {
  navList.classList.toggle("active");
  menuIcon.classList.toggle("ri-close-line");
  menuIcon.classList.toggle("ri-close-large-line");
  menuIcon.classList.toggle("color-g");
  menuIcon.classList.toggle("color-w");
});

// ===== SHOPPING CART SETUP =====
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cart-close");
const cartContent = document.querySelector(".cart-content");

cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

// ===== LOCAL STORAGE =====
let cartItems = [];

try {
  cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
} catch (error) {
  cartItems = [];
}

const saveCart = () => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

// ===== CART ITEM COUNT =====
let cartItemCount = 0;

const updateCartCount = () => {
  const cartItemCountBadge = document.querySelector(".cart-item-count");

  cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (cartItemCount > 0) {
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = cartItemCount;
  } else {
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent = 0;
  }
};

// ===== TOTAL PRICE CALCULATION =====
const updateTotalPrice = () => {
  const totalPriceEl = document.querySelector(".total-price");

  let total = 0;

  cartItems.forEach((item) => {
    const price = parseFloat(
      item.price.replace(/[^0-9.]/g, "")
    );

    total += price * item.quantity;
  });

  totalPriceEl.textContent = `$${total.toFixed(2)}`;
};

// ===== DISPLAY CART ITEMS =====
const displayCart = () => {
  cartContent.innerHTML = "";

  cartItems.forEach((item, index) => {
    const cartBox = document.createElement("div");

    cartBox.classList.add("cart-box");

    cartBox.innerHTML = `
      <img class="cart-img" alt="Product">

      <div class="cart-detail">
        <h2 class="cart-product-title"></h2>
        <span class="cart-price"></span>

        <div class="cart-quantity">
          <button class="decrement" type="button">-</button>
          <span class="number"></span>
          <button class="increment" type="button">+</button>
        </div>
      </div>

      <i class="ri-delete-bin-line cart-remove"></i>
    `;

    cartBox.querySelector(".cart-img").src = item.image;
    cartBox.querySelector(".cart-product-title").textContent = item.title;
    cartBox.querySelector(".cart-price").textContent = item.price;
    cartBox.querySelector(".number").textContent = item.quantity;

    const decbtn = cartBox.querySelector(".decrement");

    decbtn.style.color = item.quantity === 1 ? "#999" : "#333";

    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
      cartItems.splice(index, 1);

      saveCart();
      displayCart();
    });

    cartBox.querySelector(".cart-quantity").addEventListener("click", (e) => {
      if (e.target.classList.contains("increment")) {
        item.quantity++;
      } else if (
        e.target.classList.contains("decrement") &&
        item.quantity > 1
      ) {
        item.quantity--;
      } else {
        return;
      }

      saveCart();
      displayCart();
    });

    cartContent.appendChild(cartBox);
  });

  updateCartCount();
  updateTotalPrice();
};

// ===== ADD PRODUCTS TO CART =====
const addtocart = (productBox) => {
  const productImgSrc = productBox.querySelector("img").src;
  const productTitle = productBox.querySelector(".product-title").textContent;
  const productPrice = productBox.querySelector(".price").textContent;

  const existingProduct = cartItems.find(
    (item) => item.title === productTitle
  );

  if (existingProduct) {
    alert("This Product Already Exists in the Cart!");
    return;
  }

  cartItems.push({
    image: productImgSrc,
    title: productTitle,
    price: productPrice,
    quantity: 1
  });

  saveCart();
  displayCart();
};

// ===== ADD TO CART BUTTONS =====
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-cart")) {
    const productBox = e.target.closest(".product-box");

    if (productBox) {
      addtocart(productBox);
    }
  }
});

// ===== CHECKOUT =====
const buyBtn = document.querySelector(".btn-buy");

buyBtn.addEventListener("click", () => {
  if (cartItems.length === 0) {
    alert("Your Cart is empty");
    return;
  }

  cartItems = [];

  saveCart();
  displayCart();

  alert("Thanks for Your Purchase!");
});

// ===== SEARCH BAR EFFECT =====
const searchContainer = document.querySelector(".search-ctr");
const searchForm = document.querySelector(".search-container form");
const searchIcon = document.querySelector(".search-container i");
const productList = document.querySelector(".product-list");

// ===== PRODUCT SEARCH ELEMENTS =====
const searchInput = document.querySelector("#search-item");
const productContent = document.querySelectorAll(".product-content");

searchContainer.addEventListener("mouseenter", () => {
  searchForm.style.border = "2px solid #e35f26";
  searchIcon.style.color = "#e35f26";

  if (searchInput.value.trim() !== "") {
    productList.style.display = "block";
  }
});

searchContainer.addEventListener("mouseleave", () => {
  searchForm.style.border = "";
  searchIcon.style.color = "";
  productList.style.display = "none";
});

// ===== FETCH PRODUCTS FROM API =====
let allProducts = [];
let fashionProducts = [];
let homeProducts = [];

const getUserdata = async () => {
  try {
    const res = await fetch(
      "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    allProducts = data;

    fashionProducts = allProducts.filter(
      (product) => product.category === "Fashion & Apparel"
    );

    homeProducts = allProducts.filter(
      (product) => product.category === "Home & Kitchen"
    );

    displayProducts(fashionProducts.slice(0, 8), productContent[0]);

    displayProducts(homeProducts.slice(0, 8), productContent[1]);

    displaySuggestions(fashionProducts.slice(0, 8));

  } catch (error) {
    console.error(error);
  }
};

// ===== DISPLAY SEARCH SUGGESTIONS =====
const displaySuggestions = (products) => {
  productList.innerHTML = "";

  products.forEach((pr) => {
    const div = document.createElement("div");

    div.classList.add("product");

    div.innerHTML = `
      <img alt="">
      <div class="p-details">
        <h2></h2>
        <h3></h3>
      </div>
    `;

    div.querySelector("img").src = pr.image;
    div.querySelector("img").alt = pr.name;

    div.querySelector("h2").textContent = pr.name;

    div.querySelector("h3").textContent =
      `$${(pr.priceCents / 100).toFixed(2)}`;

    productList.appendChild(div);
  });
};

// ===== DISPLAY PRODUCTS =====
const displayProducts = (products, container) => {
  container.innerHTML = "";

  products.forEach((pr) => {
    const prDiv = document.createElement("div");

    prDiv.classList.add("product-box");

    prDiv.innerHTML = `
      <div class="img-box">
        <img alt="">
      </div>

      <h2 class="product-title"></h2>

      <div class="price-and-cart">
        <span class="price"></span>
        <i class="ri-shopping-bag-line add-cart"></i>
      </div>
    `;

    prDiv.querySelector("img").src = pr.image;
    prDiv.querySelector("img").alt = pr.name;

    prDiv.querySelector(".product-title").textContent = pr.name;

    prDiv.querySelector(".price").textContent =
      `$${(pr.priceCents / 100).toFixed(2)}`;

    container.appendChild(prDiv);
  });
};

// ===== LIVE PRODUCT SEARCH =====
searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase().trim();

  const filteredFashionProducts = fashionProducts.filter((pr) =>
    pr.name.toLowerCase().includes(searchValue)
  );

  const filteredHomeProducts = homeProducts.filter((pr) =>
    pr.name.toLowerCase().includes(searchValue)
  );

  displaySuggestions(filteredFashionProducts.slice(0, 8));

  displayProducts(
    filteredFashionProducts.slice(0, 8),
    productContent[0]
  );

  displayProducts(
    filteredHomeProducts.slice(0, 8),
    productContent[1]
  );

  productList.style.display = searchValue === "" ? "none" : "block";
});

// ===== LOAD PRODUCTS =====
getUserdata();

// ===== LOGIN POPUP =====
const loginIcon = document.getElementById("login-icon");
const loginPopup = document.getElementById("login-popup");
const loginClose = document.getElementById("login-close");

loginIcon.addEventListener("click", () => {
  loginPopup.classList.add("active");
});

loginClose.addEventListener("click", () => {
  loginPopup.classList.remove("active");
});

loginPopup.addEventListener("click", (e) => {
  if (e.target === loginPopup) {
    loginPopup.classList.remove("active");
  }
});

// ===== PASSWORD VISIBILITY =====
const showPassword = document.getElementById("show-password");
const loginPassword = document.getElementById("login-password");

showPassword.addEventListener("click", () => {
  const isHidden = loginPassword.type === "password";

  loginPassword.type = isHidden ? "text" : "password";

  showPassword.classList.toggle("ri-eye-line", !isHidden);
  showPassword.classList.toggle("ri-eye-off-line", isHidden);
});

// ===== LOGIN FORM SUBMISSION =====
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Login form submitted!");
});

// ===== LOAD SAVED CART =====
displayCart();
