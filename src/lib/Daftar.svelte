<script>
  import AuthLayout from './AuthLayout.svelte';
  import AuthField from './AuthField.svelte';
  import GoogleButton from './GoogleButton.svelte';
  import { register } from './auth.svelte.js';
  import people from '../assets/auth/people.svg';
  import mail from '../assets/auth/mail.svg';
  import phone from '../assets/auth/phone.svg';
  import lock from '../assets/auth/lock.svg';

  let f = $state({ nama: '', email: '', telp: '', password: '', konfirmasi: '' });
  let agree = $state(false);
  let submitted = $state(false);
  let error = $state('');
  let busy = $state(false);

  const errors = $derived({
    nama: !f.nama.trim() && 'Nama lengkap wajib diisi.',
    email: !/^\S+@\S+\.\S+$/.test(f.email) && 'Masukkan email yang valid.',
    telp: !/^(\+62|0)8\d{7,12}$/.test(f.telp.replace(/[\s-]/g, '')) && 'Masukkan nomor HP yang valid.',
    password: f.password.length < 8 && 'Password minimal 8 karakter.',
    konfirmasi: f.konfirmasi !== f.password && 'Konfirmasi password tidak sama.',
    agree: !agree && 'Anda perlu menyetujui Syarat & Ketentuan dan Kebijakan Privasi.'
  });
  const err = (k) => (submitted ? errors[k] || '' : '');
  const done = () => (location.hash = '#');

  async function submit(e) {
    e.preventDefault();
    submitted = true;
    error = '';
    if (Object.values(errors).some(Boolean)) return;
    busy = true;
    try {
      await register(f);
      done();
    } catch (er) {
      error = er.message;
    } finally {
      busy = false;
    }
  }
</script>

<AuthLayout subtitle="Form Pendaftaran" topLink={{ href: '#masuk', label: 'Masuk >' }}>
  <form class="form" onsubmit={submit} novalidate>
    <h1 class="sr">Daftar</h1>
    <AuthField icon={people} label="Nama Lengkap" autocomplete="name" bind:value={f.nama} error={err('nama')} />
    <AuthField icon={mail} label="Email" type="email" autocomplete="email" bind:value={f.email} error={err('email')} />
    <AuthField icon={phone} label="Nomor telepon" type="tel" autocomplete="tel" bind:value={f.telp} error={err('telp')} />
    <AuthField icon={lock} iconH={22.5} label="Password" type="password" autocomplete="new-password" bind:value={f.password} error={err('password')} />
    <AuthField icon={lock} iconH={22.5} label="Konfirmasi Password" type="password" autocomplete="new-password" bind:value={f.konfirmasi} error={err('konfirmasi')} />

    <label class="agree">
      <input type="checkbox" bind:checked={agree} />
      <span>Saya setuju dengan <a href="#profil">Syarat &amp; Ketentuan</a> dan <a href="#profil">Kebijakan Privasi</a></span>
    </label>
    {#if err('agree')}<p class="small-err">{err('agree')}</p>{/if}
    {#if error}<p class="err" role="alert">{error}</p>{/if}

    <button class="primary" type="submit" disabled={busy}>{busy ? 'Memproses…' : 'Daftar'}</button>
    <p class="or">OR</p>
    <div class="google"><GoogleButton onsuccess={done} onerror={(m) => (error = m)} /></div>
  </form>
  <p class="switch">Sudah punya akun? <a href="#masuk">Masuk</a></p>
</AuthLayout>

<style>
  .form { width: 100%; max-width: 380px; display: flex; flex-direction: column; align-items: center; gap: 17px; }
  .agree { align-self: stretch; display: flex; gap: 13px; align-items: flex-start; margin-top: 20px; cursor: pointer; font: 400 14px/1.6 'Poppins', sans-serif; color: #000; }
  .agree input { width: 20px; height: 15px; margin: 3px 0 0; accent-color: #2a455a; flex-shrink: 0; }
  .agree a { color: #2a455a; }
  .agree a:hover, .switch a:hover { text-decoration: underline; }
  .small-err { align-self: flex-start; margin: -8px 0 0 33px; font: 400 12px 'Poppins', sans-serif; color: #f44336; }
  .err { width: 100%; margin: 0; padding: 8px 12px; border-radius: 6px; background: #fdecea; color: #c62828; font: 400 13px 'Poppins', sans-serif; }
  .primary {
    width: 210px; height: 48px; margin-top: 24px; border: 2px solid #000; border-radius: 10px;
    background: #2a455a; color: #fff; cursor: pointer; font: 400 18px 'Poppins', sans-serif; transition: background 0.15s;
  }
  .primary:hover:not(:disabled) { background: #1d3344; }
  .primary:disabled { opacity: 0.7; cursor: progress; }
  .or { margin: 0; font: 400 16px 'Cabin', 'Poppins', sans-serif; }
  .google { width: 100%; }
  .switch { margin: 28px 0 0; font: 400 15px 'Poppins', sans-serif; }
  .switch a { color: #2a455a; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
