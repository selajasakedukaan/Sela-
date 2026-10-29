<script>
  let { order } = $props();
  const done = $derived(order.status === 'Selesai');
</script>

<a class="card" href="#pesanan/{order.no.replace('#', '')}">
  <div class="row">
    <span class="oid">{order.no}</span>
    <span class="status" class:done>{order.status}</span>
  </div>
  <p class="title">Paket {order.title}</p>
  <p class="sub">{order.step}</p>
  <span class="link">Lihat status →</span>
</a>

<style>
  .card {
    display: block; background: #fff; padding: 14px;
    border: 1px solid #cfd2d3; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18); }
  .row { display: flex; justify-content: space-between; font-size: 13px; letter-spacing: 0.3px; }
  .oid { font-weight: 600; color: rgba(15, 22, 30, 0.7); }
  .status { font-weight: 700; color: #43a047; }
  .status.done { color: #2a455a; }
  .title { font: 600 14px 'Montserrat', sans-serif; margin: 8px 0 6px; }
  .sub { font-size: 12px; font-weight: 600; color: rgba(15, 22, 30, 0.7); margin: 0 0 8px; }
  .link { font-size: 12px; font-weight: 700; color: #0a62c7; }
</style>
