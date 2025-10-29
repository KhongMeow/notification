const isSecure = () => window.isSecureContext || location.hostname === 'localhost';

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const checkSupport = () => {
  if (!isSecure()) throw new Error('Needs HTTPS or localhost.');
  if (!('serviceWorker' in navigator)) throw new Error('No support for Service Worker!');
  if (!('Notification' in window)) throw new Error('No support for Notification API');
};

const registerSW = async () => {
  // If sw.js is not at the web root, its scope is limited to this folder.
  return navigator.serviceWorker.register('sw.js');
};

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notification permission not granted');
  return permission;
};

const enableNotifications = async () => {
  checkSupport();

  // iOS requires an installed PWA (iOS 16.4+) for web push
  if (isIOS() && !isStandalone()) {
    throw new Error('On iOS, install to Home Screen (iOS 16.4+) to use notifications.');
  }

  const reg = await registerSW();
  await navigator.serviceWorker.ready;
  await requestNotificationPermission();

  // Use the SW to show notifications (more reliable on mobile)
  await reg.showNotification('Hello world', {
    body: 'Works on Android and supported iOS PWAs.',
    icon: '/icon.png', // optional
  });
};

// Wire up a user gesture (required on mobile)
document.getElementById('enable-notifications')?.addEventListener('click', () => {
  enableNotifications().catch(err => console.error(err.message));
});