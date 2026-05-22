export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Vibe FM - Web Rádio</title>
  <style>
    body { font-family: Arial; text-align: center; padding: 50px; background: #121212; color: white; }
    button { background: #ff5722; color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 30px; cursor: pointer; }
    audio { margin-top: 30px; width: 80%; }
  </style>
</head>
<body>
  <h1>📻 Vibe FM</h1>
  <p>Web Rádio - PA-Brasil | 27°C Pred. nublado</p>
  <button id="playBtn">▶ INICIAR RÁDIO</button>
  <audio id="audio" controls style="display:none"></audio>

  <script>
    const audio = document.getElementById('audio');
    const btn = document.getElementById('playBtn');
    
    btn.addEventListener('click', () => {
      audio.src = 'https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3';
      audio.style.display = 'block';
      audio.play();
      btn.style.display = 'none';
    });
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }
}