function addUserMenu() {
  const userUtils = document.querySelector('.user-utils');
  userUtils.classList.toggle('disabled');
}

const profileInfoName = document.getElementById('profileInfoName');
profileInfoName.addEventListener('click', addUserMenu);