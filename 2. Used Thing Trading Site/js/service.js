import { app } from './firebase.js';

import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

import { getDatabase, push, ref as dbRef } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
  insertPost, insertUser, selectPosts, selectPost
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

function getPostId() {
  return sessionStorage.getItem('postId');
}

function getNowHtml() {
  const nowLocation = location.href.split('/');
  const nowHtml = nowLocation[nowLocation.length - 1];

  return nowHtml;
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

function checkUploadImageBox(uploadImageBox) {
  const imageText = uploadImageBox.src.split('/');
  if (imageText[imageText.length - 1] === 'upload-box.png') {
    alert('이미지는 1개 이상 등록해주세요.');
    return;
  }

  return true;
}

function checkSubject(subject) {
  // 제목은 최대 20자
  if (subject.length > 21 || subject === '') {
    alert('제목이 너무 길거나 짧습니다. (최대 20자)');
    return;
  }

  return true;
}

function checkCategory(category) {
  const catIndex = category.options.selectedIndex;
  if (catIndex === 0) {
    alert('카테고리를 선택해주세요.');
    return;
  }

  return true;
}

function checkContent(content) {
  if (content === '') {
    alert('내용은 필수 입력 사항입니다.');
    return;
  }

  return true;
}

function checkPrice(price) {
  const priceNumber = Number(price);
  if (Number.isNaN(priceNumber)) {
    alert('가격은 숫자만 입력해주세요.');
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
    const db = getDatabase();
    const postId = push(dbRef(db, 'notes/')).key;
    sessionStorage.setItem('postId', postId);
    location.href = '../html/upload-thing.html';
  }
}

function clickUpload() {
  const uploadBoxes = document.querySelectorAll('.picture-upload-box');
  [...uploadBoxes].forEach(box => {
    box.addEventListener('click', () => realUpload.click());
  });

  const realUpload = document.querySelector('.real-upload');
  realUpload.addEventListener('change', uploadImage);
}

function uploadImage(event) {
  const files = event.currentTarget.files;
  const uploadBoxImages = document.querySelectorAll('.upload-box-image');

  // 업로드 파일 갯수 체크
  if ([...files].length >= 7) {
    alert('이미지는 6장까지 업로드가 가능합니다.');
    return;
  }

  const uploadFiles = [];
  [...files].forEach(file => {
    if (!file.type.match("image/*.")) {
      alert('이미지 파일만 업로드가 가능합니다.');
      return;
    }
    uploadFiles.push(file);
  });

  uploadFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = e.target.result
      uploadBoxImages[index].src = image
      uploadImageToStorage(file, index);
    }
    reader.readAsDataURL(file);
  });
}

async function uploadImageToStorage(file, index) {
  const storage = getStorage();
  const postId = getPostId();
  const storageRef = ref(storage, `${postId}/${file.name}`);
  saveFileNameInSessionStorage(file.name, index);

  await uploadBytes(storageRef, file);
}

function saveFileNameInSessionStorage(fileName, index) {
  const FILE_NAMES_KEY = 'fileNames';
  if (sessionStorage.getItem(FILE_NAMES_KEY)) {
    const existsFileNames = JSON.parse(sessionStorage.getItem(FILE_NAMES_KEY));
    existsFileNames[index] = fileName;
    sessionStorage.setItem(FILE_NAMES_KEY, JSON.stringify(existsFileNames));
  } else {
    sessionStorage.setItem(FILE_NAMES_KEY, JSON.stringify({ [index]: fileName }));
  }
}

async function doUploadPosts(subjectInput, categorySelect, contentInput, priceInput) {
  const postId = getPostId();
  const category = getCategoryText(categorySelect);
  const writer = sessionStorage.getItem('uid');
  const fileNames = JSON.parse(sessionStorage.getItem('fileNames'));
  const imageLinks = [];

  const storage = getStorage();
  for (const fileName in fileNames) {
    try {
      const url = await getDownloadURL(ref(storage, `${postId}/${fileNames[fileName]}`));

      imageLinks.push(url);
    } catch (e) {
      console.error(e);
    }
  }

  await insertPost(imageLinks, subjectInput, category, contentInput, priceInput, postId, writer);

  alert('상품 등록이 완료되었습니다.');
  location.href = '../html/main.html';
}

function getCategoryText(categorySelect) {
  const categoryIndex = categorySelect.options.selectedIndex;
  const categoryText = categorySelect.options[categoryIndex].value;

  return categoryText;
}

async function cancelPost() {
  const postId = getPostId();
  await removeImage(postId);
  sessionStorage.removeItem('fileNames');
  sessionStorage.removeItem('postId');
  location.href = '../html/main.html';
}

async function removeImage(postId) {
  const storage = getStorage();
  const fileNames = JSON.parse(sessionStorage.getItem('fileNames'));
  console.log(fileNames);
  for (const fileName in fileNames) {
    const desertRef = ref(storage, `${postId}/${fileNames[fileName]}`);
    try {
      await deleteObject(desertRef);
    } catch (e) {
      alert(e);
    }
  }
}

function resetStorage() {
  // upload-thing.html을 제외한 다른 html 파일에서는 세션스토리지를 초기화
  const nowHtml = getNowHtml();

  if (nowHtml !== 'upload-thing.html') {
    sessionStorage.removeItem('fileNames');
    sessionStorage.removeItem('postId');
  }

  return;
}

async function loadPosts() {
  const nowHtml = getNowHtml();
  if (nowHtml === 'main.html') {
    const posts = await selectPosts();
    const usedThingLists = document.querySelector('.used-thing-lists');
    const docFrag = document.createDocumentFragment();

    for (const post in posts) {
      const postData = posts[post];
      const li = createThingElement(postData.imageLinks[0], postData.subject, postData.price, postData.postId);
      docFrag.appendChild(li);
    }
    usedThingLists.appendChild(docFrag);
  }
}

function createThingElement(imageSrc, subject, price, postId) {
  const thing = document.createElement('li');
  thing.classList.add('thing');

  const thumbnail = document.createElement('img');
  thumbnail.src = imageSrc;
  thumbnail.classList.add('thing-image');

  const thingInfo = document.createElement('div');
  thingInfo.classList.add('thing-info');

  const thingSubject = document.createElement('div');
  thingSubject.classList.add('thing-subject');
  thingSubject.textContent = subject;

  const thingPrice = document.createElement('div');
  thingPrice.classList.add('thing-price');
  thingPrice.textContent = price;

  const span = document.createElement('span');
  span.textContent = '원';

  const postIdDiv = document.createElement('div');
  postIdDiv.classList.add('post-id', 'disabled');
  postIdDiv.textContent = postId;


  thingPrice.appendChild(span);

  thingInfo.appendChild(thingSubject);
  thingInfo.appendChild(thingPrice);

  thing.appendChild(thumbnail);
  thing.appendChild(thingInfo);
  thing.appendChild(postIdDiv);

  thing.addEventListener('click', () => {
    const postId = thing.querySelector('.post-id');
    location.href = `../html/info-thing.html?id=${postId.textContent}`;
  });

  return thing;
}

async function loadThingInfo() {
  const postId = getQueryString('id');

  if (!postId) {
    return;
  }

  const thingData = await selectPost(postId);

  const descSubject = document.querySelector('.desc-subject');
  descSubject.textContent = thingData.subject;

  const descPrice = document.querySelector('.desc-price');
  descPrice.textContent = thingData.price + '원';

  const writeDate = document.querySelector('.write-date');
  writeDate.textContent = thingData.writeDate;

  const thingImages = thingData.imageLinks;
  const pictureList = document.querySelectorAll('.picture-item-image');
  [...thingImages].forEach((image, index) => {
    pictureList[index].src = image;
  });

  const thumbnail = document.querySelector('.picture-thumbnail');
  thumbnail.src = thingImages[thingImages.length - 1];

  const contentText = document.querySelector('.content-text');
  contentText.textContent = thingData.content;
}

resetStorage();
loadPosts();
loadThingInfo();

export {
  checkEmail, checkPassword, checkSamePassword,
  doRegister, doLogin, checkLogined, findPassword,
  showUserInfo, doLogout, moveSellThingPage, clickUpload,
  checkUploadImageBox, checkSubject, checkCategory, checkContent,
  checkPrice, doUploadPosts, cancelPost
};