
// Firebase Cloud Messaging Service Worker
// This handles background notifications when the app is not active

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  // Replace with your actual Firebase config
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: payload.notification.icon || '/icons/notification.png',
    badge: '/icons/badge.png',
    data: payload.data,
    requireInteraction: payload.data?.type === 'call' || payload.data?.type === 'video',
    actions: payload.data?.type === 'call' ? [
      { action: 'answer', title: 'Answer' },
      { action: 'decline', title: 'Decline' }
    ] : []
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  // Handle deep linking
  if (event.notification.data && event.notification.data.deepLink) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // If app is already open, focus it and navigate
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            client.focus();
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              data: event.notification.data
            });
            return;
          }
        }
        
        // If app is not open, open it
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.deepLink);
        }
      })
    );
  }
});
