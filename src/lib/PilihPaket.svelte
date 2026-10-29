<script>
  import { religions, packages } from './packages.js';

  let { agama } = $props();
  const list = $derived(packages[agama] ?? []);

  function changeReligion(e) {
    location.hash = `#paket/${e.currentTarget.value}`;
  }
</script>

<div class="appbar">
  <div class="inner">
    <a href="#" class="back" aria-label="Kembali ke dashboard">←</a>
    <h1>Pilih Paket</h1>
  </div>
</div>

<main>
  <div class="body">
    <div class="filter">
      <label for="agama">Agama</label>
      <div class="select">
        <select id="agama" value={agama} onchange={changeReligion}>
          {#each religions as r}
            <option value={r.id}>{r.name}</option>
          {/each}
        </select>
        <span aria-hidden="true">▾</span>
      </div>
      <p class="hint">Muslim: Basic / Standard / Premium · Kristen &amp; Hindu: Standard / Premium</p>
    </div>

    {#if list.length}
      <div class="grid">
        {#each list as p}
          <article class="pkg" class:unavailable={!p.available}>
            <header>
              <h2>{p.name}</h2>
              <span class="price">{p.price}</span>
            </header>
            <ul>
              {#each p.items as item}<li>{item}</li>{/each}
            </ul>
            {#if p.available}
              <a class="btn" href="#paket/{agama}/{p.name.toLowerCase()}">Lihat Detail</a>
            {:else}
              <span class="btn soon" aria-disabled="true">Segera Hadir</span>
            {/if}
          </article>
        {/each}
      </div>
    {:else}
      <p class="empty">Paket untuk agama ini belum tersedia.</p>
    {/if}
  </div>
</main>

<style>
  .appbar { background: #fff; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25); }
  .appbar .inner {
    max-width: 1200px; margin: 0 auto; padding: 16px 32px;
    display: flex; align-items: center; gap: 12px;
  }
  .back {
    font: 700 18px 'Nunito', sans-serif; width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center; border-radius: 50%;
    transition: background 0.2s;
  }
  .back:hover { background: rgba(15, 22, 30, 0.08); }
  h1 { font: 700 20px 'Montserrat', sans-serif; margin: 0; }

  main { max-width: 1200px; margin: 0 auto; padding: 32px 32px 64px; }
  .body {
    background: #fff; border-radius: 8px; box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    padding: 24px; display: flex; flex-direction: column; gap: 20px;
  }

  .filter { display: flex; flex-direction: column; gap: 10px; max-width: 420px; }
  label { font-size: 12px; font-weight: 700; letter-spacing: 0.3px; color: rgba(15, 22, 30, 0.7); }
  .select { position: relative; }
  select {
    appearance: none; width: 100%; padding: 12px 36px 12px 12px;
    border: 1px solid rgba(15, 22, 30, 0.35); border-radius: 4px; background: #fff;
    font: 600 14px 'Montserrat', sans-serif; color: #0f161e; cursor: pointer;
  }
  select:focus-visible { outline: 3px solid #0a62c7; outline-offset: 1px; }
  .select span { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-weight: 700; pointer-events: none; }
  .hint { margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 0.26px; color: rgba(15, 22, 30, 0.7); }

  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
  .pkg {
    display: flex; flex-direction: column; gap: 8px; padding: 18px;
    border: 1px solid rgba(15, 22, 30, 0.35); border-radius: 8px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .pkg:not(.unavailable):hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12); }
  header {
    display: flex; align-items: baseline; gap: 12px;
    padding-bottom: 10px; border-bottom: 1px solid rgba(15, 22, 30, 0.1);
  }
  h2 { flex: 1; margin: 0; font: 700 19px 'Montserrat', sans-serif; }
  .price { font-size: 13px; font-weight: 700; letter-spacing: 0.3px; color: rgba(15, 22, 30, 0.7); white-space: nowrap; }
  ul { margin: 4px 0 8px; padding-left: 18px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
  li { font-size: 13px; font-weight: 600; letter-spacing: 0.3px; }

  .btn {
    display: flex; align-items: center; justify-content: center; padding: 13px 16px;
    border: 1px solid rgba(15, 22, 30, 0.35); border-radius: 32px; background: #fff;
    font: 600 14px 'Montserrat', sans-serif; transition: background 0.2s, color 0.2s;
  }
  a.btn:hover { background: #0f161e; color: #fff; }
  .btn.soon { background: #fbe1e1; color: #f44336; cursor: not-allowed; }
  .empty { margin: 0; font-weight: 600; color: rgba(15, 22, 30, 0.7); }

  @media (max-width: 480px) {
    .appbar .inner { padding: 12px 16px; }
    main { padding: 20px 14px 40px; }
    .body { padding: 16px; gap: 14px; }
    .grid { grid-template-columns: 1fr; gap: 14px; }
  }
</style>
