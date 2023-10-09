import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import store from "./store.ts";
import { Provider } from "react-redux";

import readExcelFile from "./utils/util.ts";
readExcelFile()


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

if (navigator.serviceWorker) {
  try {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("../service-worker.ts")
        .then((reg) => console.log("Service Worker registered", reg.scope))
        .catch((err) => console.log("Service Worker: Error", err));
    });
  } catch (error) {
    console.log(error);
  }
}


// let deferredPrompt;

// window.addEventListener('beforeinstallprompt', (e) => {
//   // Prevent the browser's default prompt
//   e.preventDefault();
  
//   // Store the event for later use
//   deferredPrompt = e;

//   // Show your custom "Add to Home Screen" button or UI element
//   showInstallButton();
// });

// // Function to show your custom install button
// function showInstallButton() {
//   // Show your custom UI element (e.g., a button) and handle the user's click
//   const installButton = document.getElementById('install-button');
//   installButton.style.display = 'block';

//   installButton.addEventListener('click', () => {
//     // Prompt the user to install the app
//     deferredPrompt.prompt();

//     // Wait for the user to respond
//     deferredPrompt.userChoice.then((choiceResult) => {
//       if (choiceResult.outcome === 'accepted') {
//         console.log('User accepted the install prompt');
//       } else {
//         console.log('User dismissed the install prompt');
//       }

//       // Clear the deferredPrompt variable
//       deferredPrompt = null;
//     });
//   });
// }
