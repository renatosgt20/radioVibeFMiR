- [ ] Validar HTML/IDs do player (audio id=audio, botão id=btnAgora, etc.)
- [ ] Corrigir erro JS: remover chamada a syncUIFromAudioState() sem escopo (criar função global, ou mover syncUIFromAudioState para escopo global e reutilizar no tocarRadio).
- [ ] Corrigir bug play/retomar: garantir que flags/locks e estado de paused/ended/currentTime sejam sincronizados antes/depois de play/pause.
- [ ] Corrigir erro de áudio (ERR_HTTP2_PROTOCOL_ERROR): evitar reuso de conexão/cache problemático, fazendo reload/append de ?cacheBust; lidar com erro via troca controlada e recuperação.
- [ ] Atualizar radio2.js com testes de fluxo: inicializar -> pause -> play -> ended -> próxima -> error -> recuperar.
- [ ] Validar que a UI do botão/overlay/equalizador sincroniza corretamente após cada estado.

