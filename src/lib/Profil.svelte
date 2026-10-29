<script>
  import { profile, saveProfile, clearDeviceData } from './profile.svelte.js';
  import { waLink } from './contact.js';
  import { auth, logout } from './auth.svelte.js';

  let open = $state('');
  let draft = $state({});
  let saved = $state('');

  const initials = $derived(
    profile.nama.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?'
  );

  const sections = [
    { id: 'diri', label: 'Data diri', fields: [['nama', 'Nama', 'text'], ['telp', 'No. Telp', 'tel'], ['email', 'Email', 'email']] },
    { id: 'alamat', label: 'Alamat tersimpan', fields: [['alamat', 'Alamat', 'textarea']] },
    { id: 'keluarga', label: 'Kontak keluarga lainnya', fields: [['telpLain', 'No. telp keluarga', 'tel']] }
  ];

  function toggle(id) {
    open = open === id ? '' : id;
    draft = { ...profile };
    saved = '';
  }

  function save(e, id) {
    e.preventDefault();
    saveProfile(draft);
    saved = id;
  }

  function signOut() {
    logout();
    location.hash = '#masuk';
  }

  function clearData() {
    if (confirm('Hapus data diri, riwayat pesanan, dan notifikasi dari perangkat ini?')) {
      logout();
      clearDeviceData();
      location.hash = '#';
      location.reload();
    }
  }
</script>

<main>
  <h1>Profil Pengguna</h1>

  <div class="user">
    {#if auth.user?.picture}
      <img class="avatar" src={auth.user.picture} alt="" width="52" height="52" referrerpolicy="no-referrer" />
    {:else}
      <span class="avatar" aria-hidden="true">{initials}</span>
    {/if}
    <div>
      <p class="name">{profile.nama || 'Pengguna Sela'}</p>
      <p class="contact">
        {#if profile.telp || profile.email}
          {profile.telp || '—'}{#if profile.email} · <span>{profile.email}</span>{/if}
        {:else}
          Data akan tersimpan otomatis setelah Anda memesan.
        {/if}
      </p>
    </div>
  </div>

  <div class="card">
    {#each sections as s}
      <button class="row" aria-expanded={open === s.id} onclick={() => toggle(s.id)}>
        <span>{s.label}</span><span class="chev" class:rot={open === s.id}>›</span>
      </button>
      {#if open === s.id}
        <form class="panel" onsubmit={(e) => save(e, s.id)}>
          {#each s.fields as [key, label, type]}
            <label>
              {label}
              {#if type === 'textarea'}
                <textarea rows="3" bind:value={draft[key]}></textarea>
              {:else}
                <input {type} bind:value={draft[key]} />
              {/if}
            </label>
          {/each}
          <div class="actions">
            {#if saved === s.id}<span class="ok">Tersimpan ✓</span>{/if}
            <button class="btn" type="submit">Simpan</button>
          </div>
        </form>
      {/if}
    {/each}

    <a class="row" href={waLink('Halo Sela, saya butuh bantuan.')} target="_blank" rel="noopener">
      <span>Pusat bantuan</span><span class="chev">›</span>
    </a>

    <button class="row" aria-expanded={open === 'privasi'} onclick={() => toggle('privasi')}>
      <span>Kebijakan privasi &amp; kerahasiaan data</span><span class="chev" class:rot={open === 'privasi'}>›</span>
    </button>
    {#if open === 'privasi'}
      <div class="panel text">
        <p>Sela tidak memerlukan akun. Data diri, alamat, dan riwayat pesanan disimpan di perangkat Anda dan hanya dikirim ke koordinator untuk keperluan layanan.</p>
        <p>Data keluarga tidak dibagikan kepada pihak lain di luar vendor yang menangani pesanan Anda. Anda dapat menghapus seluruh data dari perangkat ini kapan saja melalui tombol Keluar.</p>
      </div>
    {/if}
  </div>

  {#if auth.user}
    <p class="account">Masuk sebagai <b>{auth.user.email}</b>{auth.user.provider === 'google' ? ' (Google)' : ''}</p>
    <button class="logout" onclick={signOut}>Keluar</button>
    <button class="text-btn" onclick={clearData}>Hapus semua data dari perangkat ini</button>
  {:else}
    <div class="auth-actions">
      <a class="btn wide" href="#masuk">Masuk</a>
      <a class="btn wide outline" href="#daftar">Daftar</a>
    </div>
    <p class="hint">Akun bersifat opsional — Anda tetap bisa memesan tanpa akun.</p>
    <button class="text-btn" onclick={clearData}>Hapus semua data dari perangkat ini</button>
  {/if}
</main>

<style>
  main { max-width: 640px; margin: 0 auto; padding: 40px 32px 48px; }
  h1 { font: 700 26px 'Montserrat', sans-serif; text-align: center; margin: 0 0 28px; }

  .user { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .avatar {
    width: 52px; height: 52px; flex-shrink: 0; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: #2a455a; color: #fff; font: 700 18px 'Montserrat', sans-serif;
  }
  .name { margin: 0 0 4px; font: 700 17px 'Montserrat', sans-serif; }
  .contact { margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; color: rgba(15, 22, 30, 0.7); }
  .contact span { font-weight: 400; }

  .card { background: #fff; border: 1px solid #cfd2d3; border-radius: 8px; padding: 4px 16px; }
  .row {
    width: 100%; height: 52px; display: flex; align-items: center; justify-content: space-between;
    border: 0; background: none; cursor: pointer; text-align: left;
    font: 700 14px 'Nunito', sans-serif; letter-spacing: 0.3px; color: #0f161e;
  }
  .row:not(:first-child) { border-top: 1px solid rgba(15, 22, 30, 0.1); }
  .row:hover span:first-child { color: #0a62c7; }
  .row:focus-visible { outline: 3px solid #0a62c7; outline-offset: -3px; }
  .chev { font-size: 18px; color: rgba(15, 22, 30, 0.7); transition: transform 0.2s; }
  .chev.rot { transform: rotate(90deg); }

  .panel { display: flex; flex-direction: column; gap: 12px; padding: 4px 0 16px; }
  .panel.text p { margin: 0; font-size: 13px; line-height: 1.55; color: rgba(15, 22, 30, 0.75); }
  label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 700; color: rgba(15, 22, 30, 0.7); }
  input, textarea {
    padding: 11px 12px; border: 1px solid #cfd2d3; border-radius: 4px; resize: vertical;
    font: 600 13px 'Nunito', sans-serif; color: #0f161e;
  }
  input:focus, textarea:focus { outline: 2px solid #0a62c7; border-color: transparent; }
  .actions { display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
  .ok { font-size: 12px; font-weight: 700; color: #43a047; }
  .btn { padding: 9px 22px; border: 0; border-radius: 32px; background: #0f161e; color: #fff; cursor: pointer; font: 600 13px 'Montserrat', sans-serif; }
  .btn:hover { background: #2a455a; }

  .logout {
    width: 100%; margin-top: 20px; height: 45px; border: 1px solid rgba(15, 22, 30, 0.35); border-radius: 32px;
    background: #fff; cursor: pointer; font: 600 14px 'Montserrat', sans-serif; color: #0f161e;
  }
  .logout:hover { background: #fbe1e1; border-color: #f44336; color: #f44336; }
  img.avatar { object-fit: cover; }
  .account { margin: 20px 0 0; text-align: center; font-size: 12px; font-weight: 600; color: rgba(15, 22, 30, 0.7); }
  .account + .logout { margin-top: 10px; }
  .auth-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
  .btn.wide { display: flex; justify-content: center; padding: 12px; font-size: 14px; }
  .btn.outline { background: #fff; color: #0f161e; border: 1px solid rgba(15, 22, 30, 0.35); }
  .btn.outline:hover { background: rgba(15, 22, 30, 0.06); }
  .text-btn { display: block; margin: 14px auto 0; border: 0; background: none; cursor: pointer; font: 600 12px 'Nunito', sans-serif; color: #c62828; }
  .text-btn:hover { text-decoration: underline; }
  .hint { margin: 8px 0 0; text-align: center; font-size: 11px; font-weight: 600; color: rgba(15, 22, 30, 0.6); }

  @media (max-width: 480px) {
    main { padding: 24px 16px 32px; }
    h1 { font-size: 20px; }
  }
</style>
