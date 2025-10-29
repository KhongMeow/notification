const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!");
    }
    if (!('Notification' in window)) {
        throw new Error("No support for notification API");
    }
    if (!(window.isSecureContext || location.hostname === 'localhost')) {
        throw new Error("Notifications require HTTPS or localhost.");
    }
};

const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
};

const requestNotificationPermission = async () => {
    // Must be called from a user gesture on mobile
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error("Notification permission not granted");
    }
    return permission;
};

const enableNotifications = async () => {
    checkPermission();
    const reg = await registerSW();
    await navigator.serviceWorker.ready;
    await requestNotificationPermission();

    // Use the SW to show the notification (more reliable on mobile)
    await reg.showNotification("Hello world", {
        body: "Shown via ServiceWorkerRegistration.showNotification",
        // icon: "/icon.png" // optional
    });
};

// Wire to a user gesture instead of auto-running
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('enable-notifications');
    if (btn) {
        btn.addEventListener('click', () => {
            enableNotifications().catch(err => alert(err.message));
        });
    }
});