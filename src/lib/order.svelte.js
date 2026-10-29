// Data pesanan disimpan di sessionStorage karena website tidak memakai login.
const KEY = 'sela-order';

function load() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

export const order = $state({
  total: 0,
  ongkir: 0,
  title: '',
  items: [],
  method: '',
  orderNo: '',
  contact: { nama: '', alamat: '', telp: '', email: '', telpLain: '', lat: null, lng: null },
  ...load()
});

export function saveOrder() {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {}
}
