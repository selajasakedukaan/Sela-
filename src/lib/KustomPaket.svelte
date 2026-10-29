<script>
  import { religions, customization as c, basePrice, rupiah } from './packages.js';
  import { order, saveOrder } from './order.svelte.js';

  let { agama, paket } = $props();

  const religionName = $derived(religions.find((r) => r.id === agama)?.name ?? agama);
  const paketName = $derived(paket.charAt(0).toUpperCase() + paket.slice(1));
  const base = $derived(basePrice[paket] ?? 0);

  let selected = $state(Object.fromEntries(c.options.map((o) => [o.id, true])));
  let qty = $state(Object.fromEntries(c.options.flatMap((o) => o.qty ?? []).map((q) => [q.id, q.default])));

  const activeQty = $derived(c.options.filter((o) => selected[o.id]).flatMap((o) => o.qty ?? []));
  const allSelected = $derived(c.options.every((o) => selected[o.id]));

  function optionCost(o) {
    return (o.flat ?? 0) + (o.qty ?? []).reduce((sum, q) => sum + q.unit * qty[q.id], 0);
  }

  const subtotal = $derived(base + c.options.filter((o) => selected[o.id]).reduce((s, o) => s + optionCost(o), 0));
  const fee = $derived(Math.round(subtotal * c.serviceFee));
  const discount = $derived(allSelected ? c.bundleDiscount : 0);
  const total = $derived(subtotal + fee - discount);

  // Item yang dipesan beserta jumlahnya, untuk ringkasan & checklist pesanan.
  function buildItems() {
    const detail = (o) => {
      const qs = o.qty ?? [];
      const parts = qs.length === 1
        ? [`${qty[qs[0].id]} ${qs[0].unitName}`]
        : qs.map((q) => `${q.label} ${qty[q.id]}`);
      return [o.note, ...parts].filter(Boolean).join(' · ');
    };
    return [
      ...c.included.map((name) => ({ name, detail: '', optional: false })),
      ...c.options.filter((o) => selected[o.id]).map((o) => ({ name: o.name, detail: detail(o), optional: true }))
    ];
  }

  function step(q, dir) {
    qty[q.id] = Math.max(q.min ?? 0, qty[q.id] + dir * (q.step ?? 1));
  }
</script>

<div class="appbar">
  <div class="inner">
    <a href="#paket/{agama}" class="back" aria-label="Kembali ke pilih paket">←</a>
    <h1>Paket {paketName} · {religionName}</h1>
  </div>
</div>

<main>
  <div class="content">
    <section>
      <h2>Termasuk dalam paket</h2>
      <div class="card">
        {#each c.included as item}
          <div class="row">
            <span class="box locked" aria-hidden="true">✓</span>
            <span class="label">{item}</span>
          </div>
        {/each}
      </div>
    </section>

    <section>
      <h2>Opsional (tambahan)</h2>
      <div class="card">
        {#each c.options as o}
          <label class="row check">
            <input type="checkbox" bind:checked={selected[o.id]} />
            <span class="box" aria-hidden="true">✓</span>
            <span class="text">
              <span class="label">{o.name}</span>
              <span class="sub">{o.note ? `${o.note} · ` : ''}+ {rupiah(optionCost(o))}</span>
            </span>
          </label>
        {/each}
      </div>
    </section>

    {#if activeQty.length}
      <section>
        <h2>Penyesuaian</h2>
        <div class="card">
          {#each activeQty as q (q.id)}
            <div class="row">
              <span class="text">
                <span class="label">{q.label}</span>
                <span class="sub">{rupiah(q.unit)} / unit</span>
              </span>
              <button class="stepper" onclick={() => step(q, -1)} disabled={qty[q.id] <= (q.min ?? 0)} aria-label="Kurangi {q.label}">−</button>
              <span class="count" aria-live="polite">{qty[q.id]}</span>
              <button class="stepper" onclick={() => step(q, 1)} aria-label="Tambah {q.label}">+</button>
            </div>
          {/each}
        </div>
      </section>
    {/if}
  </div>

  <aside class="summary">
    <div class="line"><span>Harga paket + tambahan</span><span>{rupiah(subtotal)}</span></div>
    <div class="line"><span>Biaya layanan ({c.serviceFee * 100}%)</span><span>{rupiah(fee)}</span></div>
    {#if discount}
      <div class="line"><span>Potongan seluruh opsi paket</span><span class="minus">- {rupiah(discount)}</span></div>
    {:else}
      <p class="tip">Pilih semua opsi untuk potongan {rupiah(c.bundleDiscount)}.</p>
    {/if}
    <div class="line total"><span>Total</span><span>{rupiah(total)}</span></div>
    <a class="btn" href="#paket/{agama}/{paket}/alamat" onclick={() => { order.total = total; order.title = `${paketName} · ${religionName}`; order.items = buildItems(); saveOrder(); }}>LANJUT</a>
  </aside>
</main>

<style>
  .appbar { background: #fff; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25); }
  .appbar .inner { max-width: 1200px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 12px; }
  .back {
    font: 700 18px 'Nunito', sans-serif; width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center; border-radius: 50%;
  }
  .back:hover { background: rgba(15, 22, 30, 0.08); }
  h1 { font: 700 20px 'Montserrat', sans-serif; margin: 0; }

  main {
    max-width: 1200px; margin: 0 auto; padding: 32px 32px 64px;
    display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: start;
  }
  .content { display: flex; flex-direction: column; gap: 24px; }
  h2 { font: 700 15px 'Montserrat', sans-serif; margin: 0 0 12px; }

  .card {
    background: #fff; border: 1px solid #cfd2d3; border-radius: 8px;
    padding: 6px 16px; display: flex; flex-direction: column;
  }
  .row { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
  .row + .row { border-top: 1px solid rgba(15, 22, 30, 0.06); }
  .text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .label { flex: 1; font-size: 14px; font-weight: 700; letter-spacing: 0.3px; }
  .sub { font-size: 12px; font-weight: 600; color: rgba(15, 22, 30, 0.7); }

  .box {
    width: 20px; height: 20px; flex-shrink: 0; border: 1px solid #0f161e; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff; background: #f8fafb;
  }
  .box.locked { background: #5f5f60; }
  .check { cursor: pointer; }
  .check input { position: absolute; opacity: 0; pointer-events: none; }
  .check .box { color: transparent; transition: background 0.15s; }
  .check input:checked + .box { background: #0f161e; color: #fff; }
  .check input:focus-visible + .box { outline: 3px solid #0a62c7; outline-offset: 2px; }
  .check:hover .box { border-color: #0a62c7; }

  .stepper {
    width: 32px; height: 32px; border: 1px solid #0f161e; border-radius: 6px; background: #fff;
    font: 700 15px 'Nunito', sans-serif; color: #0f161e; cursor: pointer;
  }
  .stepper:hover:not(:disabled) { background: #0f161e; color: #fff; }
  .stepper:disabled { opacity: 0.35; cursor: not-allowed; }
  .count { width: 40px; text-align: center; font-size: 14px; font-weight: 700; }

  .summary {
    position: sticky; top: 90px;
    background: #fff; border: 1px solid #cfd2d3; border-radius: 8px;
    padding: 20px; display: flex; flex-direction: column; gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  .line { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; letter-spacing: 0.3px; }
  .line span:first-child { color: rgba(15, 22, 30, 0.7); }
  .minus { color: #f8160a; }
  .tip { margin: 0; font-size: 12px; font-weight: 600; color: #0a62c7; }
  .total { font: 600 16px 'Montserrat', sans-serif; padding-top: 12px; border-top: 1px solid rgba(15, 22, 30, 0.1); }
  .total span:first-child { color: #0f161e; }
  .btn {
    display: flex; justify-content: center; padding: 13px 16px; border-radius: 32px;
    background: #0f161e; color: #fff; font: 600 14px 'Montserrat', sans-serif; letter-spacing: 1px;
  }
  .btn:hover { background: #2a455a; }

  @media (max-width: 900px) {
    main { grid-template-columns: 1fr; padding: 20px 16px 0; }
    .summary {
      position: sticky; top: auto; bottom: 0; margin: 0 -16px;
      border-radius: 12px 12px 0 0; box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.12);
    }
  }
</style>
