function categoryEvent(event) {
  console.log('ㅎㅇ');
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

const navCategory = document.querySelector('.nav__category');
navCategory.addEventListener('click', categoryEvent);