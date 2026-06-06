# Funil Content AI MVP

MVP para transformar texto, roteiro, transcrição, vídeo ou áudio em ativos do Funil de Conceito.

## O que faz
- Dashboard simples
- Upload de vídeo ou áudio
- Gerador de Funil Completo
- Vídeo 1: Descobrir
- Vídeo 2: Relacionar
- Vídeo 3: Comprar
- SEO YouTube: títulos, descrição, tags e capítulos
- 10 ideias de Shorts
- Ideia de thumbnail e prompt de imagem
- 3 anúncios
- Oferta com headline, produto, bônus e CTA
- Biblioteca local de projetos
- Exportação TXT do projeto aberto

## Como rodar localmente

```bash
npm install
npm start
```

Acesse:

```txt
http://localhost:3000
```

## Como subir no Render

Build Command:

```bash
npm install
```

Start Command:

```bash
node server.js
```

## Variáveis de ambiente

Obrigatórias para produção:

```txt
ALLOWED_ORIGIN=https://app.funildeconceito.com
```

Opcional para usar IA real:

```txt
OPENAI_API_KEY=sua_chave_openai
OPENAI_MODEL=gpt-4o-mini
```

Sem `OPENAI_API_KEY`, o app funciona em modo demonstração com um gerador interno.

## Importante
Este MVP não baixa vídeos de YouTube, Instagram ou TikTok. Ele foi reposicionado como ferramenta de criação de conteúdo e Funil de Conceito a partir de material próprio, autorizado ou texto fornecido pelo usuário.
