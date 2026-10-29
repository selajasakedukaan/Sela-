<script>
  // Kerangka halaman Masuk/Daftar: panel brand gelap + area form.
  import arc from '../assets/auth/arc.svg';
  import circles from '../assets/bg/circles.svg';

  let { subtitle = '', topLink = null, children } = $props();
</script>

<div class="auth">
  <aside class="brand">
    <img class="circles" src={circles} alt="" aria-hidden="true" />
    <img class="arc" src={arc} alt="" aria-hidden="true" />
    <div class="brand-text">
      <p class="logo">SELA</p>
      {#if subtitle}<p class="subtitle">{subtitle}</p>{/if}
      <p class="hadir">HADIR</p>
      <p class="tagline">Kami hadir untuk memberi kemudahan dan kenyamanan dalam semua kegiatan duka</p>
    </div>
    {#if topLink}<a class="top-link" href={topLink.href}>{topLink.label}</a>{/if}
  </aside>

  <main class="form-area">
    {@render children()}
  </main>
</div>

<style>
  .auth { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; background: #fff; }

  .brand { position: relative; overflow: hidden; background: #2a455a; color: #fff; display: flex; align-items: center; justify-content: center; padding: 48px; }
  .arc { display: none; }
  .circles { position: absolute; left: -272px; top: -199px; width: 758px; opacity: 0.6; pointer-events: none; }
  .brand-text { position: relative; text-align: center; max-width: 340px; }
  .logo, .hadir { margin: 0; font: 700 64px/1 'Bodoni Moda', serif; letter-spacing: 0.04em; }
  .subtitle { margin: 14px 0 0; font: 400 16px 'Poppins', sans-serif; }
  .hadir { font-size: 40px; margin-top: 64px; }
  .tagline { margin: 16px 0 0; font: 400 16px/1.5 'Poppins', sans-serif; opacity: 0.9; }
  .top-link { position: absolute; top: 28px; right: 32px; font: 700 16px 'Poppins', sans-serif; color: #fff; }
  .top-link:hover { text-decoration: underline; }

  .form-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 32px; }

  /* Tablet & HP: kembali ke tata letak mobile dari desain (lengkung gelap di atas) */
  @media (max-width: 860px) {
    .auth { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
    .brand { background: none; padding: 96px 16px 32px; min-height: 260px; }
    .arc { display: block; position: absolute; left: 50%; bottom: 0; width: max(419px, 110%); height: auto; transform: translateX(-50%); }
    .circles { width: 520px; left: -240px; top: -220px; }
    .hadir, .tagline { display: none; }
    .logo { font-size: 40px; }
    .form-area { padding: 24px 16px 48px; justify-content: flex-start; }
  }
</style>
