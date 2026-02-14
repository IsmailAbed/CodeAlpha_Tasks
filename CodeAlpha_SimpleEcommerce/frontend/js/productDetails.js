const productDetails = document.getElementById("productDetails");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function fetchProduct() {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${productId}`);
    const product = await response.json();

    productDetails.innerHTML = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p><strong>$${product.price}</strong></p>
        <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">
          Add to Cart
        </button>
      </div>
    `;
  } catch (error) {
    console.error(error);
  }
}

function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

fetchProduct();
