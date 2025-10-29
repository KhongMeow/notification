async function ensureSupport() {
  if (!('serviceWorker' in navigator)) {
    alert('Service Worker not supported');
    return false;
  }
  if (!('Notification' in window)) {
    alert('Notification API not supported');
    return false;
  }
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    alert('Must be served over HTTPS or localhost');
    return false;
  }
  return true;
}

async function registerSW() {
  try {
    // Keep sw.js at your web root or adjust scope as needed
    return await navigator.serviceWorker.register('sw.js', { scope: './' });
  } catch (e) {
    console.error('SW registration failed:', e);
    return null;
  }
}

async function enableNotifications() {
  if (!(await ensureSupport())) return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  const reg = (await navigator.serviceWorker.getRegistration()) || (await registerSW());
  if (!reg) return;

  await reg.showNotification('Hello world', {
    body: 'Works on more devices via Service Worker',
    tag: 'hello',
    renotify: false,
    icon: '/icon.png',
    badge: '/badge.png',
  });

  alert('Notification sent');
}

// Call this from a user gesture (e.g., a button)
// <button id="enable-notifications">Enable notifications</button>
document.getElementById('enable-notifications')?.addEventListener('click', enableNotifications);