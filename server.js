import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const DATA_FILE = path.join(__dirname, 'data', 'projects.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(cors({ origin: ALLOWED_ORIGIN === '*' ? true : ALLOWED_ORIGIN }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
await fs.mkdir(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${nanoid(8)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /video|audio/.test(file.mimetype || '');
    cb(ok ? null : new Error('Envie um arquivo de vídeo ou áudio.'), ok);
  }
});

async function readProjects() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeProjects(projects) {
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), 'utf8');
}

function safeText(text = '') {
  return String(text).trim().slice(0, 35000);
}

function fallbackGenerate({ title, niche, transcript }) {
  const baseTitle = title || 'Conteúdo estratégico para criadores';
  const publico = niche || 'criadores, empreendedores e infoprodutores';
  const ideia = transcript ? transcript.slice(0, 450) : 'o conteúdo enviado pelo usuário';

  return {
    summary: `Resumo estratégico: este projeto transforma ${baseTitle} em uma sequência de conteúdo para atrair atenção, educar a audiência e conduzir para uma ação clara. Público: ${publico}.`,
    conceptFunnel: {
      video1: {
        stage: 'Descobrir',
        title: `O erro invisível que trava ${baseTitle}`,
        hook: 'A maioria das pessoas tenta vender antes de fazer o público entender o problema.',
        script: `Você já percebeu que muita gente cria conteúdo todos os dias e mesmo assim não vende? O problema geralmente não é falta de postagem. O problema é falta de sequência. No primeiro vídeo do Funil de Conceito, eu começo mostrando o problema de forma simples. A pessoa precisa se reconhecer na dor antes de receber uma solução. Neste caso, o ponto central é: ${ideia}. Quando o público entende o problema, ele fica pronto para continuar. No próximo vídeo, eu vou mostrar a lógica por trás da solução.`,
        cta: 'No próximo vídeo, eu vou te mostrar como organizar esse conteúdo em uma sequência que faz sentido.'
      },
      video2: {
        stage: 'Relacionar',
        title: `Como transformar ${baseTitle} em uma sequência que prende atenção`,
        hook: 'Conteúdo solto gera visualização solta. Conteúdo em sequência gera relacionamento.',
        script: `Agora que o problema ficou claro, eu preciso mostrar a ponte. O público não compra apenas porque viu uma ideia boa. Ele compra quando entende o caminho. Aqui entra o segundo vídeo do Funil de Conceito. Eu explico a lógica, mostro exemplos, quebro objeções e faço a pessoa perceber que existe uma estrutura. A estrutura é simples: primeiro eu faço descobrir, depois eu faço relacionar, e só depois eu faço comprar. Com base neste tema, a mensagem principal é transformar a atenção inicial em confiança. No próximo vídeo, eu mostro como essa lógica vira oferta.`,
        cta: 'No próximo vídeo, eu vou mostrar como transformar essa ideia em uma oferta simples.'
      },
      video3: {
        stage: 'Comprar',
        title: `A forma simples de vender usando ${baseTitle}`,
        hook: 'A venda fica muito mais fácil quando o público já entendeu o problema e o caminho.',
        script: `Depois que a pessoa descobriu o problema e entendeu a lógica da solução, chega o momento de apresentar o próximo passo. Aqui eu não empurro uma oferta. Eu conecto a oferta com o que ela já percebeu nos vídeos anteriores. A mensagem é direta: se você quer aplicar isso sem travar, precisa de um método. É aqui que entra o produto, o material, a aula ou a ferramenta. A oferta deve parecer a continuação natural do conteúdo, não uma interrupção.`,
        cta: 'Clique no link no primeiro comentário e veja como aplicar isso no seu conteúdo.'
      }
    },
    youtubeSEO: {
      titles: [
        `Como usar ${baseTitle} para criar conteúdo que vende`,
        `${baseTitle}: o método simples para sair do conteúdo solto`,
        `O jeito certo de transformar conteúdo em funil`,
        `Pare de postar aleatoriamente e faça isso`,
        `Funil de Conceito aplicado na prática`
      ],
      description: `Neste vídeo eu mostro como transformar ${baseTitle} em uma sequência de conteúdo que atrai, educa e conduz para a venda. A ideia é usar o Funil de Conceito para sair dos posts soltos e criar uma jornada simples: descobrir, relacionar e comprar.\n\nAssista até o final e veja como aplicar isso no seu próprio conteúdo.\n\nCTA: link no primeiro comentário.`,
      tags: ['funil de conceito', 'marketing digital', 'youtube seo', 'conteúdo que vende', 'funil de vendas', 'criação de conteúdo'],
      chapters: ['00:00 Introdução', '00:30 O problema', '01:30 A lógica do funil', '03:00 Como aplicar', '05:00 Próximo passo']
    },
    shorts: Array.from({ length: 10 }, (_, i) => ({
      title: `Short ${i + 1}: gancho para ${baseTitle}`,
      hook: i % 2 === 0 ? 'Você não precisa postar mais. Precisa postar em sequência.' : 'O conteúdo que vende começa antes da oferta.',
      script: `Use este corte para mostrar uma ideia rápida sobre ${baseTitle}. Comece com uma frase forte, entregue um exemplo e termine chamando para o próximo conteúdo.`,
      cta: 'Comente FUNIL para receber o próximo passo.'
    })),
    thumbnail: {
      idea: 'Imagem com criador olhando para uma sequência de 3 vídeos conectados por setas, saindo de conteúdo solto para venda.',
      text: 'PARE DE POSTAR SOLTO',
      prompt: 'Crie uma thumbnail 16:9 em português, estilo YouTube marketing, mostrando vários conteúdos soltos de um lado e uma sequência de 3 vídeos conectados do outro, com visual profissional, contraste alto, sem poluição visual.'
    },
    ads: [
      { platform: 'Meta Ads', copy: 'Você posta conteúdo, mas ninguém compra? Talvez o problema não seja o conteúdo, seja a sequência. Conheça o Funil de Conceito.' },
      { platform: 'YouTube Ads', copy: 'Antes de vender, faça seu público entender. Veja como criar uma sequência de 3 vídeos que prepara a audiência para comprar.' },
      { platform: 'Google Ads', copy: 'Aprenda a transformar vídeos em um funil simples de conteúdo, relacionamento e venda.' }
    ],
    offer: {
      headline: 'Transforme conteúdo solto em uma sequência que vende',
      productIdea: 'Mini curso Funil de Conceito Primeira Venda',
      bonuses: ['Checklist da sequência de 3 vídeos', 'Modelos de títulos SEO', 'Prompts para roteiros', 'Mapa de conteúdo de 7 dias'],
      cta: 'Acesse agora e comece pelo primeiro funil.'
    }
  };
}

async function aiGenerate(payload) {
  if (!openai) return fallbackGenerate(payload);

  const prompt = `Você é Sandro Caxias, especialista em Funil de Conceito, YouTube SEO, copywriting e marketing digital. Gere um plano completo em JSON válido, sem markdown, a partir destes dados:\n\nTítulo: ${payload.title}\nNicho: ${payload.niche}\nTranscrição ou texto-base: ${payload.transcript}\n\nO JSON deve ter exatamente estes campos: summary, conceptFunnel com video1 video2 video3, youtubeSEO com titles description tags chapters, shorts com 10 itens, thumbnail, ads com 3 itens, offer. Escreva em português do Brasil, primeira pessoa estratégica quando fizer sentido, tom claro e direto.`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.75
  });

  return JSON.parse(response.choices[0].message.content);
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: 'Funil Content AI MVP', aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, message: 'Nenhum arquivo enviado.' });
  res.json({ ok: true, file: { originalName: req.file.originalname, filename: req.file.filename, path: `/uploads/${req.file.filename}`, size: req.file.size, mimetype: req.file.mimetype } });
});

app.post('/api/generate', async (req, res) => {
  const title = safeText(req.body?.title || '');
  const niche = safeText(req.body?.niche || '');
  const transcript = safeText(req.body?.transcript || '');

  if (!title && !transcript) {
    return res.status(400).json({ ok: false, message: 'Informe pelo menos um título ou texto base.' });
  }

  try {
    const output = await aiGenerate({ title, niche, transcript });
    const projects = await readProjects();
    const project = { id: nanoid(10), createdAt: new Date().toISOString(), title: title || 'Projeto sem título', niche, transcript, output };
    projects.unshift(project);
    await writeProjects(projects.slice(0, 100));
    res.json({ ok: true, project });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Erro ao gerar o conteúdo.', detail: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  const projects = await readProjects();
  res.json({ ok: true, projects });
});

app.delete('/api/projects/:id', async (req, res) => {
  const projects = await readProjects();
  const next = projects.filter(p => p.id !== req.params.id);
  await writeProjects(next);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Funil Content AI rodando na porta ${PORT}`));
