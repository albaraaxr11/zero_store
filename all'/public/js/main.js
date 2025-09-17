let cart = JSON.parse(localStorage.getItem("cart")) || [];
let loggedIn = localStorage.getItem("loggedIn") || false;

// تحقق من تسجيل الدخول
function checkLogin() {
  if (!loggedIn || loggedIn === "false") {
    alert("الرجاء تسجيل الدخول أولاً للوصول إلى السلة.");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// تغيير اللون (منتج 3 أبيض / أسود)
function changeColor(productId, imagePath, productName) {
  document.getElementById(productId + "-img").src = imagePath;
  document.querySelector(`#${productId}-btn`).setAttribute("onclick", `addToCart('${productName}', 10)`);
}

// إضافة للسلة مع صورة
function addToCart(name, price) {
  let imgSrc = "";
  if (name.includes("منتج 1")) imgSrc = "assets/product1.jpg";
  if (name.includes("منتج 2")) imgSrc = "assets/product2.jpg";
  if (name.includes("أسود")) imgSrc = "assets/product3.jpg";
  if (name.includes("أبيض")) imgSrc = "assets/product4.jpg";

  let existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1, image: imgSrc });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${name} تمت إضافته للسلة`);
}

// تحديث عدد السلة
function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    count.textContent = totalItems;
  }
}

// عرض السلة
function displayCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return;

  cartItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>${item.price} ر.ع</p>
        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${index})">➖</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">➕</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
    `;
    cartItems.appendChild(div);
  });

  let tax = subtotal * 0.05;
  let shipping = cart.length > 0 ? 2 : 0;
  let total = subtotal + tax + shipping;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("tax").textContent = tax.toFixed(2);
  document.getElementById("shipping").textContent = shipping.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

// زيادة الكمية
function increaseQuantity(index) {
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// تقليل الكمية
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    removeFromCart(index);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// حذف منتج
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayCart();
});
// تسجيل دخول عادي
function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;

  localStorage.setItem("loggedIn", true);
  localStorage.setItem("userEmail", email);

  alert("تم تسجيل الدخول بنجاح 🎉");
  sendEmail(email); // إرسال رسالة
  window.location.href = "index.html";
}

// تسجيل دخول بجوجل أو مايكروسوفت
function socialLogin(provider) {
  let email = provider.toLowerCase() + "@example.com"; // هنا المفروض يجي من API حقيقية
  localStorage.setItem("loggedIn", true);
  localStorage.setItem("userEmail", email);

  alert(`تم تسجيل الدخول عبر ${provider} ✅`);
  sendEmail(email); // إرسال رسالة
  window.location.href = "index.html";
}

// إرسال رسالة إيميل باستخدام EmailJS
function sendEmail(userEmail) {
  (function(){
    emailjs.init("YOUR_PUBLIC_KEY"); // 🔑 استبدل بمفتاحك من EmailJS
  })();

  const templateParams = {
    to_email: userEmail,
    message: "شكرًا لتسجيل الدخول في ZERO_STORE ❤️"
  };

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    .then(() => {
      console.log("تم إرسال الإيميل ✅");
    }, (error) => {
      console.error("فشل الإرسال ❌", error);
    });
}
