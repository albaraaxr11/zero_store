let cart = JSON.parse(localStorage.getItem("cart")) || [];

// تحديث عدد السلة
function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

// إضافة للسلة
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    let product = button.parentElement;
    let name = product.getAttribute("data-name");
    let price = parseFloat(product.getAttribute("data-price"));

    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`✅ تمت إضافة ${name} (${price} ريال) إلى السلة`);
  });
});

// بحث بسيط
document.getElementById("search").addEventListener("input", function() {
  let query = this.value.toLowerCase();
  document.querySelectorAll(".product").forEach(product => {
    let name = product.getAttribute("data-name").toLowerCase();
    product.style.display = name.includes(query) ? "block" : "none";
  });
});

// تحديث السلة عند تحميل الصفحة
updateCartCount();
