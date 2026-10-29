<script>
  import eyeOff from '../assets/auth/eye-off.svg';

  let { icon, iconW = 18, iconH = 18, label, type = 'text', value = $bindable(''), autocomplete, error = '' } = $props();
  let show = $state(false);
  const id = 'f-' + Math.random().toString(36).slice(2, 8);
</script>

<div class="wrap">
  <div class="field" class:invalid={!!error}>
    <img class="icon" src={icon} alt="" width={iconW} height={iconH} />
    <label class="sr" for={id}>{label}</label>
    <input
      {id}
      type={type === 'password' && show ? 'text' : type}
      placeholder={label}
      bind:value
      {autocomplete}
      aria-invalid={!!error}
    />
    {#if type === 'password'}
      <button type="button" class="eye" class:on={show} onclick={() => (show = !show)} aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'} aria-pressed={show}>
        <img src={eyeOff} alt="" width="18" height="18" />
      </button>
    {/if}
  </div>
  {#if error}<p class="err">{error}</p>{/if}
</div>

<style>
  .wrap { width: 100%; }
  .field {
    display: flex; align-items: center; gap: 20px; height: 48px; padding: 0 12px;
    background: #2a455a; border: 2px solid #2a455a; border-radius: 10px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.25); transition: border-color 0.15s;
  }
  .field:focus-within { border-color: #8fc3ea; }
  .field.invalid { border-color: #f44336; }
  .icon { display: block; flex-shrink: 0; }
  input {
    flex: 1; min-width: 0; border: 0; background: transparent; outline: none;
    font: 400 16px 'Poppins', sans-serif; color: #fff;
  }
  input::placeholder { color: rgba(255, 255, 255, 0.85); }
  .eye { display: flex; padding: 4px; border: 0; background: none; cursor: pointer; border-radius: 4px; }
  .eye.on { opacity: 0.5; }
  .eye:focus-visible { outline: 2px solid #8fc3ea; }
  .err { margin: 6px 4px 0; font: 400 12px 'Poppins', sans-serif; color: #f44336; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
