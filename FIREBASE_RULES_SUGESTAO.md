# Sugestão de Firebase Realtime Database Rules

> Objetivo: chat + presença de admin + contador de ouvintes online (só ADM lê).

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
    "mensagens": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Como funciona

- **Visitantes** registram presença em `onlineListeners/{uid}` ao tocar a rádio.
- **ADM logado** lê `onlineListeners` e vê o contador no painel admin.
- **Público** não vê o número (linha escondida no `index.html` + rules bloqueiam leitura).

## Como testar

1. Atualizar rules no Console (Realtime Database → Rules → Publish).
2. Abrir o site, clicar em **OUVIR AGORA**.
3. Abrir `admin.html`, logar e verificar:
   - Contador **X ouvintes online** no header
   - `onlineAdmins/main` atualiza para `true`
   - Mensagens do chat aparecem
4. Pausar a rádio → contador deve diminuir após alguns segundos.
