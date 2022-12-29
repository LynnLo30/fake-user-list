const BASE_URL = "https://user-list.alphacamp.io/";
const INDEX_URL = BASE_URL + "api/v1/users/";
const USER_PER_PAGE = 15;

const userList = document.querySelector("#user-list");
const paginator = document.querySelector("#paginator");

const users = JSON.parse(localStorage.getItem("bestFriends")) || [];

function renderUserList(data) {
  let cardHTML = "";

  data.forEach((user) => {
    cardHTML += `<div class="col">
                    <div class="card mt-3" style="width: 13rem;">
                        <img src="${user.avatar}" class="card-img-top user-avatar" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${user.id}" alt="user-avatar">
                        <h5 class="card-title my-2">${user.name} ${user.surname}</h5>
                        <button type="button" class="btn btn-outline-secondary btn-remove-favorite" data-id="${user.id}"><i class="fa-solid fa-heart-crack"></i></button>
                    </div>
                </div>`;
  });

  userList.innerHTML = cardHTML;
}

function renderPaginator(amount) {
  const totalPages = Math.ceil(amount / USER_PER_PAGE);
  let htmlContent = "";

  for (page = 1; page <= totalPages; page++) {
    htmlContent += `<li class="page-item"><a class="page-link text-dark" href="#" data-page="${page}">${page}</a></li>`;
  }

  paginator.innerHTML = htmlContent;
}

function getUserByPage(page) {
  const startIndex = (page - 1) * USER_PER_PAGE;

  return users.slice(startIndex, startIndex + USER_PER_PAGE);
}

function removeFromFavorite(id) {
  if (!users || !users.length) return;
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return;

  users.splice(userIndex, 1);
  localStorage.setItem("bestFriends", JSON.stringify(users));

  renderUserList(users);
  renderUserList(getUserByPage());
}

function showUserModal(id) {
  const userName = document.querySelector("#user-modal-title");
  const userImg = document.querySelector("#user-modal-image");
  const userGender = document.querySelector("#user-modal-gender");
  const userBirthday = document.querySelector("#user-modal-birthday");
  const userEmail = document.querySelector("#user-modal-email");

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;
      userName.innerText = `${data.name} ${data.surname}`;
      userImg.src = data.avatar;
      userGender.innerText = data.gender;
      userBirthday.innerText = data.birthday;
      userEmail.innerText = data.email;
    })
    .catch((err) => console.log(err));
}

// ----- Listeners

userList.addEventListener("click", function onListEvent(event) {
  const target = event.target;

  if (target.matches(".user-avatar")) {
    showUserModal(Number(target.dataset.id));
  } else if (target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(target.dataset.id));
  }
});

paginator.addEventListener("click", function onPaginatorEvent(event) {
  const currentPage = event.target.dataset.page;
  renderUserList(getUserByPage(currentPage));
});

renderUserList(getUserByPage(1));
renderPaginator(users.length);
