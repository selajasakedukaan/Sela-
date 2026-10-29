// Data paket per agama. Isi paket Kristen sesuai desain Figma;
// isi paket Muslim & Hindu masih contoh — ganti dengan data asli.
export const religions = [
  { id: 'muslim', name: 'Muslim' },
  { id: 'kristen', name: 'Kristen' },
  { id: 'hindu', name: 'Hindu' }
];

export const packages = {
  muslim: [
    { name: 'Basic', price: 'Mulai Rp 1.500.000', available: true, items: ['Memandikan & mengkafani jenazah', 'Kain kafan & perlengkapan', 'Koordinasi salat jenazah'] },
    { name: 'Standard', price: 'Mulai Rp 2.500.000', available: true, items: ['Semua isi paket Basic', 'Tenda & kursi', 'Makanan / katering', 'Papan bunga'] },
    { name: 'Premium', price: 'Mulai Rp 4.500.000', available: false, items: ['Jasa ambulance', 'Semua isi paket Standard', 'Pengurusan makam', 'Sound system'] }
  ],
  kristen: [
    { name: 'Standard', price: 'Mulai Rp 2.500.000', available: true, items: ['Makanan / katering', 'Papan bunga, air bunga, bunga tanah', 'Tenda, kursi, papan salib', 'Sound system (mic, keyboard, speaker)'] },
    { name: 'Premium', price: 'Mulai Rp 4.500.000', available: false, items: ['Jasa ambulance', 'Jasa jenazah + peti', 'Suntik formalin', 'Sound system · opsional: kubur, pendeta, PDD'] }
  ],
  hindu: [
    { name: 'Standard', price: 'Mulai Rp 2.500.000', available: true, items: ['Makanan / katering', 'Perlengkapan upacara', 'Tenda & kursi', 'Sound system'] },
    { name: 'Premium', price: 'Mulai Rp 4.500.000', available: false, items: ['Jasa ambulance', 'Semua isi paket Standard', 'Pendampingan upacara lengkap'] }
  ]
};

// Konfigurasi halaman kustomisasi paket (sesuai desain "Paket Standar · Kristen").
// Harga satuan opsi belum ada di desain ("+ Rp ···") — angka di bawah masih contoh.
export const customization = {
  included: ['Tim lapangan (2 orang)', 'Tenda', 'Papan bunga'],
  options: [
    { id: 'makanan', name: 'Makanan & Minuman (basah dan snack)', qty: [{ id: 'konsumsi', label: 'Konsumsi (pax)', unitName: 'pax', unit: 15000, default: 50, min: 10, step: 10 }] },
    { id: 'karpet', name: 'Karpet / Tikar', qty: [{ id: 'karpet', label: 'Karpet / Tikar', unitName: 'buah', unit: 50000, default: 2, min: 1 }] },
    { id: 'kursi-meja', name: 'Kursi dan Meja', qty: [
      { id: 'kursi', label: 'Kursi', unitName: 'buah', unit: 5000, default: 50, min: 10, step: 10 },
      { id: 'meja', label: 'Meja', unitName: 'buah', unit: 25000, default: 4, min: 1 }
    ] },
    { id: 'sound', name: 'Sound System', flat: 300000 },
    { id: 'pdd', name: 'PDD', note: 'Undangan duka & dokumentasi', flat: 200000, qty: [{ id: 'undangan', label: 'Undangan', unitName: 'lembar undangan', unit: 3000, default: 50, min: 10, step: 10 }] }
  ],
  serviceFee: 0.1,
  bundleDiscount: 200000 // potongan jika seluruh opsi dipilih
};

export const basePrice = { basic: 1500000, standard: 2500000, premium: 4500000 };

export const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');

// Item pesanan bisa berupa string (data lama) atau { name, detail, optional }.
export const normalizeItem = (i) =>
  typeof i === 'string'
    ? { name: i.replace(' (opsional)', ''), detail: '', optional: i.endsWith('(opsional)') }
    : i;
