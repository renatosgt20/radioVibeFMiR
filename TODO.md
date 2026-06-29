# TODO - Responsividade mobile-first (VibeFM)

- [x] Refatorar `Meu_Site/Radio/index.html` (CSS inline no `<style>`):


  - [ ] Melhorar base: `box-sizing`, `html, body { width/height }`, `-webkit-text-size-adjust`.
  - [ ] Corrigir overflow horizontal (evitar body overflow hidden quando necessário; usar `overscroll-behavior`, `position`/`canvas` sem criar scroll).
  - [ ] Converter layout para flex/grid quando fizer sentido (especialmente painéis e chat).
  - [ ] Ajustar medidas fixas para `clamp()`, `vw/vh`, `rem` e `max-width`.
  - [ ] Ajustar `#bg-logo`, `#fm-badge`, `.top-buttons`, `.painel-online`, `#chat-box`, `#input-msg`, `#chat-btn` no mobile.
  - [ ] Garantir `@media (max-width: 768px)` com overrides consistentes (mobile e tablet).
  - [ ] `img { max-width: 100%; height: auto; }` (manter).
  - [ ] Player: garantir que `#btnRadio`, equalizer e controles não “saiam” da tela em mobile.
  - [ ] Otimizar para Chrome Mobile e Safari iPhone: evitar `100vh` problemático (usar `100svh`/`100dvh` se necessário), ajustar `touch-action` e evitar elementos fixos que causem zoom/overflow.

- [x] Refatorar `Meu_Site/Radio/admin.html`:


  - [ ] Criar `@media (max-width: 768px)` para colocar `.chat-box` em coluna (users/chat).
  - [ ] Tornar alturas mais responsivas (usar `min(80vh, ...)` ou `height: auto` com `max-height`).

- [ ] Testar manualmente em viewport 375x667 e 768px:
  - [ ] Sem barra horizontal.
  - [ ] Conteúdo legível e não sobreposto.
  - [ ] Botão “OUVIR AGORA” clicável.
  - [ ] Chat utilizável.

