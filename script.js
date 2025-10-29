const ensureSupport = () => {
    if (!('serviceWorker' in navigator)) throw new Error("No support for Service Worker");
    if (!('Notification' in window)) throw new Error("No support for Notification API");
};

const registerSW = async () => {
    return navigator.serviceWorker.register('sw.js'); // ensure sw.js is in the same folder or adjust path
};

const requestNotificationPermission = async () => {
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    // Must be called from a user gesture on Android 13+
    const permission = await Notification.requestPermission();
    return permission === 'granted';
};

const showLocalNotification = async (title, options = {}) => {
    const registration = await navigator.serviceWorker.ready;
    return registration.showNotification(title, options);
};

// Call this from a user gesture (e.g., button click)
export const notify = async () => {
    try {
        ensureSupport();
        await registerSW();
        const granted = await requestNotificationPermission();
        if (!granted) throw new Error("Notification permission not granted");
        await showLocalNotification("Hello world", {
            body: "It works on Android",
            icon: "/icon-192.png", // update path to an existing icon
            vibrate: [100, 50, 100],
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

// Example: attach to a button with id="notify-btn"
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('notify-btn');
    if (btn) btn.addEventListener('click', notify);
});