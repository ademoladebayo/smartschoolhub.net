// /*
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js"
);
var successSound = new Audio("./asset/sound/verified.mp3");

/*
Initialize the Firebase app in the service worker by passing in the messagingSenderId.
* New configuration for app@pulseservice.com
*/
firebase.initializeApp({
  apiKey: "AIzaSyCLhWTc_4e5rGJeXV8qGCWZdZLTP0YrjCA",
  authDomain: "dextroux-technologies.firebaseapp.com",
  projectId: "dextroux-technologies",
  storageBucket: "dextroux-technologies.appspot.com",
  messagingSenderId: "1099192792266",
  appId: "1:1099192792266:web:2da00b0f913d84ec4ef033",
  measurementId: "G-QWNY4DPSNH",
});

/*
Retrieve an instance of Firebase Messaging so that it can handle background messages.
*/
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-sw.js] Received background message ",
    payload
  );

  successSound.play();


  /* Customize notification here */
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "https://portal.smartschoolhub.net/icons/72.png",
    sound: "https://portal.smartschoolhub.net/asset/sound/verified.mp3",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});





self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://portal.smartschoolhub.net') // Open a URL when clicked
  );
});