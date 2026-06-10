# TODO - Migração Firebase para vibezonefm (Vibe FM Rádio)

- [ ] Atualizar `admin.html`:
  - [ ] Substituir `firebaseConfig` antigo (vibefm-radio-ad326) pelo config obrigatório `vibezonefm`.
  - [ ] Bloquear qualquer acesso ao painel/conteúdo administrativo antes do login (flag + guard `requireAdmAuth()`).
  - [ ] Garantir que listeners e funções administrativas globais só ficam ativas após login.
  - [ ] Corrigir presença online do admin:
    - [ ] Ao logar: `onlineAdmins/main = true`.
    - [ ] Ao sair/perder autenticação/fechar aba: `onlineAdmins/main = false`.
- [ ] Atualizar `index.html`:
  - [ ] Substituir `firebaseConfig` antigo pelo config novo `vibezonefm`.
  - [ ] Remover referências ao projeto antigo `vibefm-radio-ad326`.
  - [ ] Garantir funcionamento em tempo real do indicador `onlineAdmins/main`.
  - [ ] Garantir leitura de `mensagens`.
- [ ] Validar manualmente (browser):
  - [ ] login admin funciona (Auth email/senha).
  - [ ] mensagens do admin chegam no chat.
  - [ ] respostas do usuário chegam no painel admin.
  - [ ] indicador ADM ON/OFF funciona em tempo real.
  - [ ] abrir `admin.html` sem login mostra apenas tela de login e bloqueia ações.

