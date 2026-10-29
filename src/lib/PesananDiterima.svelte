<script>
  import { order } from './order.svelte.js';
  import { rupiah } from './packages.js';
  import check from '../assets/check-circle.svg';
</script>

<main>
  <img class="check" src={check} alt="" width="72" height="72" />
  <h1>Pesanan diterima</h1>
  <p class="lead">Koordinator Sela akan menghubungi Anda dalam 15 menit dan mengatur seluruh vendor.</p>

  <div class="card">
    <div class="line"><span>No. pesanan</span><b>{order.orderNo}</b></div>
    <div class="line"><span>Paket</span><b>{order.title}</b></div>
    <div class="line"><span>Total dibayar</span><b>{rupiah(order.total + order.ongkir)}</b></div>
    <div class="line"><span>Metode</span><b>{order.method}</b></div>
  </div>

  <div class="actions">
    <a class="btn" href="#pesanan/{order.orderNo.replace('#', '')}">Lihat Status Pesanan</a>
    <a class="btn outline" href="#">Kembali ke Beranda</a>
  </div>
</main>

<style>
  main {
    max-width: 520px; margin: 0 auto; padding: 64px 24px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .check { display: block; margin-bottom: 20px; animation: pop 0.4s ease-out; }
  @keyframes pop { from { transform: scale(0.5); opacity: 0; } }
  h1 { font: 700 26px 'Montserrat', sans-serif; margin: 0 0 10px; }
  .lead { margin: 0 0 24px; font-size: 14px; font-weight: 600; letter-spacing: 0.3px; line-height: 1.5; color: rgba(15, 22, 30, 0.7); }

  .card {
    width: 100%; background: #fff; border: 1px solid #cfd2d3; border-radius: 8px; padding: 16px;
    display: flex; flex-direction: column; gap: 10px; text-align: left;
  }
  .line { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; letter-spacing: 0.3px; }
  .line span { font-weight: 600; color: rgba(15, 22, 30, 0.7); }

  .actions { width: 100%; margin-top: 40px; display: flex; flex-direction: column; gap: 10px; }
  .btn {
    display: flex; justify-content: center; padding: 13px 16px; border-radius: 32px;
    border: 1px solid rgba(15, 22, 30, 0.35); background: #0f161e; color: #fff;
    font: 600 14px 'Montserrat', sans-serif; transition: background 0.2s;
  }
  .btn:hover { background: #2a455a; }
  .btn.outline { background: #fff; color: #0f161e; }
  .btn.outline:hover { background: rgba(15, 22, 30, 0.06); }
</style>
