import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBsETWsBArKMgIshOEXG6Hyrd_VHdOHEWs",
  authDomain: "student-volunteering-glaucoma.firebaseapp.com",
  projectId: "student-volunteering-glaucoma",
  storageBucket: "student-volunteering-glaucoma.firebasestorage.app",
  messagingSenderId: "732950565694",
  appId: "1:732950565694:web:09f0c108bfecfa9370d26f"
}

const app = initializeApp(firebaseConfig)

export const auth =getAuth(app)
export const db = getFirestore(app)
export const storage= getStorage(app)
// Firebase configuration and service initialisation this connects the app to the Firebase project
