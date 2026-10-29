<script>
  import Navbar from './lib/Navbar.svelte';
  import Background from './lib/Background.svelte';
  import Dashboard from './lib/Dashboard.svelte';
  import PilihPaket from './lib/PilihPaket.svelte';
  import KustomPaket from './lib/KustomPaket.svelte';
  import AlamatKontak from './lib/AlamatKontak.svelte';
  import Pembayaran from './lib/Pembayaran.svelte';
  import PesananDiterima from './lib/PesananDiterima.svelte';
  import PesananSaya from './lib/PesananSaya.svelte';
  import DetailPesanan from './lib/DetailPesanan.svelte';
  import Notifikasi from './lib/Notifikasi.svelte';
  import Profil from './lib/Profil.svelte';
  import Masuk from './lib/Masuk.svelte';
  import Daftar from './lib/Daftar.svelte';

  let hash = $state(location.hash);
  $effect(() => {
    const onChange = () => { hash = location.hash; window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  });

  const route = $derived(hash.match(/^#paket\/(\w+)(?:\/(\w+))?(?:\/(\w+))?/));
</script>

{#if hash.startsWith('#masuk')}
  <Masuk />
{:else if hash.startsWith('#daftar')}
  <Daftar />
{:else}
<div class="shell">
  <Navbar current={hash} />

  <div class="content">
    {#if route?.[3] === 'bayar'}
      <Pembayaran agama={route[1]} paket={route[2]} />
    {:else if route?.[3] === 'selesai'}
      <PesananDiterima />
    {:else if route?.[3] === 'alamat'}
      <AlamatKontak agama={route[1]} paket={route[2]} />
    {:else if route?.[2]}
      {#key hash}<KustomPaket agama={route[1]} paket={route[2]} />{/key}
    {:else if /^#pesanan\/[\w-]+/.test(hash)}
      <DetailPesanan no={hash.split('/')[1]} />
    {:else if hash.startsWith('#pesanan')}
      <PesananSaya />
    {:else if hash.startsWith('#notifikasi')}
      <Notifikasi />
    {:else if hash.startsWith('#profil')}
      <Profil />
    {:else if route}
      <PilihPaket agama={route[1]} />
    {:else}
      <Dashboard />
    {/if}
  </div>

  <Background />
</div>
{/if}

<style>
  .shell { min-height: 100vh; display: flex; flex-direction: column; }
  .content { flex: 1; }
</style>
