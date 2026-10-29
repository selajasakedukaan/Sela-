// Notifikasi disimpan di perangkat. Nantinya bisa diisi dari backend
// (mis. saat koordinator memperbarui tahap pesanan).
const KEY = 'sela-notifications';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export const notifications = $state(load());

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(notifications));
  } catch {}
}

export function notify({ title, body, href = '' }) {
  notifications.unshift({ id: crypto.randomUUID?.() ?? String(Math.random()), title, body, href, at: Date.now(), read: false });
  persist();
}

export function markRead(id) {
  const n = notifications.find((x) => x.id === id);
  if (n && !n.read) { n.read = true; persist(); }
}

export function markAllRead() {
  notifications.forEach((n) => (n.read = true));
  persist();
}

export const unreadCount = () => notifications.filter((n) => !n.read).length;
