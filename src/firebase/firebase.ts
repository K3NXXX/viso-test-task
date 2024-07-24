import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: "viso-test-task-7bf46.firebaseapp.com",
	projectId: "viso-test-task-7bf46",
	storageBucket: "viso-test-task-7bf46.appspot.com",
	messagingSenderId: "1030805398509",
	appId: "1:1030805398509:web:015a03f9c38ce25210bde4"
  };

const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
