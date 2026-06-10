# TODO - Radio vibezonefm

- [ ] Atualizar `admin.html` Firebase: remover `vibefm-radio-ad326` e usar config obrigatória `vibezonefm`.
- [ ] Implementar autenticação real no `admin.html`:
  - [ ] Função `requireAdmAuth()` para manter `#panel` oculto até login.
  - [ ] Usar `onAuthStateChanged` para ligar/desligar UI e listeners conforme sessão.
  - [ ] Bloquear ações/funções globais até login (sendReply/excluirMsg/excluirTudo/...)


