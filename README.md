[README-GEMINI.md](https://github.com/user-attachments/files/28668337/README-GEMINI.md)
# Funil Content AI MVP com Gemini

Substitua no GitHub:

- server.js
- package.json

No Render, configure:

```txt
ALLOWED_ORIGIN=https://app.funildeconceito.com
GEMINI_API_KEY=sua_chave_gemini
GEMINI_MODEL=gemini-1.5-flash
```

Depois faça:

```txt
Manual Deploy
Clear build cache & deploy
```

Teste:

```txt
https://funil-content-ai-mvp.onrender.com/api/health
```

O certo:

```json
{
  "ok": true,
  "app": "Funil Content AI MVP",
  "aiProvider": "gemini",
  "aiConfigured": true
}
```
