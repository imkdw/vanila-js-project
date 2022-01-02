import { app } from './firebase.js';
import { getDatabase, ref, set, push, child, get, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";


async function insertUser(uid, email) {
  const db = getDatabase();
  const registerDate = new Date().toISOString('ko').slice(0, 10);
  await set(ref(db, `users/${uid}`), {
    email: email,
    uid: uid,
    registerDate: registerDate,
  });
}

async function insertNote(subject, content, loginUser) {
  const db = getDatabase();
  const writeDate = new Date().toISOString('ko').slice(0, 10);
  const newPostKey = push(ref(db, 'notes/')).key;
  await set(ref(db, `notes/${loginUser}/${newPostKey}`), {
    subject: subject,
    content: content,
    writeUser: loginUser,
    writeDate: writeDate,
    noteIndex: newPostKey,
  });
}

async function selectNotes(loginUser) {
  const dbRef = ref(getDatabase());
  try {
    const notes = await get(child(dbRef, `notes/${loginUser}`));
    if (notes.exists()) {
      return notes.val();
    } else {
      return;
    }
  } catch (error) {
    console.error(error.code, error.message);
  }
}

async function selectNoteContent(postKey, loginUser) {
  const dbRef = ref(getDatabase());
  try {
    const content = await get(child(dbRef, `notes/${loginUser}/${postKey}`));
    if (content.exists()) {
      return content.val();
    } else {
      return;
    }
  } catch (error) {
    console.error(error.code, error.message);
  }
}

async function updateNote(postKey, loginUser, subject, content) {
  const db = getDatabase();
  try {
    await update(ref(db, `notes/${loginUser}/${postKey}`), {
      subject: subject,
      content: content,
    });
  } catch (error) {
    console.error(error.code, error.message);
  }

}

async function deleteNote(postKey, loginUser) {
  const db = getDatabase();
  try {
    await remove(ref(db, `notes/${loginUser}/${postKey}`));
  } catch (error) {
    console.error(error.code, error.message);
  }
}


export {
  insertUser, insertNote,
  selectNotes, selectNoteContent,
  updateNote, deleteNote,
}