const version = "1.1.2"; // Change this to a new value whenever you update the service worker
const installButton = document.getElementById('install-pwa-button');
let deferredPrompt;
if ("serviceWorker" in navigator) {
  // UNREGISTER OLD SERVICE WORKER
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });

  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register(`./serviceWorker.js?v=${version}`)
      .then((res) => {
        console.log("service worker registered v" + version)
        setTimeout(() => {
          initFirebaseMessagingRegistration();
        }
          , 5000);
      })
      .catch((err) => console.log("service worker not registered", err));
  });



  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the browser's default install prompt
    e.preventDefault();
    // Store the event for later use
    deferredPrompt = e;

    // Show your custom install button
    //if (!localStorage["sshub_app_installed"]) {
    openInstallModal();
    //}
  });

}


function installApp() {
  // Trigger the deferred prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      localStorage.setItem("sshub_app_installed", true)
      console.log('User accepted the PWA installation');
    } else {
      console.log('User declined the PWA installation');
      localStorage.setItem("sshub_app_installed", false)
    }

    // Reset the prompt
    deferredPrompt = null;


    // ASK FOR PERMISSION FOR NOTIFICATION
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
          // You can now send notifications
        } else if (permission === 'denied') {
          console.log('Notification permission denied');
        } else if (permission === 'default') {
          console.log('Notification permission dismissed');
        }
      });
    }
  });
}


function openInstallModal() {
  var modal = `<div class="modal fade show" id="installModal" tabindex="-1" role="dialog" aria-labelledby="endModalTitle" data-backdrop="static" data-keyboard="false" style="display: block;">
  <div class="modal-dialog" role="document">
      <div style="background-color:#051f3e; color:white;" class="modal-content">
          <div class="modal-header">
              <h4 style="font-family: Poppins; font-weight: bold;" class="modal-title col-12 text-center" id="installModalTitle">
                  <b>Get our mobile app</b>
              </h4>
  
          </div>
          <div class="modal-body text-center">
              <div class="row">
                  <div class="col-lg-12">
                      <img src="./icons/152.png" alt="">
                  </div>
                  <div class="col-lg-12 no-padding">
                      <div class="">
                          <link rel="stylesheet" type="text/css" href="./asset/css/style.css">
                          <link href="./assets/css/lib/toastr/toastr.min.css" rel="stylesheet">
                          <link href="./assets/css/lib/sweetalert/sweetalert.css" rel="stylesheet">
                          <div style="display: flex;
                          justify-content: center;" class="row">
  
                              <b>
                                  <h3 style="font-weight: bold; font-family: Rowdies; color:white;">
                                      SMARTSCHOOLHUB.net
                                  </h3>
                              </b>
  
                          </div>
                          
  
                          <h5 style="color: #ff9d01; font-family: Poppins; font-weight: bold;">Install app and allow notication for better experience
                          </h5>
  
                          <div class="row  no-margin" style="padding:10px">
                              <button style="border-color:white; margin-top:10px;" onclick="installApp()" class="btn btn-primary btn-sm  col-md-6">Install App</button>
      <button style="border-color:white;margin-top:10px;" onclick="closeInstallModal()" class="btn btn-primary btn-sm  col-md-6">Close</button>
                              
                          </div>
  
                              
      <br>
                              
                          
  
                          <br>
  
                      </div>
                      
                  </div>
  
              </div>
              <script src="./assets/js/lib/toastr/toastr.min.js"></script>
              <script src="./assets/js/lib/toastr/toastr.init.js"></script>
              <script src="./assets/js/lib/sweetalert/sweetalert.min.js"></script>
              <script src="./assets/js/lib/sweetalert/sweetalert.init.js"></script>
          </div>
      </div>
  </div>
  </div>
`;

  installModal = parent.document.getElementById("installModal");
  if (installModal != null) {
    return 0;
  }

  parent.$("body").append(modal);
  parent
    .$("#installModal")
    .modal({ backdrop: "static", keyboard: false });
  parent.$("#installModal").modal("show");
}

function closeInstallModal() {
  parent.$("#installModal").modal("hide");
  parent.document.getElementById("installModal").remove();
}



async function initFirebaseMessagingRegistration() {
  try {

    const firebaseConfig = {
      apiKey: "AIzaSyCLhWTc_4e5rGJeXV8qGCWZdZLTP0YrjCA",
      authDomain: "dextroux-technologies.firebaseapp.com",
      projectId: "dextroux-technologies",
      storageBucket: "dextroux-technologies.appspot.com",
      messagingSenderId: "1099192792266",
      appId: "1:1099192792266:web:2da00b0f913d84ec4ef033",
      measurementId: "G-QWNY4DPSNH",
    };
    const app = firebase.initializeApp(firebaseConfig)
    const messaging = firebase.messaging();

    const fcmSwRegistration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/firebase-cloud-messaging-push-scope/' } // Custom scope to avoid conflicts
    );

    // Get FCM token
    const token = await messaging.getToken();
    localStorage.setItem("sshub_fcm_token", token);
    console.log('FCM Token:', token);

    // Listen for incoming messages (when app is in foreground)
    messaging.onMessage((payload) => {
      // notification data receive here, use it however you want
      // keep in mind if message receive here, it will not notify in background

      console.log('in app notify ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "https://portal.smartschoolhub.net/icons/120.png",
        sound: "https://portal.smartschoolhub.net/asset/sound/verified.mp3",
      };
      var notification = new Notification(notificationTitle, notificationOptions);
      console.log('Notification created:', notification)

    });
  } catch (err) {
    console.log('eFCM initialization failed:', err);
  }
}