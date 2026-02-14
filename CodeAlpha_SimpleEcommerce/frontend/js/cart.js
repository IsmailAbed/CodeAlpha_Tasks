const cartItems = document.getElementById("cartItems");
const totalAmount = document.getElementById("totalAmount");
const checkoutBtn = document.getElementById("checkoutBtn");

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    totalAmount.innerText = "";
    checkoutBtn.style.display = "none";
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart.map(item => {
    total += item.price * item.quantity;

    return `
      <div class="product-card">
        <h3>${item.name}</h3>
        <p>Price: $${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
      </div>
    `;
  }).join("");

  totalAmount.innerText = `Total: $${total.toFixed(2)}`;
}

async function checkout() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) return;

  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        products: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order placed successfully! 🎉");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    } else {
      alert("Error placing order: " + data.message);
    }

  } catch (error) {
    console.error("Checkout error:", error);
  }
}

checkoutBtn.addEventListener("click", checkout);

loadCart();
