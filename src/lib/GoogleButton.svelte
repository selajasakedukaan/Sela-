<script>
  import { onMount } from 'svelte';
  import googleIcon from '../assets/auth/google.svg';
  import { loginWithGoogle, prepareGoogle, googleConfigured } from './auth.svelte.js';

  let { onsuccess, onerror } = $props();
  let busy = $state(false);
  let ready = $state(false);

  onMount(() => {
    prepareGoogle()
      .then(() => (ready = true))
      .catch((e) => onerror?.(e.message));
  });

  // Tidak async sebelum loginWithGoogle(), supaya popup tetap dianggap aksi pengguna.
  function go() {
    busy = true;
    loginWithGoogle()
      .then(() => onsuccess?.())
      .catch((e) => onerror?.(e.message))
      .finally(() => (busy = false));
  }
</script>

<button type="button" class="google" onclick={go} disabled={busy || (googleConfigured() && !ready)}>
  <span class="g"><img src={googleIcon} alt="" width="15.2" height="15.74" /></span>
  <span class="label">{busy ? 'Menghubungkan…' : 'Google'}</span>
</button>

<style>
  .google {
    width: 100%; display: flex; align-items: center; padding: 10px; cursor: pointer;
    background: #fff; border: 1px solid rgba(0, 0, 0, 0.27); border-radius: 10px;
    transition: background 0.15s, box-shadow 0.15s;
  }
  .google:hover:not(:disabled) { background: #f6f8fa; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08); }
  .google:disabled { opacity: 0.7; cursor: progress; }
  .g { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; }
  .g img { display: block; }
  .label { flex: 1; text-align: center; font: 500 18px 'Poppins', sans-serif; color: #000; }
</style>
