// Import Firebase functions from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html"; // Redirect to login if not authenticated
    }
});

// Registration logic
if (document.getElementById("register-btn")) {
    document.getElementById("register-btn").addEventListener("click", async () => {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await userCredential.user.updateProfile({ displayName: username });
            alert("Registration successful! You can now log in.");
            window.location.href = "login.html"; // Redirect to login page
        } catch (error) {
            console.error("Error registering:", error);
            alert(error.message);
        }
    });
}

// Login logic
if (document.getElementById("login-btn")) {
    document.getElementById("login-btn").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "chat.html"; // Redirect to chat page
        } catch (error) {
            console.error("Error logging in:", error);
            alert(error.message);
        }
    });
}

// Chat logic
if (document.getElementById("chat-container")) {
    const messagesRef = collection(db, "messages");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const messagesContainer = document.getElementById("messages");

    sendBtn.addEventListener("click", async () => {
        sendMessage();
    });

    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = messageInput.value.trim();
        const user = auth.currentUser;

        if (message && user) {
            await addDoc(messagesRef, {
                text: message,
                username: user.displayName,
                timestamp: serverTimestamp(),
                uid: user.uid
            });
            messageInput.value = ""; // Clear input
        }
    }

    const q = query(messagesRef, orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
        messagesContainer.innerHTML = ""; // Clear existing messages
        snapshot.forEach((doc) => {
            const message = document.createElement("div");
            message.textContent = `${doc.data().username}: ${doc.data().text}`;
            message.classList.add("chat-message");

            // Differentiate messages by user
            if (doc.data().uid === auth.currentUser?.uid) {
                message.classList.add("my-message");
            } else {
                message.classList.add("other-message");
            }

            messagesContainer.appendChild(message);
        });
    });
}