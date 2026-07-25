import { app } from "./firebase.js";

import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

const messaging = getMessaging(app);

export async function requestNotificationPermission() {

  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported.");
    return null;
  }

  // Register service worker
  const registration = await navigator.serviceWorker.register(
    "/onefireleague/firebase-messaging-sw.js"
  );

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Notification permission denied.");
    return null;
  }

  const token = await getToken(messaging, {
    vapidKey: "BAYHBWelMYyvCPrsOfsC9yltX9lVXUhm1rv8ALyLcw-c8llHS1udvYwxuIUzblkkJR6RTA1uH0Vqfmd77MguoHI",
    serviceWorkerRegistration: registration
  });

  console.log("FCM Token:", token);

  return token;
}

onMessage(messaging, (payload) => {
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/onefireleague/icon-192.png"
  });
});