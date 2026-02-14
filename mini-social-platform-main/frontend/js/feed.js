async function loadPosts() {
  const posts = await apiRequest("/posts");

  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";

// Redirect if not logged in
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}




  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${post.user.username}</strong>
      <p>${post.content}</p>
      <small>${post.likes.length} likes</small>
      <br>
      <button onclick="likePost('${post._id}')">Like</button>
    `;
    postsContainer.appendChild(div);
  });
}

async function createPost() {
  const content = document.getElementById("postContent").value;

  await apiRequest("/posts", "POST", { content });

  document.getElementById("postContent").value = "";
  loadPosts();
}

async function likePost(id) {
  await apiRequest(`/posts/${id}/like`, "PUT");
  loadPosts();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}


loadPosts();
