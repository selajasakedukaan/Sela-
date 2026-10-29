// Riwayat pesanan disimpan di localStorage perangkat (website tanpa login).
// Nanti bisa diganti dengan data dari backend berdasarkan no. telp / no. pesanan.
const KEY = 'sela-orders';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export const orders = $state(load());

export function addOrder(o) {
  orders.unshift({ status: 'Berlangsung', step: 'Tahap 1 dari 5 — Menunggu konfirmasi koordinator', createdAt: Date.now(), ...o });
  try {
    localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {}
}
