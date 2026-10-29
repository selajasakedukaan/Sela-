<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import markerIcon from 'leaflet/dist/images/marker-icon.png';
  import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
  import markerShadow from 'leaflet/dist/images/marker-shadow.png';

  // onpick({ lat, lng, address }) dipanggil setiap lokasi berubah
  let { lat = null, lng = null, onpick } = $props();

  const NOMINATIM = 'https://nominatim.openstreetmap.org';
  const icon = L.icon({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

  let el;
  let map, marker;
  let query = $state('');
  let results = $state([]);
  let status = $state('');
  let timer;

  onMount(() => {
    const start = lat != null ? [lat, lng] : [-6.2, 106.816]; // default: Jakarta
    map = L.map(el).setView(start, lat != null ? 16 : 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    if (lat != null) placeMarker(lat, lng);
    map.on('click', (e) => pick(e.latlng.lat, e.latlng.lng));
    return () => map.remove();
  });

  function placeMarker(la, ln) {
    if (!marker) {
      marker = L.marker([la, ln], { draggable: true, icon }).addTo(map);
      marker.on('dragend', () => {
        const p = marker.getLatLng();
        pick(p.lat, p.lng);
      });
    } else marker.setLatLng([la, ln]);
  }

  async function pick(la, ln, address) {
    placeMarker(la, ln);
    map.setView([la, ln], Math.max(map.getZoom(), 16));
    if (address === undefined) {
      status = 'Mencari alamat…';
      try {
        const r = await fetch(`${NOMINATIM}/reverse?format=json&lat=${la}&lon=${ln}&accept-language=id`);
        address = (await r.json()).display_name ?? '';
        status = '';
      } catch {
        status = 'Alamat tidak ditemukan, silakan isi manual.';
      }
    }
    onpick?.({ lat: la, lng: ln, address });
  }

  // Alamat Indonesia ("Jl. X No. 5, RT 02/RW 03, Kel. Y") sering tidak dikenali
  // geocoder, jadi singkatan dirapikan dan nomor rumah / RT-RW dibuang.
  function normalize(text) {
    return text
      .replace(/\bjl\.?\s*/gi, 'Jalan ')
      .replace(/\bgg\.?\s*/gi, 'Gang ')
      .replace(/\b(kel|kec|kab)\.\s*/gi, '')
      .replace(/\b(kelurahan|kecamatan|kabupaten|kota)\s+/gi, '')
      .replace(/\bno\.?\s*\d+\w*/gi, '')
      .replace(/\brt\.?\s*\/?\s*rw\.?\s*[\d\s/]+|\br[tw]\.?\s*\d+/gi, '')
      .replace(/\b\d{5}\b/g, '')
      .split(',').map((s) => s.trim()).filter((s) => /[a-z]/i.test(s));
  }

  async function lookup(text, limit = 5) {
    const parts = normalize(text);
    // coba alamat lengkap, lalu buang bagian depan satu per satu sampai ketemu
    for (let i = 0; i < Math.max(parts.length, 1); i++) {
      const q = parts.slice(i).join(', ') || text;
      const r = await fetch(`${NOMINATIM}/search?format=json&limit=${limit}&countrycodes=id&accept-language=id&q=${encodeURIComponent(q)}`);
      const data = await r.json();
      if (data.length) return data;
    }
    return [];
  }

  let searching = $state(false);
  let seq = 0;

  async function runSearch() {
    const id = ++seq;
    searching = true;
    try {
      const data = await lookup(query);
      if (id !== seq) return;
      results = data;
      status = data.length ? '' : 'Lokasi tidak ditemukan. Coba kata kunci lain atau klik peta.';
    } catch {
      if (id === seq) status = 'Gagal mencari lokasi. Periksa koneksi internet.';
    } finally {
      if (id === seq) searching = false;
    }
  }

  function search() {
    clearTimeout(timer);
    if (query.trim().length < 3) { results = []; return; }
    timer = setTimeout(runSearch, 500);
  }

  async function onkeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault(); // jangan submit form
      clearTimeout(timer);
      if (results.length) choose(results[0]);
      else if (query.trim().length >= 3) {
        await runSearch();
        if (results.length) choose(results[0]);
      }
    } else if (e.key === 'Escape') results = [];
  }

  function choose(r) {
    results = [];
    query = '';
    status = '';
    pick(+r.lat, +r.lon, r.display_name);
  }

  // Dipanggil dari kolom Alamat: pindahkan pin tanpa menimpa teks alamat.
  export async function locate(text) {
    if (!text || text.trim().length < 5) return;
    const id = ++seq;
    status = 'Mencari lokasi alamat…';
    try {
      const [r] = await lookup(text, 1);
      if (id !== seq) return;
      if (!r) { status = 'Alamat belum ditemukan di peta. Geser pin ke lokasi yang tepat.'; return; }
      status = '';
      placeMarker(+r.lat, +r.lon);
      map.setView([+r.lat, +r.lon], 17);
      onpick?.({ lat: +r.lat, lng: +r.lon, address: null });
    } catch {
      if (id === seq) status = '';
    }
  }

  export function useCurrentLocation() {
    if (!navigator.geolocation) { status = 'Browser tidak mendukung lokasi.'; return; }
    status = 'Mengambil lokasi…';
    navigator.geolocation.getCurrentPosition(
      (p) => pick(p.coords.latitude, p.coords.longitude),
      () => (status = 'Izin lokasi ditolak. Cari alamat atau klik peta.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
</script>

<div class="picker">
  <div class="search">
    <input type="search" placeholder="Cari lokasi rumah duka / rumah…" bind:value={query} oninput={search} {onkeydown} aria-label="Cari lokasi" autocomplete="off" />
    {#if searching}<span class="spin">Mencari…</span>{/if}
    {#if results.length}
      <ul>
        {#each results as r}
          <li><button type="button" onclick={() => choose(r)}>{r.display_name}</button></li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="map" bind:this={el}></div>
  <p class="hint">
    {#if status}{status}{:else}Klik peta atau geser pin untuk menandai lokasi.{/if}
    {#if lat != null}
      · <a href="https://www.google.com/maps?q={lat},{lng}" target="_blank" rel="noopener">Buka di Google Maps ↗</a>
    {/if}
  </p>
</div>

<style>
  .picker { display: flex; flex-direction: column; gap: 8px; }
  .search { position: relative; }
  .search input {
    width: 100%; padding: 12px; border: 1px solid #cfd2d3; border-radius: 4px;
    font: 600 13px 'Nunito', sans-serif; letter-spacing: 0.3px;
  }
  .spin { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 12px; font-weight: 600; color: rgba(15, 22, 30, 0.5); }
  .search input:focus { outline: 2px solid #0a62c7; border-color: transparent; }
  ul {
    position: absolute; z-index: 1000; left: 0; right: 0; top: calc(100% + 4px);
    margin: 0; padding: 4px 0; list-style: none; background: #fff;
    border: 1px solid #cfd2d3; border-radius: 6px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  li button {
    width: 100%; text-align: left; padding: 10px 12px; border: 0; background: none; cursor: pointer;
    font: 600 12px 'Nunito', sans-serif; color: #0f161e;
  }
  li button:hover { background: rgba(10, 98, 199, 0.08); }
  .map { height: 300px; border: 1px solid #212121; z-index: 0; }
  .hint { margin: 0; font-size: 12px; font-weight: 600; color: rgba(15, 22, 30, 0.7); }
  .hint a { color: #0a62c7; font-weight: 700; }
</style>
