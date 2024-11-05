// Firebase configuration (replace with your actual Firebase project credentials)
const firebaseConfig = {
    apiKey: "AIzaSyByFH54oWDK491C7qFMyNcPTd6yks9yC5U",
    authDomain: "chatfr-4282d.firebaseapp.com",
    projectId: "chatfr-4282d",
    storageBucket: "chatfr-4282d.appspot.com",
    messagingSenderId: "195745084285",
    appId: "1:195745084285:web:fbbb80a937a7fd62ef9214",
    measurementId: "G-JSGCSS8C23"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Authentication functions
function registerUser(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("User registered:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error registering user:", error.message);
        });
}

function loginUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
        });
}

function logoutUser() {
    auth.signOut()
        .then(() => {
            console.log("User logged out");
        })
        .catch((error) => {
            console.error("Error logging out:", error.message);
        });
}

// Firestore function to add a message to the global chat
function sendMessage(message) {
    db.collection("messages").add({
        content: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Message sent");
    })
    .catch((error) => {
        console.error("Error sending message:", error.message);
    });
}

// Real-time listener to display new messages
function listenToMessages() {
    db.collection("messages").orderBy("timestamp").onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
            console.log("Message:", doc.data());
            // Here you can display messages on the page
        });
    });
}
