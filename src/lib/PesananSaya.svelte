<script>
  import { orders } from './orders.svelte.js';
  import OrderCard from './OrderCard.svelte';
  import emptyBox from '../assets/empty-box.png';

  let tab = $state('berlangsung');
  const list = $derived(orders.filter((o) => (tab === 'selesai') === (o.status === 'Selesai')));
</script>

<main>
  <h1>Pesanan Saya</h1>

  <div class="tabs" role="tablist">
    <button role="tab" aria-selected={tab === 'berlangsung'} class:active={tab === 'berlangsung'} onclick={() => (tab = 'berlangsung')}>Berlangsung</button>
    <button role="tab" aria-selected={tab === 'selesai'} class:active={tab === 'selesai'} onclick={() => (tab = 'selesai')}>Terselesaikan</button>
  </div>

  {#if list.length}
    <div class="list">
      {#each list as o (o.no)}<OrderCard order={o} />{/each}
    </div>
  {:else}
    <div class="empty">
      <img src={emptyBox} alt="" width="238" height="336" />
      <p>
        {#if tab === 'selesai'}
          Untuk pesanan yang telah terselesaikan masih kosong! Order pengguna yang sedang berlangsung akan dikategorikan ke sini.
        {:else}
          Belum ada pesanan yang sedang berlangsung. Pilih layanan di beranda untuk mulai memesan.
        {/if}
      </p>
      {#if tab === 'berlangsung'}<a class="btn" href="#">Pilih Layanan</a>{/if}
    </div>
  {/if}
</main>

<style>
  main { max-width: 900px; margin: 0 auto; padding: 40px 32px 64px; }
  h1 { font: 700 26px 'Montserrat', sans-serif; text-align: center; margin: 0 0 28px; }

  .tabs {
    display: grid; grid-template-columns: 1fr 1fr; max-width: 420px; margin: 0 auto 28px;
    background: #fff; border: 1px solid #00ffac; border-radius: 10px; overflow: hidden;
  }
  .tabs button {
    height: 40px; border: 0; border-radius: 10px; background: transparent; cursor: pointer;
    font: 700 15px 'Inter', 'Montserrat', sans-serif; letter-spacing: 0.75px; color: #504e4e;
    transition: background 0.2s, color 0.2s;
  }
  .tabs button:hover:not(.active) { background: rgba(42, 69, 90, 0.08); }
  .tabs button.active { background: #2a455a; color: #fff; box-shadow: 0 0 0 1px #184601; }
  .tabs button:focus-visible { outline: 3px solid #0a62c7; outline-offset: -3px; }

  .list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }

  .empty { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .empty img { width: 238px; height: auto; opacity: 0.5; margin-bottom: -30px; }
  .empty p { max-width: 380px; margin: 0 0 20px; font-size: 14px; letter-spacing: 0.3px; line-height: 1.5; color: rgba(15, 22, 30, 0.7); }
  .btn { padding: 12px 28px; border-radius: 32px; background: #0f161e; color: #fff; font: 600 14px 'Montserrat', sans-serif; }
  .btn:hover { background: #2a455a; }

  @media (max-width: 480px) {
    main { padding: 24px 16px 40px; }
    h1 { font-size: 20px; }
    .list { grid-template-columns: 1fr; }
  }
</style>
