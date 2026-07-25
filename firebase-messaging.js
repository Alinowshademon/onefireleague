import { app } from "./firebase.js";

import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BAYHBWelMYyvCPrsOfsC9yltX9lVXUhm1rv8ALyLcw-c8llHS1udvYwxuIUzblkkJR6RTA1uH0Vqfmd77MguoHI"
    });

    console.log("FCM Token:", token);

    return token;
  } else {
    console.log("Notification permission denied.");
    return null;
  }
}

onMessage(messaging, (payload) => {
  console.log("Message received:", payload);

  alert(payload.notification.title + "\n" + payload.notification.body);
});