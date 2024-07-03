const container = document.querySelector('.container');
const form = document.getElementById('posts');
const apiUrl = 'https://jsonplaceholder.typicode.com';

function getPost(postNumber) {
    fetch(`${apiUrl}/posts/${postNumber}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Error: " + response.status);
        })
        .then((post) => {
            const postContainer = document.querySelector('.post');
            const commentsContainer = document.querySelector('.comments');
            if (commentsContainer) {
                container.removeChild(commentsContainer);
            }
            postContainer.innerHTML = `
                <h2 class="post__title">${post.title}</h2>
                <p class="post__description">${post.body}</p>
                <p class="post__id">PostID: ${post.id}</p>
                <button id="btnComments" onclick="getComments(${post.id})">Get comments</button>
            `;
        })
        .catch((error) => {
            console.error(error);
            container.innerHTML = `
            <p>Something going wrong!</p>
            `
        });
}

function getComments(postId) {
    fetch(`${apiUrl}/comments?postId=${postId}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Error: " + response.status);
        })
        .then((comments) => {
            const commentsContainer = document.querySelector('.comments');
            if (commentsContainer) {
                container.removeChild(commentsContainer);
            }
            const commentsContainerReload = document.createElement('div');
            commentsContainerReload.classList.add('comments');
            commentsContainerReload.innerHTML = comments.map((comment) => `
            <div class="comments__item">
                <h3 class="comments__title">${comment.name}</h3>
                <p class="comments__description">${comment.body}</p>
                <p class="comments__email"><b>${comment.email}</b></p>
            </div>`).join('');
            container.appendChild(commentsContainerReload);
            document.querySelector('.post').removeChild(document.getElementById('btnComments'));
        })
        .catch((error) => {
            console.error(error); 
            container.innerHTML = `
            <p>Something going wrong!</p>
            `
        });
}

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    getPost(data.postNumber);
});
