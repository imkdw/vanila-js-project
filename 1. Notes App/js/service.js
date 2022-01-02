import { app } from './firebase.js';
import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  insertUser, insertNote, selectNotes,
  selectNoteContent, updateNote, deleteNote
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

function checkSubject(subject) {
  if (subject.length > 20 || subject === '') {
    return;
  }

  return true;
}

function checkContent(content) {
  if (content === '') {
    return;
  }

  return true;
}

function checkLogined() {
  const loginUser = sessionStorage.getItem('uid');
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
    alert(`회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.`);
    sessionStorage.setItem('uid', user.uid);
    location.href = '../html/login.html';
  } catch (error) {
    console.log(error.code);
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

async function doSaveNewNote(subject, content) {
  const loginUser = sessionStorage.getItem('uid');
  await insertNote(subject, content, loginUser);
  alert('노트 작성이 완료되었습니다.');
  location.href = '../html/main.html';
}

async function doLoadNotes(loginUser) {
  if (loginUser === null) {
    alert('비정상적인 접근입니다. 로그인 화면으로 이동합니다.');
    location.href = '../html/login.html';
    return;
  }

  const docFrag = document.createDocumentFragment();
  const notes = await selectNotes(loginUser);
  const notesElem = document.querySelector('.notes');

  // 노트가 있는 경우
  if (notes) {
    for (let note in notes) {
      const li = createNoteElem(note, notes);
      docFrag.appendChild(li);
    }

    notesElem.appendChild(docFrag);
  } else {
    const div = document.createElement('div');
    const notesWrapper = document.querySelector('.notes-wrapper');
    div.textContent = '노트가 없습니다. 노트를 작성해주세요.';
    div.classList.add('no-note');
    notesWrapper.appendChild(div);
  }

  addNoteInfoLink()
}

function addNoteInfoLink() {
  const noteSubjects = document.querySelectorAll('.note__subject');
  [...noteSubjects].forEach(subject => {
    const noteWrapper = subject.parentNode;
    const postKey = noteWrapper.querySelector('.post-key').textContent;
    subject.setAttribute('href', `./modify-note.html?note=${postKey}`);
  });
}

async function deleteBtnEvent(event) {
  const btn = event.currentTarget;
  const noteWrapper = btn.parentNode;
  const postKey = noteWrapper.querySelector('.post-key').textContent;
  const loginUser = sessionStorage.getItem('uid');
  await deleteNote(postKey, loginUser);
  alert('삭제가 완료되었습니다.');
  location.href = '../html/main.html';
}

async function loadNoteContent(modifyBtn) {
  const postKey = getQueryString('note');
  const loginUser = sessionStorage.getItem('uid');
  const content = await selectNoteContent(postKey, loginUser);

  const noteSubject = document.querySelector('.note__subject');
  noteSubject.value = content.subject;

  const noteContent = document.querySelector('.note__content');
  noteContent.textContent = content.content;
}

async function doModifyNote() {
  const noteSubject = document.querySelector('.note__subject').value;
  const noteContent = document.querySelector('.note__content').value;
  const postKey = getQueryString('note');
  const uid = sessionStorage.getItem('uid');
  await updateNote(postKey, uid, noteSubject, noteContent);
  alert('수정이 완료되었습니다.');
  location.href = '../html/main.html';
}

function createNoteElem(note, notes) {
  const noteElem = document.createElement('li');
  noteElem.classList.add('note')

  const noteWrapper = document.createElement('div');
  noteWrapper.classList.add('note-wrapper');

  const noteSubject = document.createElement('a');
  noteSubject.classList.add('note__subject');
  noteSubject.textContent = notes[note].subject;
  noteSubject.setAttribute('href', '#');

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-trash', 'trash-icon');
  deleteIcon.addEventListener('click', deleteBtnEvent);

  const noteContent = document.createElement('div');
  noteContent.classList.add('note__content');
  noteContent.textContent = notes[note].content;

  const writeDateWrapper = document.createElement('div');
  writeDateWrapper.classList.add('write-date-wrapper');
  writeDateWrapper.textContent = '작성일 : ';

  const writeDate = document.createElement('span');
  writeDate.classList.add('write-date');
  writeDate.textContent = notes[note].writeDate;

  const postKey = document.createElement('div');
  postKey.classList.add('post-key', 'disabled');
  postKey.textContent = notes[note].noteIndex;

  writeDateWrapper.appendChild(writeDate);

  const noteWrapperChild = [noteSubject, deleteIcon, noteContent, writeDateWrapper, postKey]
  noteWrapperChild.forEach(child => noteWrapper.appendChild(child));

  noteElem.appendChild(noteWrapper);

  return noteElem;
}

function searchNotes(event) {
  const nowValue = event.currentTarget.value;
  const noteSubjects = document.querySelectorAll('.note__subject');
  [...noteSubjects].forEach(subject => {
    const noteWrapper = subject.parentNode;
    const note = noteWrapper.parentNode;
    if (subject.textContent.indexOf(nowValue)) {
      note.classList.add('disabled');
    } else {
      note.classList.remove('disabled');
    }
  })
}

function googleSocialLogin() {
  alert('준비중인 기능입니다.');
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

export {
  checkEmail, checkPassword, checkSamePassword, checkSubject, checkContent,
  doRegister, doLogin, doSaveNewNote, doLoadNotes, doModifyNote,
  checkLogined, loadNoteContent, searchNotes,
  googleSocialLogin, findPassword
};