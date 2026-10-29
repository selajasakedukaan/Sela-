<script>
  import { orders } from './orders.svelte.js';
  import { COORDINATOR, waLink, telLink } from './contact.js';
  import avatar from '../assets/avatar.svg';
  import { normalizeItem } from './packages.js';

  let { no } = $props();

  const o = $derived(orders.find((x) => x.no === '#' + no));

  // Tahapan & status checklist nantinya diperbarui koordinator dari backend.
  const STAGES = ['Pesanan dikonfirmasi', 'Persiapan peralatan', 'Menuju rumah duka', 'Kegiatan berlangsung', 'Penutupan'];
  const stageIndex = $derived(o?.stage ?? 0);
  const time = (ts) => new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // Checklist = persis item yang dipesan (termasuk paket + opsi yang dipilih beserta jumlahnya).
  const checklist = $derived((o?.items ?? []).map(normalizeItem).map((it) => ({
    ...it,
    done: o?.doneItems?.includes(it.name) ?? false,
    status: o?.itemNotes?.[it.name] ?? 'Menunggu jadwal'
  })));

  const chat = $derived(waLink(`Halo ${COORDINATOR.name}, saya ingin bertanya tentang pesanan ${o?.no} (Paket ${o?.title}).`));
</script>

<div class="appbar">
  <div class="inner">
    <a href="#pesanan" class="back" aria-label="Kembali ke Pesanan Saya">←</a>
    <h1>Pesanan {o?.no ?? '#' + no}</h1>
  </div>
</div>

{#if !o}
  <main class="notfound">
    <p>Pesanan tidak ditemukan di perangkat ini.</p>
    <a class="btn-sm" href="#pesanan">Lihat Pesanan Saya</a>
  </main>
{:else}
  <main>
    <div class="col">
      <div class="coord">
        <img src={avatar} alt="" width="44" height="44" />
        <div class="who">
          <span class="sub">Koordinator Anda</span>
          <span class="name">{COORDINATOR.name}</span>
        </div>
        <a class="btn-sm" href={chat} target="_blank" rel="noopener">Chat</a>
        <a class="btn-sm" href={telLink()}>Telp</a>
      </div>

      <section>
        <h2>Timeline</h2>
        <ol class="card">
          {#each STAGES as s, i}
            {@const state = i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'todo'}
            <li class={state}>
              <span class="dot" aria-hidden="true"></span>
              <span class="label">{s}</span>
              <span class="meta">
                {#if state === 'done'}{o.stageTimes?.[i] ? time(o.stageTimes[i]) : 'Selesai'}
                {:else if state === 'current'}{i === 0 ? time(o.createdAt) : 'Sedang berlangsung'}
                {:else}Menunggu{/if}
              </span>
            </li>
          {/each}
        </ol>
      </section>
    </div>

    <section class="col">
      <h2>Checklist kebutuhan</h2>
      <ul class="card">
        {#each checklist as c}
          <li>
            <span class="box" class:checked={c.done} aria-label={c.done ? 'Selesai' : 'Belum'}>{c.done ? '✓' : ''}</span>
            <span class="text">
              <span class="label">{c.name}{#if c.optional}<span class="tag">Tambahan</span>{/if}</span>
              {#if c.detail}<span class="detail">{c.detail}</span>{/if}
              <span class="meta">{c.status}</span>
            </span>
          </li>
        {:else}
          <li class="meta">Belum ada item.</li>
        {/each}
      </ul>
    </section>
  </main>
{/if}

<style>
  .appbar { background: #fff; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25); }
  .appbar .inner { max-width: 1200px; margin: 0 auto; padding: 16px 32px; display: flex; align-items: center; gap: 12px; }
  .back { font: 700 18px 'Nunito', sans-serif; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
  .back:hover { background: rgba(15, 22, 30, 0.08); }
  h1 { font: 700 20px 'Montserrat', sans-serif; margin: 0; }
  h2 { font: 700 15px 'Montserrat', sans-serif; margin: 0 0 12px; }

  main {
    max-width: 1000px; margin: 0 auto; padding: 32px 32px 64px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;
  }
  .col { display: flex; flex-direction: column; gap: 24px; }
  .notfound { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; font-weight: 600; }

  .coord {
    display: flex; align-items: center; gap: 12px; padding: 14px;
    background: #fff; border: 1px solid rgba(15, 22, 30, 0.35); border-radius: 8px;
  }
  .who { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .sub { font-size: 11px; font-weight: 600; letter-spacing: 0.26px; color: rgba(15, 22, 30, 0.7); }
  .name { font: 600 15px 'Montserrat', sans-serif; }
  .btn-sm {
    padding: 8px 14px; border: 1px solid rgba(15, 22, 30, 0.35); border-radius: 4px; background: #fff;
    font-size: 12px; font-weight: 700; letter-spacing: 0.3px; transition: background 0.2s, color 0.2s;
  }
  .btn-sm:hover { background: #0f161e; color: #fff; }

  .card {
    margin: 0; padding: 4px 16px; list-style: none;
    background: #fff; border: 1px solid #cfd2d3; border-radius: 8px;
  }
  li { display: flex; align-items: center; gap: 10px; padding: 11px 0; }
  li + li { border-top: 1px solid rgba(15, 22, 30, 0.06); }
  .label { flex: 1; font-size: 13px; font-weight: 700; letter-spacing: 0.3px; }
  .meta { font-size: 11px; font-weight: 600; letter-spacing: 0.26px; color: rgba(15, 22, 30, 0.7); }

  .dot { width: 16px; height: 16px; flex-shrink: 0; border-radius: 50%; border: 1px solid #0f161e; background: #fff; }
  .done .dot { background: #0f161e; }
  .current .dot { background: #777; animation: pulse 1.6s infinite; }
  .todo .label { font-weight: 600; color: rgba(15, 22, 30, 0.7); }
  @keyframes pulse { 50% { box-shadow: 0 0 0 4px rgba(119, 119, 119, 0.25); } }

  .text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .box {
    width: 20px; height: 20px; flex-shrink: 0; border: 1px solid #0f161e; border-radius: 4px; background: #fff;
    display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700;
  }
  .box.checked { background: #0f161e; }
  .detail { font-size: 12px; font-weight: 600; color: #0f161e; }
  .tag {
    margin-left: 8px; padding: 1px 8px; border-radius: 999px; vertical-align: 1px;
    font-size: 10px; font-weight: 700; background: rgba(10, 98, 199, 0.1); color: #0a62c7;
  }

  @media (max-width: 800px) {
    main { grid-template-columns: 1fr; padding: 20px 16px 40px; gap: 24px; }
  }
</style>
