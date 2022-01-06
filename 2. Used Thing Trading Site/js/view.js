import {
  checkEmail, checkPassword, checkSamePassword, doRegister,
  doLogin, checkLogined, findPassword, showUserInfo,
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

function init() {
  const sellThingBtn = document.querySelector('.sell-thing-btn');
  if (sellThingBtn) showUserInfo();

  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) {
    checkLogined();
    loginBtn.addEventListener('click', login);
  }

  const registerBtn = document.querySelector('.register-btn');
  if (registerBtn) registerBtn.addEventListener('click', register);

  const sendLinkBtn = document.querySelector('.send-link-btn');
  if (sendLinkBtn) sendLinkBtn.addEventListener('click', resetPassword);
}

init();