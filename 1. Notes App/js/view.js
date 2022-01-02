import {
  checkEmail, checkPassword, checkSamePassword, doRegister,
  doLogin, checkSubject, checkContent, checkLogined, doSaveNewNote,
  doLoadNotes, doModifyNote, loadNoteContent, searchNotes, googleSocialLogin, findPassword
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

function saveNewNote(event) {
  event.preventDefault();

  const subject = document.querySelector('.note__subject').value;
  const content = document.querySelector('.note__content').value;
  if (checkSubject(subject) && checkContent(content)) {
    doSaveNewNote(subject, content);
  } else {
    alert('제목 또는 내용이 비어있거나 제목이 너무 깁니다.(최대 20자)');
    return;
  }
}

function modifyNote(event) {
  event.preventDefault();

  const subject = document.querySelector('.note__subject').value;
  const content = document.querySelector('.note__content').value;
  if (checkSubject(subject) && checkContent(content)) {
    doModifyNote(subject, content);
  } else {
    alert('제목 또는 내용이 비어있거나 제목이 너무 깁니다.(최대 20자)');
    return;
  }
}

function loadNotes() {
  const loginUser = sessionStorage.getItem('uid');
  doLoadNotes(loginUser);
}

function resetPassword(event) {
  event.preventDefault();
   const email = document.getElementById('email').value;
   if (checkEmail(email)) {
     findPassword(email);
   }
}

function init() {
  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) {
    checkLogined();
    loginBtn.addEventListener('click', login);
  }

  const googleLoginBtn = document.querySelector('.login-with-google');
  if (googleLoginBtn) googleLoginBtn.addEventListener('click', googleSocialLogin);

  const registerBtn = document.querySelector('.register-btn');
  if (registerBtn) registerBtn.addEventListener('click', register);

  const newNoteBtn = document.querySelector('.new-note');
  if (newNoteBtn) loadNotes();

  const saveBtn = document.querySelector('.save');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveNewNote);
  }

  const modifyBtn = document.querySelector('.modify');
  if (modifyBtn) {
    loadNoteContent();
    modifyBtn.addEventListener('click', modifyNote);
  }

  const searchInput = document.querySelector('.search-input');
  if (searchInput) searchInput.addEventListener('keyup', searchNotes);

  const sendLinkBtn = document.querySelector('.send-link-btn');
  if (sendLinkBtn) sendLinkBtn.addEventListener('click', resetPassword);
}

init();