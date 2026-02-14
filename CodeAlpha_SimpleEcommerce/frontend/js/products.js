const productsContainer = document.getElementById("productsContainer");

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5000/api/products");
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function displayProducts(products) {
  productsContainer.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="viewDetails('${product._id}')">View Details</button>
      <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">
        Add to Cart
      </button>
    </div>
  `).join("");
}

function viewDetails(id) {
  window.location.href = `product.html?id=${id}`;
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

fetchProducts();
