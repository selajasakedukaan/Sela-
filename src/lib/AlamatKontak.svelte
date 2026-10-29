<script>
  import MapPicker from './MapPicker.svelte';
  import { order, saveOrder } from './order.svelte.js';
  import { rupiah } from './packages.js';
  import { profile, saveProfile } from './profile.svelte.js';

  let { agama, paket } = $props();

  const ONGKIR = 200000; // sesuai desain; bisa diganti hitungan berdasarkan jarak
  const c = order.contact;
  // Isi otomatis dari profil tersimpan di perangkat (tanpa login)
  for (const k of Object.keys(c)) if (!c[k] && profile[k]) c[k] = profile[k];
  const grandTotal = $derived(order.total + ONGKIR);

  let picker;
  let submitted = $state(false);

  const phoneOk = (v) => /^(\+62|0)8\d{7,12}$/.test(v.replace(/[\s-]/g, ''));
  const errors = $derived({
    nama: !c.nama.trim() && 'Nama wajib diisi.',
    alamat: !c.alamat.trim() && 'Alamat wajib diisi.',
    telp: !phoneOk(c.telp) && 'Masukkan nomor HP yang valid, mis. 0812 3456 7890.',
    email: c.email && !/^\S+@\S+\.\S+$/.test(c.email) && 'Format email tidak valid.',
    telpLain: c.telpLain && !phoneOk(c.telpLain) && 'Nomor tidak valid.'
  });
  const valid = $derived(!Object.values(errors).some(Boolean));

  function onpick({ lat, lng, address }) {
    c.lat = lat;
    c.lng = lng;
    if (address) c.alamat = address;
    saveOrder();
  }

  // Ketik alamat manual → peta ikut pindah (setelah berhenti mengetik)
  let alamatTimer;
  function onAlamatInput() {
    clearTimeout(alamatTimer);
    alamatTimer = setTimeout(() => picker.locate(c.alamat), 1000);
  }

  function submit(e) {
    e.preventDefault();
    submitted = true;
    if (!valid) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    order.ongkir = ONGKIR;
    saveProfile({ ...c });
    saveOrder();
    location.hash = `#paket/${agama}/${paket}/bayar`;
  }
</script>

<div class="appbar">
  <div class="inner">
    <a href="#paket/{agama}/{paket}" class="back" aria-label="Kembali">←</a>
    <h1>Alamat dan Kontak</h1>
  </div>
</div>

<form class="page" onsubmit={submit} oninput={saveOrder} novalidate>
  <div class="body">
    <section>
      <h2>Lokasi</h2>
      <MapPicker bind:this={picker} lat={c.lat} lng={c.lng} {onpick} />
      <button type="button" class="btn-outline" onclick={() => picker.useCurrentLocation()}>Gunakan lokasi saat ini</button>
    </section>

    <section class="fields">
      <h2>Data pemesan</h2>
      <p class="note">Tidak perlu membuat akun. Data hanya dipakai koordinator untuk menghubungi Anda.</p>

      {#snippet field(id, label, type, placeholder, autocomplete, required)}
        <div class="field">
          <label for={id}>{label}{#if required}<span class="req">*</span>{/if}</label>
          {#if type === 'textarea'}
            <textarea {id} rows="3" {placeholder} bind:value={c[id]} oninput={onAlamatInput} aria-invalid={submitted && !!errors[id]} {autocomplete}></textarea>
          {:else}
            <input {id} {type} {placeholder} bind:value={c[id]} aria-invalid={submitted && !!errors[id]} {autocomplete} />
          {/if}
          {#if submitted && errors[id]}<span class="err">{errors[id]}</span>{/if}
        </div>
      {/snippet}

      {@render field('nama', 'Nama', 'text', 'Nama', 'name', true)}
      {@render field('alamat', 'Alamat', 'textarea', 'Jalan, nomor, kelurahan, kecamatan', 'street-address', true)}
      <div class="two">
        {@render field('telp', 'No. Telp', 'tel', '08xx xxxx xxxx', 'tel', true)}
        {@render field('email', 'Email', 'email', 'nama@email.com', 'email', false)}
      </div>
      {@render field('telpLain', 'No. telp lainnya', 'tel', 'Keluarga yang bisa dihubungi', 'off', false)}
    </section>
  </div>

  <aside class="summary">
    <div class="line"><span>Total paket</span><b>{rupiah(order.total)}</b></div>
    <div class="line"><span>Ongkir</span><b>{rupiah(ONGKIR)}</b></div>
    <div class="line total"><span>Total</span><span>{rupiah(grandTotal)}</span></div>
    <button type="submit" class="btn">LANJUT</button>
  </aside>
</form>

<style>
  .appbar { background: #fff; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25); }
  .appbar .inner { max-width: 1200px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 12px; }
  .back { font: 700 18px 'Nunito', sans-serif; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
  .back:hover { background: rgba(15, 22, 30, 0.08); }
  h1 { font: 700 20px 'Montserrat', sans-serif; margin: 0; }
  h2 { font: 700 15px 'Montserrat', sans-serif; margin: 0 0 12px; }

  .page {
    max-width: 1200px; margin: 0 auto; padding: 32px 32px 64px;
    display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: start;
  }
  .body {
    background: #fff; border: 1px solid #cfd2d3; border-radius: 8px; padding: 24px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
  }
  section { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  section h2 { margin: 0; }
  .note { margin: -6px 0 0; font-size: 12px; font-weight: 600; color: rgba(15, 22, 30, 0.6); }

  .btn-outline {
    padding: 13px 16px; border: 1px solid rgba(15, 22, 30, 0.35); border-radius: 32px; background: #fff;
    font: 600 14px 'Montserrat', sans-serif; color: #0f161e; cursor: pointer; transition: background 0.2s;
  }
  .btn-outline:hover { background: rgba(15, 22, 30, 0.06); }

  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  label { font-size: 12px; font-weight: 700; letter-spacing: 0.3px; color: rgba(15, 22, 30, 0.7); }
  .req { color: #f44336; margin-left: 2px; }
  input, textarea {
    width: 100%; padding: 12px; border: 1px solid #cfd2d3; border-radius: 4px;
    font: 600 13px 'Nunito', sans-serif; letter-spacing: 0.3px; color: #0f161e; resize: vertical;
  }
  input::placeholder, textarea::placeholder { color: rgba(15, 22, 30, 0.5); }
  input:focus, textarea:focus { outline: 2px solid #0a62c7; border-color: transparent; }
  [aria-invalid='true'] { border-color: #f44336; }
  .err { font-size: 12px; font-weight: 600; color: #f44336; }

  .summary {
    position: sticky; top: 90px; background: #fff; border: 1px solid #cfd2d3; border-radius: 8px;
    padding: 20px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  .line { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; letter-spacing: 0.3px; }
  .line span:first-child { font-weight: 600; color: rgba(15, 22, 30, 0.7); }
  .total { font: 700 16px 'Montserrat', sans-serif; padding-top: 12px; border-top: 1px solid rgba(15, 22, 30, 0.1); }
  .total span:first-child { color: #0f161e; }
  .btn {
    padding: 13px 16px; border: 0; border-radius: 32px; background: #0f161e; color: #fff; cursor: pointer;
    font: 600 14px 'Montserrat', sans-serif; letter-spacing: 1px;
  }
  .btn:hover { background: #2a455a; }

  @media (max-width: 1000px) {
    .body { grid-template-columns: 1fr; }
  }
  @media (max-width: 900px) {
    .page { grid-template-columns: 1fr; padding: 20px 16px 0; }
    .summary { top: auto; bottom: 0; margin: 0 -16px; border-radius: 12px 12px 0 0; box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.12); }
  }
  @media (max-width: 480px) {
    .body { padding: 16px; }
    .two { grid-template-columns: 1fr; }
  }
</style>
