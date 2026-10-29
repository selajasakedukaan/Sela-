// Autentikasi sisi klien.
// PERHATIAN: akun email/password disimpan di localStorage perangkat (password di-hash SHA-256).
// Ini hanya untuk prototipe — untuk produksi, pindahkan register/login ke backend.
import { saveProfile } from './profile.svelte.js';

const USERS = 'sela-users';
const SESSION = 'sela-session';
const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
// Abaikan nilai placeholder dari .env.production supaya tombol menampilkan pesan yang jelas.
const GOOGLE_CLIENT_ID = rawClientId.startsWith('ISI_') ? '' : rawClientId;

const read = (k, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export const auth = $state({ user: read(SESSION, null) });

async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function startSession(user) {
  auth.user = user;
  write(SESSION, user);
  saveProfile({ nama: user.nama, email: user.email, ...(user.telp ? { telp: user.telp } : {}) });
}

export async function register({ nama, email, telp, password }) {
  const users = read(USERS, []);
  const key = email.trim().toLowerCase();
  if (users.some((u) => u.email === key)) throw new Error('Email sudah terdaftar. Silakan masuk.');
  const user = { nama: nama.trim(), email: key, telp: telp.trim(), provider: 'email', hash: await hash(key + password) };
  write(USERS, [...users, user]);
  const { hash: _, ...pub } = user;
  startSession(pub);
}

export async function login(email, password) {
  const key = email.trim().toLowerCase();
  const user = read(USERS, []).find((u) => u.email === key);
  if (!user || user.hash !== (await hash(key + password))) throw new Error('Email atau password salah.');
  const { hash: _, ...pub } = user;
  startSession(pub);
}

export function logout() {
  auth.user = null;
  try {
    localStorage.removeItem(SESSION);
  } catch {}
  window.google?.accounts?.oauth2?.revoke?.(auth.googleToken ?? '', () => {});
}

// ---- Google (Google Identity Services, OAuth token flow) ----
let gisLoading;
function loadGis() {
  gisLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Gagal memuat Google Sign-In. Periksa koneksi internet.'));
    document.head.appendChild(s);
  });
  return gisLoading;
}

export const googleConfigured = () => Boolean(GOOGLE_CLIENT_ID);

// Script & token client disiapkan SEBELUM tombol diklik. Kalau dimuat saat klik,
// browser tidak lagi menganggap popup Google sebagai aksi pengguna dan memblokirnya.
let tokenClient;
let pending;

export async function prepareGoogle() {
  if (!GOOGLE_CLIENT_ID || tokenClient) return;
  await loadGis();
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'openid email profile',
    callback: (r) => (r.error ? pending?.reject(new Error(`Login Google gagal: ${r.error_description || r.error}`)) : pending?.resolve(r.access_token)),
    error_callback: (e) =>
      pending?.reject(new Error(e?.type === 'popup_failed_to_open'
        ? 'Popup Google diblokir browser. Izinkan popup untuk situs ini lalu coba lagi.'
        : 'Login Google dibatalkan.'))
  });
}

export const googleReady = () => Boolean(tokenClient);

export async function loginWithGoogle() {
  if (!GOOGLE_CLIENT_ID) throw new Error('Login Google belum dikonfigurasi: isi VITE_GOOGLE_CLIENT_ID di file .env.local lalu jalankan ulang server.');
  if (!tokenClient) throw new Error('Google Sign-In masih dimuat, coba lagi sebentar.');
  const token = await new Promise((resolve, reject) => {
    pending = { resolve, reject };
    tokenClient.requestAccessToken(); // dipanggil langsung di dalam klik
  });
  const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error('Gagal mengambil data akun Google.');
  const info = await r.json();
  auth.googleToken = token;
  startSession({ nama: info.name ?? '', email: info.email, picture: info.picture ?? '', provider: 'google' });
}
