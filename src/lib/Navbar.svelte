<script>
  import dashboard from '../assets/nav-dashboard.svg';
  import pesanan from '../assets/nav-pengumuman.svg';
  import notifikasi from '../assets/nav-tugas.svg';
  import profil from '../assets/nav-profil.svg';

  import { unreadCount } from './notifications.svelte.js';
  import { auth } from './auth.svelte.js';

  let { current = '' } = $props();

  const items = [
    { label: 'Dashboard', icon: dashboard, href: '#', match: (h) => !h || h === '#' || h.startsWith('#paket') },
    { label: 'Pesanan Saya', icon: pesanan, href: '#pesanan', match: (h) => h.startsWith('#pesanan') },
    { label: 'Notifikasi', icon: notifikasi, href: '#notifikasi', match: (h) => h.startsWith('#notifikasi') },
    { label: 'Profil', icon: profil, href: '#profil', match: (h) => h.startsWith('#profil') }
  ];
</script>

<header>
  <div class="inner">
    <a class="brand" href="#">Sela</a>
    <nav>
      {#each items.filter((i) => i.label !== 'Profil' || auth.user) as item}
        {@const active = item.match(current)}
        <a href={item.href} class:active aria-current={active ? 'page' : undefined} aria-label={item.label}>
          <span class="icon">
            <img src={item.icon} alt="" />
            {#if item.label === 'Notifikasi' && unreadCount()}<span class="badge" aria-label="{unreadCount()} belum dibaca">{unreadCount()}</span>{/if}
          </span>
          <span class="label">{item.label}</span>
        </a>
      {/each}
    </nav>
    {#if !auth.user}<a class="login" href="#masuk">Masuk</a>{/if}
  </div>
</header>

<style>
  header {
    position: sticky; top: 0; z-index: 10;
    background: #2a455a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  .inner {
    max-width: 1200px; margin: 0 auto; padding: 10px 32px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .brand { font: 700 26px 'Bodoni Moda', serif; color: #fff; letter-spacing: 1.5px; }
  .login { margin-left: 12px; padding: 8px 20px; border-radius: 32px; background: #fff; color: #2a455a; font: 600 14px 'Montserrat', sans-serif; white-space: nowrap; }
  .login:hover { background: #e6eef4; }
  .inner nav { margin-left: auto; }
  nav { display: flex; gap: 8px; }
  nav a {
    display: flex; align-items: center; gap: 2px;
    padding: 2px 18px 2px 0; border-radius: 32px;
    font: 600 14px 'Montserrat', sans-serif; color: rgba(255, 255, 255, 0.85);
    transition: background 0.2s;
  }
  nav a:hover { background: rgba(255, 255, 255, 0.1); }
  nav a.active { background: rgba(255, 255, 255, 0.18); color: #fff; }
  .icon { display: flex; align-items: center; justify-content: center; width: 73px; height: 40px; }
  .icon { position: relative; }
  .icon img { display: block; }
  .badge {
    position: absolute; top: 2px; right: 14px; min-width: 18px; height: 18px; padding: 0 5px;
    border-radius: 9px; background: #f44336; color: #fff;
    font: 700 11px/18px 'Nunito', sans-serif; text-align: center;
  }
  @media (max-width: 860px) {
    .inner { padding: 8px 16px; }
    nav { gap: 0; }
    nav a { padding: 0; }
    .label { display: none; }
  }
</style>
