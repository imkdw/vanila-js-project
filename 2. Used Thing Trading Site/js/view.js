import {
  checkEmail, checkPassword, checkSamePassword, doRegister,
  doLogin, checkLogined, findPassword, showUserInfo, doLogout,
  moveSellThingPage, clickUpload, checkUploadImageBox, checkSubject, checkCategory, checkContent, checkPrice, doUploadPosts
} from './service.js';

function login(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (checkEmail(email) && checkPassword(password)) {
    doLogin(email, password);
  }
  else {
    alert('이메일 또는 패스워드 형식이 잘못되었습니다.');
    return;
  }
}

function register(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rePassword = document.getElementById('rePassword').value;

  if (checkEmail(email) && checkPassword(password)) {
    if (checkSamePassword(password, rePassword)) {
      doRegister(email, password);
    } else {
      alert('패스워드가 동일하지 않습니다.');
      return;
    }
  } else {
    alert('이메일 또는 패스워드 형식이 잘못되었습니다. 패스워드는 최소 6자리 입니다.');
    return;
  }
}

function resetPassword(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  if (checkEmail(email)) {
    findPassword(email);
  }
}

function addThing() {
  const [imageUploadBox, subjectInput, categorySelect, contentInput, priceInput] = [
    document.querySelector('.upload-box-image'),
    document.querySelector('.subject-input'),
    document.querySelector('.select-category'),
    document.querySelector('.content-input'),
    document.querySelector('.price-input')
  ];

  if (checkUploadImageBox(imageUploadBox) &&
    checkSubject(subjectInput.value) &&
    checkCategory(categorySelect) &&
    checkContent(contentInput.value) &&
    checkPrice(priceInput.value)) {
    doUploadPosts();
  }
}

function init() {
  const sellThingBtn = document.querySelector('.sell-thing-btn');
  if (sellThingBtn) {
    showUserInfo();
    sellThingBtn.addEventListener('click', moveSellThingPage);
  }

  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) {
    checkLogined();
    loginBtn.addEventListener('click', login);
  }

  const registerBtn = document.querySelector('.register-btn');
  if (registerBtn) registerBtn.addEventListener('click', register);

  const sendLinkBtn = document.querySelector('.send-link-btn');
  if (sendLinkBtn) sendLinkBtn.addEventListener('click', resetPassword);

  const pictureUploadBox = document.querySelector('.picture-upload-box');
  if (pictureUploadBox) clickUpload();

  const addThingComplete = document.querySelector('.add-thing-complete');
  if (addThingComplete) addThingComplete.addEventListener('click', addThing);
}

init();