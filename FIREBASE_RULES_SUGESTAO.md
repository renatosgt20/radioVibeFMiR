# Sugestão de Firebase Realtime Database Rules

> Objetivo: remover `permission_denied` e fazer chat + presença funcionarem.

## Regras sugeridas (copiar/colar no Firebase Console)

```json
{
  "rules": {
    "onlineAdmins": {
      "rules": {
        "main": {
          ".read": true,
          ".write": "auth != null"
        }
      }
    },
    "mensagens": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Como testar
1. Atualizar rules no Console.
2. Abrir mobile (guest) e enviar mensagem.
3. Abrir admin, logar e verificar:
   - `onlineAdmins/main` atualiza
   - mensagem aparece.

