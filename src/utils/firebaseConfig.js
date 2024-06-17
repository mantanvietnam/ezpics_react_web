import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDyvLb9gRpmlvL7pWOJqFiE0UBCRXoYvDg",
  authDomain: "ezpics-aba5e.firebaseapp.com",
  projectId: "ezpics-aba5e",
  storageBucket: "ezpics-aba5e.appspot.com",
  messagingSenderId: "77640633082",
  appId: "1:77640633082:web:58464ed36d06e8902f9743",
  measurementId: "G-M8JBYZBEXL",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, app as default };
