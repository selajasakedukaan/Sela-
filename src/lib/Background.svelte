<script>
  // Ornamen latar dari desain Figma (lingkaran abu-abu + gelombang biru di bawah).
  import circles from '../assets/bg/circles.svg';
  import waveBack from '../assets/bg/wave-back.svg';
  import waveFront from '../assets/bg/wave-front.svg';
</script>

<div class="decor" aria-hidden="true">
  <img class="circles" src={circles} alt="" width="758" height="707" />
  <img class="circles mirror" src={circles} alt="" width="758" height="707" />
</div>

<footer aria-hidden="true">
  <div class="fade"></div>
  <img class="wave back" src={waveBack} alt="" />
  <img class="wave front" src={waveFront} alt="" />
</footer>

<style>
  .decor { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
  .circles { position: absolute; left: -272px; top: -40px; width: 758px; height: auto; }
  .circles.mirror { left: auto; right: -300px; top: 45vh; transform: scaleX(-1) rotate(20deg); opacity: 0.8; }

  footer { position: relative; height: 140px; margin-top: auto; overflow: hidden; pointer-events: none; }
  .fade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(217, 217, 217, 0) 5%, rgba(42, 69, 90, 0.55)); }
  .wave { position: absolute; left: -5%; width: 110%; display: block; }
  .back { bottom: 20px; height: 100px; opacity: 0.85; }
  .front { bottom: 0; height: 66px; }

  @media (max-width: 600px) {
    .circles { width: 520px; left: -220px; }
    .circles.mirror { right: -260px; }
    footer { height: 100px; }
  }
</style>
