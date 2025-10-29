const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!")
    }
    if (!('Notification' in window)) {
        throw new Error("No support fro notification API");
    }
}
const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
}
const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        alert(permission);
        alert("Notification permission not granted");
        throw new Error("Notification permission not granted")
    } else {
        alert(permission);
        alert("Notification permission granted");
        new Notification ("Hello world");
    }
    
}
checkPermission()
registerSW()
requestNotificationPermission()