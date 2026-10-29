<script>
  import { order, saveOrder } from './order.svelte.js';
  import { rupiah, normalizeItem } from './packages.js';
  import { addOrder } from './orders.svelte.js';
  import { notify } from './notifications.svelte.js';
  import dana from '../assets/pay-dana.png';
  import qris from '../assets/pay-qris.png';
  import gopay from '../assets/pay-gopay.png';
  import bca from '../assets/pay-bca.png';

  let { agama, paket } = $props();

  // Posisi crop logo mengikuti desain Figma (gambar sumber berupa sprite).
  const methods = [
    { id: 'DANA', logo: dana, label: 56, box: 'left:-17px;top:-1px;width:81px;height:54px', img: 'inset:0;width:100%;height:100%;object-fit:cover' },
    { id: 'QRIS', logo: qris, label: 60, box: 'left:-5px;top:0;width:47px;height:66px', img: 'left:0;top:-65.71%;width:300%;height:214.29%' },
    { id: 'GOPAY', logo: gopay, label: 52, box: 'left:-15px;top:-10px;width:67px;height:79px', img: 'left:0;top:-106.25%;width:362.96%;height:306.25%' },
    { id: 'BCA', logo: bca, label: 62.5, box: 'left:-5px;top:-5px;width:57px;height:57px', img: 'left:-0.36%;top:5%;width:306.98%;height:95%' }
  ];

  const totalBayar = $derived(order.total + order.ongkir);
  let processing = $state(false);
  let error = $state('');

  function pay() {
    if (!order.method) {
      error = 'Pilih metode pembayaran terlebih dahulu.';
      return;
    }
    processing = true;
    // Simulasi pembayaran — ganti dengan integrasi payment gateway (mis. Midtrans/Xendit).
    setTimeout(() => {
      order.orderNo = '#SELA-' + String(Math.floor(Math.random() * 9000) + 1000);
      addOrder({ no: order.orderNo, title: order.title, total: order.total + order.ongkir, method: order.method, items: order.items });
      notify({ title: 'Pembayaran berhasil', body: `${rupiah(order.total + order.ongkir)} via ${order.method}.`, href: `#pesanan/${order.orderNo.slice(1)}` });
      notify({ title: 'Pesanan diterima', body: `${order.orderNo} · Koordinator akan menghubungi Anda dalam 15 menit.`, href: `#pesanan/${order.orderNo.slice(1)}` });
      saveOrder();
      location.hash = `#paket/${agama}/${paket}/selesai`;
    }, 1200);
  }
</script>

<div class="appbar">
  <div class="inner">
    <a href="#paket/{agama}/{paket}/alamat" class="back" aria-label="Kembali">←</a>
    <h1>Pembayaran</h1>
  </div>
</div>

<main>
  <section>
    <h2>Ringkasan pesanan</h2>
    <div class="card">
      <p class="title">Paket {order.title}</p>
      <ul>
        {#each order.items.map(normalizeItem) as item}
          <li>{item.name}{#if item.optional} (opsional){/if}{#if item.detail}<span class="detail">{item.detail}</span>{/if}</li>
        {/each}
      </ul>
      <div class="divider"></div>
      <div class="line"><span>Total paket</span><b>{rupiah(order.total)}</b></div>
      <div class="line"><span>Ongkir</span><b>{rupiah(order.ongkir)}</b></div>
      <div class="line grand"><span>Total bayar</span><span>{rupiah(totalBayar)}</span></div>
    </div>
    {#if order.contact.nama}
      <div class="card contact">
        <p class="title">Dikirim ke</p>
        <p>{order.contact.nama} · {order.contact.telp}</p>
        <p class="muted">{order.contact.alamat}</p>
      </div>
    {/if}
  </section>

  <section>
    <h2 id="metode">Metode Pembayaran</h2>
    <div class="methods" role="radiogroup" aria-labelledby="metode">
      {#each methods as m}
        <label class="method" class:active={order.method === m.id}>
          <input type="radio" name="method" value={m.id} bind:group={order.method} onchange={() => { error = ''; saveOrder(); }} />
          <span class="logo" style={m.box}><img src={m.logo} alt="" style={m.img} /></span>
          <span class="name" style:left="{m.label}px">{m.id}</span>
        </label>
      {/each}
    </div>
    {#if error}<p class="err" role="alert">{error}</p>{/if}
    <p class="privacy">Data keluarga dijaga kerahasiaannya.</p>
    <button class="btn" onclick={pay} disabled={processing}>
      {processing ? 'Memproses…' : `BAYAR ${rupiah(totalBayar)}`}
    </button>
  </section>
</main>

<style>
  .appbar { background: #fff; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25); }
  .appbar .inner { max-width: 1200px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 12px; }
  .back { font: 700 18px 'Nunito', sans-serif; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
  .back:hover { background: rgba(15, 22, 30, 0.08); }
  h1 { font: 700 20px 'Montserrat', sans-serif; margin: 0; }
  h2 { font: 700 15px 'Montserrat', sans-serif; margin: 0 0 12px; }

  main {
    max-width: 1000px; margin: 0 auto; padding: 32px 32px 64px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;
  }
  section { display: flex; flex-direction: column; }

  .card {
    background: #fff; border: 1px solid #cfd2d3; border-radius: 8px; padding: 16px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .card + .card { margin-top: 16px; }
  .title { margin: 0; font: 600 15px 'Montserrat', sans-serif; }
  ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
  li { font-size: 13px; font-weight: 600; letter-spacing: 0.3px; color: rgba(15, 22, 30, 0.7); }
  li::before { content: '✓'; margin-right: 8px; color: #0f161e; }
  .detail { display: block; margin: 2px 0 0 20px; font-size: 12px; color: #0f161e; }
  .divider { height: 1px; background: rgba(15, 22, 30, 0.1); margin: 4px 0; }
  .line { display: flex; justify-content: space-between; font-size: 13px; letter-spacing: 0.3px; }
  .line span:first-child { font-weight: 600; color: rgba(15, 22, 30, 0.7); }
  .grand { font: 700 16px 'Montserrat', sans-serif; }
  .grand span:first-child { color: #0f161e; }
  .contact p { margin: 0; font-size: 13px; font-weight: 600; }
  .contact .muted { color: rgba(15, 22, 30, 0.7); font-size: 12px; }

  .methods { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .method {
    position: relative; height: 51px; overflow: hidden; cursor: pointer;
    background: #fff; border: 1px solid #cfd2d3; border-radius: 4px;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .method:hover { border-color: rgba(15, 22, 30, 0.5); }
  .method.active { background: rgba(15, 22, 30, 0.1); border-color: rgba(15, 22, 30, 0.35); box-shadow: inset 0 0 0 1px #0f161e; }
  .method input { position: absolute; opacity: 0; pointer-events: none; }
  .method:has(input:focus-visible) { outline: 3px solid #0a62c7; outline-offset: 2px; }
  .logo { position: absolute; overflow: hidden; pointer-events: none; }
  .logo img { position: absolute; max-width: none; }
  .name { position: absolute; top: 16px; font: 600 14px 'Montserrat', sans-serif; }

  .err { margin: 10px 0 0; font-size: 12px; font-weight: 600; color: #f44336; }
  .privacy { margin: 16px 0; text-align: center; font-size: 12px; font-weight: 600; color: rgba(15, 22, 30, 0.7); }
  .btn {
    padding: 14px 16px; border: 0; border-radius: 32px; background: #0f161e; color: #fff; cursor: pointer;
    font: 600 14px 'Montserrat', sans-serif; letter-spacing: 0.5px;
  }
  .btn:hover:not(:disabled) { background: #2a455a; }
  .btn:disabled { opacity: 0.7; cursor: progress; }

  @media (max-width: 800px) {
    main { grid-template-columns: 1fr; gap: 24px; padding: 20px 16px 40px; }
  }
</style>
