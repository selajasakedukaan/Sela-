<script>
  import { onMount } from 'svelte';
  import { orders } from './orders.svelte.js';
  import { profile } from './profile.svelte.js';
  import OrderCard from './OrderCard.svelte';
  import { waLink } from './contact.js';
  import muslim from '../assets/muslim.svg';
  import cross from '../assets/cross.svg';
  import hindu from '../assets/hindu.svg';

  const greetings = [
    'Selamat datang kembali!',
    'Kami turut berduka.',
    'Sela siap membantu.',
    'Terima kasih telah memilih sela'
  ];
  let g = $state(0);
  onMount(() => {
    const id = setInterval(() => (g = (g + 1) % greetings.length), 3000);
    return () => clearInterval(id);
  });

  const services = [
    { name: 'Muslim', meta: '3 paket', desc: 'Pemulasaraan jenazah sesuai syariat Islam.', icon: muslim, href: '#paket/muslim' },
    { name: 'Kristen', meta: '2 paket', desc: 'Ibadah penghiburan hingga pemakaman.', icon: cross, href: '#paket/kristen' },
    { name: 'Hindu', meta: '2 paket', desc: 'Upacara sesuai tradisi Hindu.', icon: hindu, href: '#paket/hindu' },
    { name: 'Lainnya', meta: 'Segera hadir', desc: 'Layanan untuk agama lain sedang disiapkan.', soon: true }
  ];

  const active = $derived(orders.filter((o) => o.status !== 'Selesai'));
</script>


<main>
  <section class="hero">
    <h1>{profile.nama ? `Halo, Keluarga ${profile.nama.trim().split(/\s+/)[0]}` : 'Halo, selamat datang'}</h1>
    {#key g}
      <p class="greeting">{greetings[g]}</p>
    {/key}
  </section>

  <div class="layout">
    <aside>
      <div class="help">
        <h2>Butuh bantuan segera?</h2>
        <p>Koordinator Sela siap mendampingi 24 jam.</p>
        <a class="btn" href={waLink('Halo Sela, saya butuh bantuan segera.')} target="_blank" rel="noopener">Hubungi Koordinator</a>
      </div>

      <h3>Pesanan aktif</h3>
      {#each active.slice(0, 2) as o (o.no)}
        <OrderCard order={o} />
      {:else}
        <p class="no-order">Belum ada pesanan aktif.</p>
      {/each}
      {#if active.length > 2}<a class="all" href="#pesanan">Lihat semua pesanan →</a>{/if}
    </aside>

    <section>
      <div class="section-head">
        <h3>Pilih layanan sesuai agama</h3>
        <p>Pilih kategori untuk melihat paket yang tersedia.</p>
      </div>
      <div class="grid">
        {#each services as s}
          <svelte:element this={s.soon ? 'div' : 'a'} class="card svc" class:soon={s.soon} href={s.soon ? undefined : s.href} aria-disabled={s.soon ? 'true' : undefined}>
            <div class="svc-top">
              <span class="svc-icon">
                {#if s.icon}<img src={s.icon} alt="" />{:else}•••{/if}
              </span>
              <span class="badge">{s.meta}</span>
            </div>
            <span class="name">{s.name}</span>
            <span class="desc">{s.desc}</span>
            <span class="cta">{s.soon ? 'Segera hadir' : 'Lihat paket →'}</span>
          </svelte:element>
        {/each}
      </div>
    </section>
  </div>
</main>

<style>
  main { max-width: 1200px; margin: 0 auto; padding: 48px 32px 64px; }
  .hero { text-align: center; margin-bottom: 40px; }
  h1 { font: 700 32px 'Montserrat', sans-serif; margin: 0 0 8px; }
  .greeting { font: 400 22px/1.4 'Poppins', sans-serif; color: #424952; margin: 0; animation: fade 0.5s ease; }
  @keyframes fade { from { opacity: 0; transform: translateY(8px); } }

  .layout { display: grid; grid-template-columns: 380px 1fr; gap: 32px; align-items: start; }
  h3 { font: 700 16px 'Montserrat', sans-serif; margin: 0 0 14px; }

  .card {
    border: 1px solid #cfd2d3; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
  }
  a.card:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18); }

  .help {
    background: rgba(44, 96, 156, 0.1); border: 1px solid rgba(15, 22, 30, 0.35);
    border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    padding: 18px; margin-bottom: 28px;
  }
  .help h2 { font: 700 17px 'Montserrat', sans-serif; margin: 0 0 6px; }
  .help p { font-size: 13px; font-weight: 600; letter-spacing: 0.3px; color: rgba(15, 22, 30, 0.7); margin: 0 0 14px; }
  .btn {
    display: flex; justify-content: center; align-items: center; height: 45px;
    background: #0f161e; color: #fff; border-radius: 32px;
    font: 600 14px 'Montserrat', sans-serif; transition: background 0.2s;
  }
  .btn:hover { background: #2a455a; }

  .no-order { margin: 0; font-size: 13px; font-weight: 600; color: rgba(15, 22, 30, 0.6); }
  .all { display: inline-block; margin-top: 10px; font-size: 13px; font-weight: 700; color: #0a62c7; }

  .section-head { margin-bottom: 16px; }
  .section-head h3 { margin-bottom: 4px; }
  .section-head p { margin: 0; font-size: 13px; font-weight: 600; color: rgba(15, 22, 30, 0.6); }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; }
  .svc {
    display: flex; flex-direction: column; gap: 6px;
    padding: 20px; background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }
  a.svc:hover { border-color: #43a047; }
  a.svc:focus-visible { outline: 3px solid #0a62c7; outline-offset: 2px; }
  .svc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .svc-icon {
    display: flex; align-items: center; justify-content: center;
    width: 56px; height: 56px; border-radius: 12px; background: rgba(0, 255, 13, 0.1);
  }
  .svc-icon img { width: 34px; height: 34px; display: block; }
  .badge {
    font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px;
    background: rgba(67, 160, 71, 0.12); color: #2e7d32;
  }
  .name { font: 600 16px 'Montserrat', sans-serif; }
  .desc { font-size: 13px; font-weight: 600; line-height: 1.45; color: rgba(15, 22, 30, 0.65); flex: 1; }
  .cta { margin-top: 8px; font-size: 13px; font-weight: 700; color: #0a62c7; }
  a.svc:hover .cta { text-decoration: underline; }
  .soon { background: rgba(246, 215, 215, 0.45); cursor: not-allowed; }
  .soon .svc-icon { background: rgba(255, 22, 5, 0.1); color: #ff1605; font-weight: 700; }
  .soon .badge { background: rgba(255, 22, 5, 0.12); color: #c62828; }
  .soon .name { color: #ff1605; }
  .soon .cta { color: rgba(51, 0, 1, 0.6); }

  @media (max-width: 900px) {
    .layout { grid-template-columns: 1fr; }
    aside { order: 2; }
  }
  @media (max-width: 480px) {
    main { padding: 24px 16px 40px; }
    h1 { font-size: 22px; }
    .greeting { font-size: 17px; }
    .grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .svc { padding: 14px; }
    .desc { display: none; }
  }
</style>
