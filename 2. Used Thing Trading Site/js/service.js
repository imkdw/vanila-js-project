import { app } from './firebase.js';

import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
  insertUser,
} from './model.js';

function alertError(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      alert('이미 존재하는 이메일 입니다.');
      break;

    case 'auth/wrong-password':
      alert('패스워드가 올바르지 않습니다.');
      return 'auth/wrong-password';

    case 'auth/user-not-found':
      alert('사용자를 찾을 수 없습니다.');
      break;

    case 'auth/too-many-requests':
      alert('로그인 요청이 많습니다. 잠시후 다시 시도해주세요.');
      break;
  }
}

function getLoginUser() {
  return sessionStorage.getItem('uid');
}

function getQueryString(id) {
  return new URLSearchParams(location.search).get(id);
}

function checkEmail(email) {
  const regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  if (email === '' || !regExp.test(email)) {
    return;
  }

  return true;
}

function checkPassword(password) {
  if (password.length < 6) {
    return;
  }

  return true;
}

function checkSamePassword(password, rePassword) {
  if (password !== rePassword) {
    return;
  }

  return true;
}

function checkLogined() {
  const loginUser = getLoginUser();
  if (loginUser !== null) {
    location.href = '../html/main.html';
  }
}

async function doRegister(email, password) {
  const auth = getAuth();
  try {
    const userCrendential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCrendential.user;
    console.log(`${user.email} 회원가입 성공`);
    await insertUser(user.uid, user.email);
    alert(`회원가입이 완료되었습니다. 메인페이지로 이동합니다.`);
    sessionStorage.setItem('uid', user.uid);
    location.href = '../html/login.html';
  } catch (error) {
    console.log(error);
    alertError(error.code);
  }
}

function doLogin(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      alert(`환영합니다! ${user.email}님`);
      sessionStorage.setItem('uid', user.uid);
      location.href = '../html/main.html'
    })
    .catch(error => {
      console.log(error.code);
      alertError(error.code);
    });
}

function findPassword(email) {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('비밀번호 초기화 링크를 발송했습니다. 최대 5분까지 소요될 수 있습니다,');
    })
    .catch(error => {
      console.log(error.code, error.message);
    });
}

function showUserInfo() {
  const loginUser = getLoginUser();
  const linkWrapper = document.querySelector('.link-wrapper');
  const profileWrapper = document.querySelector('.profile-wrapper');
  const DISABLED_CLASS = 'disabled';

  if (loginUser) {
    linkWrapper.classList.add(DISABLED_CLASS);
    profileWrapper.classList.remove(DISABLED_CLASS);
  }
}

function doLogout() {
  const loginUser = getLoginUser();
  if (loginUser) {
    sessionStorage.removeItem('uid');
    location.href = '../html/main.html';
  }
}

function moveSellThingPage() {
  const loginUser = getLoginUser();
  if (!loginUser) {
    alert('로그인이 필요합니다.');
    location.href = '../html/login.html';
    return;
  } else {
    location.href = '../html/upload-thing.html';
  }
}

export {
  checkEmail, checkPassword, checkSamePassword,
  doRegister, doLogin, checkLogined, findPassword,
  showUserInfo, doLogout, moveSellThingPage
};