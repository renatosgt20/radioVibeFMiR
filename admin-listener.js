// ============================================================
// admin-listener.js - Versão FINAL e SIMPLES
// ============================================================

(function() {
  console.log('🎵 Inicializando listeners do Admin...');

  // Aguarda o player estar pronto
  function waitForPlayer() {
    const audio = document.getElementById('audio');
    if (audio) {
      console.log('✅ Player encontrado!');
      setupListeners(audio);
    } else {
      console.log('⏳ Aguardando player...');
      setTimeout(waitForPlayer, 300);
    }
  }

  function setupListeners(audio) {
    
    // ============================================================
    // LISTENER: PLAY/PAUSE
    // ============================================================
    window.addEventListener('playerTogglePlay', function(e) {
      console.log('🎵 Admin: Toggle Play/Pause', e.detail);
      
      const shouldPlay = e.detail && e.detail.isPlaying;
      
      if (shouldPlay) {
        // TOCAR
        if (audio.paused) {
          // Se tem src, só dá play
          if (typeof window.tocarRadio === 'function') {
            window.tocarRadio();
            return;
          }
          if (audio.src && audio.src !== '' && audio.src !== window.location.href) {
            audio.play().catch(function(err) {
              console.log('Erro ao dar play:', err);
              // Se falhar, tenta o tocarRadio
              if (typeof window.tocarRadio === 'function') {
                window.tocarRadio();
              }
            });
          } else {
            // Se não tem src, usa tocarRadio
            if (typeof window.tocarRadio === 'function') {
              window.tocarRadio();
            }
          }
        }
      } else {
        // PAUSAR
        if (!audio.paused) {
          audio.pause();
          console.log('⏸️ Pausado pelo Admin');
        }
      }
    });

    // ============================================================
    // LISTENER: PRÓXIMA MÚSICA
    // ============================================================
    window.addEventListener('playerNextTrack', function() {
      console.log('⏭️ Admin: Próxima música');
      
      if (typeof window.proximaMusica === 'function') {
        window.proximaMusica();
      } else {
        // Fallback: recarrega
        audio.pause();
        setTimeout(function() {
          audio.load();
          audio.play().catch(function() {});
        }, 200);
      }
    });

    // ============================================================
    // LISTENER: MÚSICA ANTERIOR
    // ============================================================
    window.addEventListener('playerPreviousTrack', function() {
      console.log('⏮️ Admin: Música anterior');
      
      // Tenta usar indexMusicaNaFase do radio2.js
      if (typeof window.indexMusicaNaFase !== 'undefined' && typeof window.proximaMusica === 'function') {
        if (window.indexMusicaNaFase > 0) {
          window.indexMusicaNaFase = window.indexMusicaNaFase - 2;
          window.proximaMusica();
        } else {
          window.indexMusicaNaFase = 0;
          window.proximaMusica();
        }
      } else {
        // Fallback: volta início da música
        if (audio.src) {
          audio.currentTime = 0;
          if (audio.paused) {
            audio.play().catch(function() {});
          }
        }
      }
    });

    console.log('✅ Listeners do Admin registrados com sucesso!');
  }

  // Inicia
  waitForPlayer();
})();

// ========= TOGGLE COMPAT (corrige caso scripts esperem tocarRadio/tocarMusica via evento) =========
// Alguns browsers podem impedir play() sem ação do usuário; por isso também tenta toggle do player principal.

