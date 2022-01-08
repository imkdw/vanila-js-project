import { doLogout } from './service.js'

function categoryEvent(event) {
  const navCategory = event.currentTarget
  const categoryDownMenu = document.querySelector('.category-down-menu');
  const navCategoryIcon = document.querySelector('.category-menu-icon-wrapper > i');

  categoryDownMenu.classList.toggle('category__active');

  if (categoryDownMenu.classList.contains('category__active')) {
    navCategory.classList.add('nav__category__active');
    navCategoryIcon.classList.remove('fa-chevron-down');
    navCategoryIcon.classList.add('fa-chevron-up');
  } else {
    navCategory.classList.remove('nav__category__active');
    navCategoryIcon.classList.remove('fa-chevron-up');
    navCategoryIcon.classList.add('fa-chevron-down');
  }
}

function addUserMenu() {
  const userUtils = document.querySelector('.user-utils');
  userUtils.classList.toggle('disabled');
  const logoutBtn = document.querySelector('.logout');
  logoutBtn.addEventListener('click', doLogout);
}

const navCategory = document.querySelector('.nav__category');
if (navCategory) navCategory.addEventListener('click', categoryEvent);

const profileInfoName = document.getElementById('profileInfoName');
if (profileInfoName) profileInfoName.addEventListener('click', addUserMenu);
