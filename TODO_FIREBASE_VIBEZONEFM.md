# TODO - Correção autenticação painel admin (Firebase 12 modular)

- [x] Identificar referência quebrada: `onAuthStateChanged` não está importada.
- [ ] Atualizar `admin.html`: importar `onAuthStateChanged` do `firebase-auth.js` (modular 12).
- [ ] Atualizar `admin.html`: melhorar diagnóstico do login (logar `err.code` e `console.error`).
- [ ] Garantir que o `onAuthStateChanged` controla:
  - [ ] esconder painel antes do login
  - [ ] exibir painel após autenticação
  - [ ] setar `onlineAdmins/main=true` quando autenticado
  - [ ] setar `onlineAdmins/main=false` quando deslogado
- [x] Garantir `loadUsers()` só é iniciado quando autenticado.

- [ ] Testar em navegador: login válido e inválido; troca de conta; refresh da página mantendo sessão.

