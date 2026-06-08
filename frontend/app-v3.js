const API = "https://dkk95jncs305s.cloudfront.net";

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

function updateAuthUI() {
  const token = getToken();
  const user = getUser();

  const loggedOutBox = document.getElementById("loggedOutBox");
  const loggedInBox = document.getElementById("loggedInBox");
  const currentUserName = document.getElementById("currentUserName");
  const appContent = document.getElementById("appContent");

  if (token && user) {
    loggedOutBox.classList.add("hidden");
    loggedInBox.classList.remove("hidden");
    appContent.classList.remove("hidden");
    currentUserName.innerText = user.username;
  } else {
    loggedOutBox.classList.remove("hidden");
    loggedInBox.classList.add("hidden");
    appContent.classList.add("hidden");
    currentUserName.innerText = "";
  }
}

async function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (!username || !email || !password) {
    alert("Completá usuario, email y contraseña");
    return;
  }

  try {
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    alert("Usuario creado correctamente. Ahora iniciá sesión.");

    document.getElementById("registerUsername").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";
  } catch (err) {
    console.error("ERROR registrando usuario:", err);
    alert(err.message || "Error registrando usuario");
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Completá email y contraseña");
    return;
  }

  try {
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    updateAuthUI();

    await loadPosts();

    alert("Sesión iniciada correctamente");
  } catch (err) {
    console.error("ERROR iniciando sesión:", err);
    alert(err.message || "Error iniciando sesión");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  updateAuthUI();

  const postsContainer = document.getElementById("posts");

  if (postsContainer) {
    postsContainer.innerHTML = "";
  }

  alert("Sesión cerrada");
}

async function upload() {
  try {
    const token = getToken();

    if (!token) {
      alert("Tenés que iniciar sesión para subir una imagen");
      return;
    }

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("Seleccioná una imagen primero");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(API + "/posts/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    fileInput.value = "";
    document.getElementById("preview").innerHTML = "";

    await loadPosts();

    showGhostSuccess();
  } catch (err) {
    console.error("ERROR:", err);
    alert(err.message || "Error al subir la imagen");
  }
}

async function deletePost(postId) {
  const confirmDelete = confirm("¿Querés eliminar esta foto?");

  if (!confirmDelete) {
    return;
  }

  try {
    const token = getToken();

    const res = await fetch(API + "/posts/" + postId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    await loadPosts();
  } catch (err) {
    console.error("ERROR eliminando post:", err);
    alert(err.message || "Error al eliminar la foto");
  }
}

async function likePost(postId) {
  try {
    const res = await fetch(API + "/posts/" + postId + "/like", {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Error dando like");
    }

    await loadPosts();
  } catch (err) {
    console.error("ERROR dando like:", err);
  }
}

async function dislikePost(postId) {
  try {
    const res = await fetch(API + "/posts/" + postId + "/dislike", {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Error dando dislike");
    }

    await loadPosts();
  } catch (err) {
    console.error("ERROR dando dislike:", err);
  }
}

async function addComment(postId) {
  const input = document.getElementById("comment-input-" + postId);

  if (!input) return;

  const commentText = input.value.trim();

  if (commentText === "") {
    alert("Escribí un comentario primero");
    return;
  }

 try {
  const token = localStorage.getItem("token");

  const res = await fetch(API + "/posts/" + postId + "/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      comment_text: commentText,
    }),
  });

    if (!res.ok) {
      throw new Error("Error agregando comentario");
    }

    input.value = "";

    await loadPosts();
  } catch (err) {
    console.error("ERROR agregando comentario:", err);
    alert("Error al comentar");
  }
}

async function deleteComment(postId, commentId) {
  const confirmDelete = confirm("¿Querés eliminar este comentario?");

  if (!confirmDelete) {
    return;
  }

  try {
    const token = getToken();

    const res = await fetch(API + "/posts/" + postId + "/comments/" + commentId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    await loadPosts();
  } catch (err) {
    console.error("ERROR eliminando comentario:", err);
    alert(err.message || "Error al eliminar comentario");
  }
}

function toggleMenu(postId) {
  const menu = document.getElementById("menu-" + postId);

  if (!menu) return;

  document.querySelectorAll(".post-menu").forEach((item) => {
    if (item.id !== "menu-" + postId) {
      item.classList.remove("show-menu");
    }
  });

  menu.classList.toggle("show-menu");
}

function showGhostSuccess() {
  const ghostSuccess = document.getElementById("ghostSuccess");

  if (!ghostSuccess) return;

  ghostSuccess.classList.remove("hidden");
  ghostSuccess.classList.remove("show");

  void ghostSuccess.offsetWidth;

  ghostSuccess.classList.add("show");

  setTimeout(() => {
    ghostSuccess.classList.remove("show");
    ghostSuccess.classList.add("hidden");
  }, 3600);
}

function createCommentElement(postId, comment) {
  const commentItem = document.createElement("div");
  commentItem.className = "comment-item";

  const commentText = document.createElement("span");
  commentText.innerText = comment.comment_text;

  const deleteButton = document.createElement("button");
  deleteButton.className = "comment-delete-button";
  deleteButton.innerText = "×";
  deleteButton.onclick = () => deleteComment(postId, comment.id);

  commentItem.appendChild(commentText);
  commentItem.appendChild(deleteButton);

  return commentItem;
}

async function loadPosts() {
  try {
    const token = getToken();

    if (!token) {
      return;
    }

    const res = await fetch(API + "/posts", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!res.ok) {
      throw new Error("Error obteniendo posts");
    }

    const posts = await res.json();

    const postCount = document.getElementById("postCount");

    if (postCount) {
      postCount.innerText = posts.length + " posts";
    }

    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    posts.forEach((post) => {
      const postCard = document.createElement("article");
      postCard.className = "post-card";

      const menuButton = document.createElement("button");
      menuButton.className = "menu-button";
      menuButton.innerText = "⋮";
      menuButton.onclick = () => toggleMenu(post.id);

      const menu = document.createElement("div");
      menu.className = "post-menu";
      menu.id = "menu-" + post.id;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.innerText = "Eliminar publicación";
      deleteButton.onclick = () => deletePost(post.id);

      menu.appendChild(deleteButton);

      const img = document.createElement("img");
      img.src = post.image_url;
      img.alt = "Post";
      img.className = "post-img";

      const actions = document.createElement("div");
      actions.className = "post-actions";

      const likeButton = document.createElement("button");
      likeButton.className = "action-button";
      likeButton.innerText = "👍 " + (post.likes || 0);
      likeButton.onclick = () => likePost(post.id);

      const dislikeButton = document.createElement("button");
      dislikeButton.className = "action-button";
      dislikeButton.innerText = "👎 " + (post.dislikes || 0);
      dislikeButton.onclick = () => dislikePost(post.id);

      actions.appendChild(likeButton);
      actions.appendChild(dislikeButton);

      const commentsBox = document.createElement("div");
      commentsBox.className = "comments-box";

      const commentsTitle = document.createElement("h3");
      commentsTitle.innerText = "Comentarios";

      const commentsList = document.createElement("div");
      commentsList.className = "comments-list";

      const comments = post.comments || [];

      if (comments.length === 0) {
        const emptyComment = document.createElement("p");
        emptyComment.className = "empty-comments";
        emptyComment.innerText = "Todavía no hay comentarios.";
        commentsList.appendChild(emptyComment);
      } else {
        comments.forEach((comment) => {
          commentsList.appendChild(createCommentElement(post.id, comment));
        });
      }

      const commentForm = document.createElement("div");
      commentForm.className = "comment-form";

      const commentInput = document.createElement("input");
      commentInput.type = "text";
      commentInput.placeholder = "Escribí un comentario...";
      commentInput.id = "comment-input-" + post.id;

      const commentButton = document.createElement("button");
      commentButton.innerText = "Comentar";
      commentButton.onclick = () => addComment(post.id);

      commentForm.appendChild(commentInput);
      commentForm.appendChild(commentButton);

      commentsBox.appendChild(commentsTitle);
      commentsBox.appendChild(commentsList);
      commentsBox.appendChild(commentForm);

      postCard.appendChild(menuButton);
      postCard.appendChild(menu);
      postCard.appendChild(img);
      postCard.appendChild(actions);
      postCard.appendChild(commentsBox);

      postsContainer.appendChild(postCard);
    });
  } catch (err) {
    console.error("ERROR cargando posts:", err);
  }
}

const fileInputPreview = document.getElementById("fileInput");
const preview = document.getElementById("preview");

if (fileInputPreview) {
  fileInputPreview.addEventListener("change", () => {
    const file = fileInputPreview.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      preview.innerHTML = `<img src="${e.target.result}" class="preview-img">`;
    };

    reader.readAsDataURL(file);
  });
}

document.addEventListener("click", (event) => {
  if (!event.target.classList.contains("menu-button")) {
    document.querySelectorAll(".post-menu").forEach((menu) => {
      menu.classList.remove("show-menu");
    });
  }
});

updateAuthUI();

if (getToken()) {
  loadPosts();
}