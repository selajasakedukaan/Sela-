<script>
  import AuthLayout from './AuthLayout.svelte';
  import AuthField from './AuthField.svelte';
  import GoogleButton from './GoogleButton.svelte';
  import { login } from './auth.svelte.js';
  import { waLink } from './contact.js';
  import mail from '../assets/auth/mail.svg';
  import lock from '../assets/auth/lock.svg';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let busy = $state(false);

  const done = () => (location.hash = '#');

  async function submit(e) {
    e.preventDefault();
    error = '';
    if (!email.trim() || !password) { error = 'Isi email dan password.'; return; }
    busy = true;
    try {
      await login(email, password);
      done();
    } catch (err) {
      error = err.message;
    } finally {
      busy = false;
    }
  }
</script>

<AuthLayout>
  <form class="card" onsubmit={submit} novalidate>
    <h1 class="sr">Masuk</h1>
    <div class="fields">
      <AuthField icon={mail} label="Email" type="email" autocomplete="email" bind:value={email} />
      <AuthField icon={lock} iconW={18} iconH={22.5} label="Password" type="password" autocomplete="current-password" bind:value={password} />
    </div>
    <a class="forgot" href={waLink('Halo Sela, saya lupa password akun saya.')} target="_blank" rel="noopener">Lupa Password?</a>
    {#if error}<p class="err" role="alert">{error}</p>{/if}
    <button class="primary" type="submit" disabled={busy}>{busy ? 'Memproses…' : 'Masuk'}</button>
    <p class="or">OR</p>
    <GoogleButton onsuccess={done} onerror={(m) => (error = m)} />
  </form>

  <p class="switch">Belum punya akun? <a href="#daftar">Daftar</a></p>
  <a class="guest" href="#">Lanjut tanpa akun →</a>
</AuthLayout>

<style>
  .card {
    width: 100%; max-width: 380px; display: flex; flex-direction: column; align-items: center; gap: 18px;
    padding: 50px 24px; background: #fff; border: 3px solid #2a455a; border-radius: 10px;
  }
  .fields { width: 100%; display: flex; flex-direction: column; gap: 31px; }
  .forgot { align-self: flex-start; font: 400 16px 'Poppins', sans-serif; color: #2a455a; }
  .forgot:hover, .switch a:hover, .guest:hover { text-decoration: underline; }
  .primary {
    width: 100%; padding: 10px; border: 0; border-radius: 10px; background: #2a455a; color: #fff; cursor: pointer;
    font: 400 18px 'Poppins', sans-serif; transition: background 0.15s;
  }
  .primary:hover:not(:disabled) { background: #1d3344; }
  .primary:disabled { opacity: 0.7; cursor: progress; }
  .or { margin: 0; font: 400 16px 'Cabin', 'Poppins', sans-serif; color: #000; }
  .err { width: 100%; margin: 0; padding: 8px 12px; border-radius: 6px; background: #fdecea; color: #c62828; font: 400 13px 'Poppins', sans-serif; }
  .switch { margin: 40px 0 0; font: 400 16px 'Poppins', sans-serif; color: #000; }
  .switch a { color: #2a455a; }
  .guest { margin-top: 12px; font: 400 13px 'Poppins', sans-serif; color: rgba(15, 22, 30, 0.6); }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
