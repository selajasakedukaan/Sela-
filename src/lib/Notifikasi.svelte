<script>
  import { notifications, markRead, markAllRead, unreadCount } from './notifications.svelte.js';
  import emptyBox from '../assets/empty-box.png';

  const time = (ts) => {
    const d = new Date(ts);
    const today = new Date().toDateString() === d.toDateString();
    return today
      ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  function open(n) {
    markRead(n.id);
    if (n.href) location.hash = n.href;
  }
</script>

<main>
  <h1>Notifikasi</h1>

  {#if notifications.length}
    <div class="toolbar">
      <span>{unreadCount()} belum dibaca</span>
      {#if unreadCount()}<button class="link" onclick={markAllRead}>Tandai semua dibaca</button>{/if}
    </div>
    <ul class="card">
      {#each notifications as n (n.id)}
        <li>
          <button class="item" class:unread={!n.read} onclick={() => open(n)}>
            <span class="dot" aria-label={n.read ? 'Sudah dibaca' : 'Belum dibaca'}></span>
            <span class="text">
              <span class="title">{n.title}</span>
              <span class="body">{n.body}</span>
            </span>
            <span class="time">{time(n.at)}</span>
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="empty">
      <img src={emptyBox} alt="" width="238" height="336" />
      <p>Belum ada notifikasi. Kabar terbaru tentang pesanan Anda akan muncul di sini.</p>
    </div>
  {/if}
</main>

<style>
  main { max-width: 720px; margin: 0 auto; padding: 40px 32px 48px; }
  h1 { font: 700 26px 'Montserrat', sans-serif; text-align: center; margin: 0 0 28px; }

  .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 12px; font-weight: 600; color: rgba(15, 22, 30, 0.7); }
  .link { border: 0; background: none; cursor: pointer; font: 700 12px 'Nunito', sans-serif; color: #0a62c7; }
  .link:hover { text-decoration: underline; }

  .card {
    margin: 0; padding: 4px 16px; list-style: none; background: #fff;
    border: 1px solid #cfd2d3; border-radius: 8px; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }
  li + li { border-top: 1px solid rgba(15, 22, 30, 0.1); }
  .item {
    width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px 4px;
    border: 0; background: none; text-align: left; cursor: pointer; border-radius: 6px;
    font-family: 'Nunito', sans-serif; color: #0f161e;
  }
  .item:hover { background: rgba(15, 22, 30, 0.04); }
  .item:focus-visible { outline: 3px solid #0a62c7; }
  .dot { width: 10px; height: 10px; flex-shrink: 0; border-radius: 50%; border: 1px solid #0f161e; background: #fff; }
  .unread .dot { background: #0f161e; }
  .text { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .title { font-size: 14px; font-weight: 700; letter-spacing: 0.3px; }
  .body { font-size: 12px; font-weight: 600; letter-spacing: 0.3px; color: rgba(15, 22, 30, 0.7); }
  .time { font-size: 11px; font-weight: 600; color: rgba(15, 22, 30, 0.7); white-space: nowrap; }

  .empty { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .empty img { width: 220px; height: auto; opacity: 0.5; margin-bottom: -30px; }
  .empty p { max-width: 360px; font-size: 14px; line-height: 1.5; color: rgba(15, 22, 30, 0.7); }

  @media (max-width: 480px) {
    main { padding: 24px 16px 32px; }
    h1 { font-size: 20px; }
  }
</style>
