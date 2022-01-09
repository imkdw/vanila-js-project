import { app } from './firebase.js';
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

async function insertUser(uid, email) {
  const db = getDatabase();
  const registerDate = new Date().toISOString('ko').slice(0, 10);
  await set(ref(db, `users/${uid}`), {
    email: email,
    uid: uid,
    registerDate: registerDate,
  });
}

async function insertPost(imageLinks, subject, category, content, price, postId, writer) {
  const db = getDatabase();
  const writeDate = new Date().toISOString('ko').slice(0, 10);
  await set(ref(db, `posts/${postId}`), {
    postId: postId,
    writeDate: writeDate,
    writer: writer,
    subject: subject,
    content: content,
    category: category,
    price: Number(price).toLocaleString('ko-KR'),
    imageLinks: imageLinks,
  });
}

async function selectPosts() {
  const dbRef = ref(getDatabase());
  try {
    const notes = await get(child(dbRef, `posts`));
    if (notes.exists()) {
      return notes.val();
    } else {
      return;
    }
  } catch (error) {
    console.error(error.code, error.message);
  }
}

export {
  insertUser, insertPost, selectPosts
}