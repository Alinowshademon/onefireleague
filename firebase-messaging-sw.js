importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD69ENxn4Y3dLRyanLc1qSCkz3T-W1BZpM",
  authDomain: "ane-fire-league.firebaseapp.com",
  projectId: "ane-fire-league",
  storageBucket: "ane-fire-league.firebasestorage.app",
  messagingSenderId: "272030191931",
  appId: "1:272030191931:web:7235fa87beebaafaee671e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png"
  });
});