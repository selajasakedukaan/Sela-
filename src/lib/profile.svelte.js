// Profil tanpa login: data kontak terakhir disimpan di perangkat (localStorage)
// supaya form berikutnya terisi otomatis dan bisa diubah di halaman Profil.
const KEY = 'sela-profile';

const empty = { nama: '', alamat: '', telp: '', email: '', telpLain: '', lat: null, lng: null };

function load() {
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return { ...empty };
  }
}

export const profile = $state(load());

export function saveProfile(data = profile) {
  Object.assign(profile, data);
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {}
}

export function clearDeviceData() {
  Object.assign(profile, empty);
  try {
    ['sela-profile', 'sela-orders', 'sela-notifications'].forEach((k) => localStorage.removeItem(k));
    sessionStorage.removeItem('sela-order');
  } catch {}
}
