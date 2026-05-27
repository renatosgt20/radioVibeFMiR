- [ ] Revisar `radio2.js` e identificar pontos de travamento entre variáveis (tocando, playPending, playClickLocked, pauseRequested)
- [ ] Implementar `syncUIFromAudioState()` como fonte da verdade baseada no estado real do `<audio>`
- [ ] Ajustar `ended`, `pause`, `error`, `play` para limpar locks e nunca deixar botão preso
- [ ] Garantir que listeners são registrados apenas uma vez (evitar duplicação)
- [ ] Corrigir `tocarRadio()` para sincronizar UI antes de agir e permitir play após ended/error/pause
- [ ] Manter todas as outras funções/fluxos do site intactos
- [ ] Testar manualmente: play/pause, finalizar faixa (ended), erro/stream cair, reconectar e clicar novamente

