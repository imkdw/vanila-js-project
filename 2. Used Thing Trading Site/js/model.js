import { app } from './firebase.js';
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

async function insertUser(uid, email) {
  const db = getDatabase();
  const registerDate = new Date().toISOString('ko').slice(0, 10);
  await set(ref(db, `users/${uid}`), {
    email: email,
    uid: uid,
    registerDate: registerDate,
  });
}

export {
  insertUser,
}