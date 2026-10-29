// Kontak koordinator Sela. GANTI dengan nomor WhatsApp asli (format 62xxx, tanpa + / 0).
export const COORDINATOR = { name: 'Nama Koordinator', phone: '6281234567890' };

export const waLink = (text) =>
  `https://wa.me/${COORDINATOR.phone}?text=${encodeURIComponent(text)}`;

export const telLink = () => `tel:+${COORDINATOR.phone}`;
