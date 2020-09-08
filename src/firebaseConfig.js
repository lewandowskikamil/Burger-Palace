import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/analytics';
import 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyALcB97EFZd2W0rM_X6qGn6jfM9C1EnNrE",
  authDomain: "burger-project-fa445.firebaseapp.com",
  databaseURL: "https://burger-project-fa445.firebaseio.com",
  projectId: "burger-project-fa445",
  storageBucket: "burger-project-fa445.appspot.com",
  messagingSenderId: "135465457605",
  appId: "1:135465457605:web:cc476f32e7c411e7319dac",
  measurementId: "G-LP8GVN2VQB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
// make auth and firestore references
// export const auth = firebase.auth();
// export const db = firebase.firestore();
  // export const functions = firebase.functions();
export default firebase;