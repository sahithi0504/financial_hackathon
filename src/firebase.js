import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDPnwAmpRumQBnsrrt82zX7c8ZS09tis5E",
    authDomain: "financial-hackathon-8e950.firebaseapp.com",
    projectId: "financial-hackathon-8e950",
    storageBucket: "financial-hackathon-8e950.firebasestorage.app",
    messagingSenderId: "335038403038",
    appId: "1:335038403038:web:6d4041977ae6fb1c23cd4f"
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app)
  export const googleProvider = new GoogleAuthProvider();
