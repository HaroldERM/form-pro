/* eslint-disable no-console */

import { register } from "register-service-worker";
import { Workbox } from "workbox-window";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated() {
      console.log("New content is available; please refresh.");
      // Reload the page to apply the update
      window.location.reload(true);
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });

  // Check if Workbox is supported by the browser
  if ("serviceWorker" in navigator) {
    // Create a new instance of Workbox
    const workbox = new Workbox(`${process.env.BASE_URL}service-worker.js`);

    // Event triggered when the installed service worker takes control
    workbox.addEventListener("controlling", () => {
      window.location.reload();
    });

    // Event triggered when there's a new service worker available
    workbox.addEventListener("waiting", () => {
      if (confirm("New version available! Do you want to refresh?")) {
        // Notify the new service worker that it can take control
        workbox.messageSW({ type: "SKIP_WAITING" });
      }
    });

    // Register the service worker and manage the cache
    workbox.register();

    // Configure the cache strategy for the index.html
    registerRoute(
      ({ request }) => request.destination === "document",
      new CacheFirst()
    );
  }
}
