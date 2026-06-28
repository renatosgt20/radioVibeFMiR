# Sugestão de Firebase Realtime Database Rules

> Objetivo: chat + presença + sincronização da rádio + contador de ouvintes.

## Regras sugeridas (copiar/colar no Firebase Console)

```json
{
  "rules": {
    "onlineAdmins": {
      "main": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "onlineListeners": {
      ".read": "auth != null",
      "$uid": {
        ".write": true
      }
    },
    "radioSync": {
      ".read": true,
      "state": {
        ".write": true
      },
      "listeners": {
        "$uid": {
          ".write": true
        }
      },
      "command": {
        ".write": "auth != null"
      },
      "vinheta": {
        ".write": "auth != null"
      },
      "musicVolume": {
        ".write": "auth != null"
      }
    },
    "mensagens": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Como funciona

- **Visitantes** registram presença em `onlineListeners/{uid}` ao tocar a rádio.
- **Sincronização** em `radioSync/state` — todos ouvem a mesma faixa.
- **Líder** — primeiro ouvinte que deu play; exibido só no painel ADM.
- **Comandos** (`play`, `pause`, `next`, `prev`) — só ADM autenticado escreve em `radioSync/command`.
- **Vinheta** — ADM toca pasta `vibezonefm` e reduz volume global via `musicVolume`.

## Como testar

1. Publicar rules no Console.
2. Abrir o site, clicar **OUVIR AGORA**.
3. Abrir `admin.html`, logar:
   - Ver contador de ouvintes e badge do **líder**
   - Usar Play / Pause / Anterior / Próxima
   - Tocar vinheta e ajustar volume da música
4. Abrir segunda aba do site — deve sincronizar a mesma música.
