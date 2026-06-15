import { config } from 'dotenv';
import { resolve } from 'path';
// Look for .env in server/ first, then fall back to the repo root
config({ path: resolve(__dirname, '../.env') });
config({ path: resolve(__dirname, '../../.env') });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import recipeRouter from './routes/recipe';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

// Security headers
app.use(helmet());

// CORS — allow the Vite dev server and production domains
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGIN ?? '*'
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// Body parser
app.use(express.json({ limit: '16kb' }));

// Rate limiting — 30 recipe requests per 5 minutes per IP
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please wait a moment before trying again.' },
});

// Routes
app.use('/api/recipe', limiter, recipeRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    apiKeySet: Boolean(process.env.OPENAI_API_KEY),
  });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found.' });
});

app.listen(PORT, () => {
  console.log(`\n🍳 Recipe Generator API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Model:  ${process.env.OPENAI_MODEL ?? 'gpt-4o-mini'}`);
  console.log(`   API Key: ${process.env.OPENAI_API_KEY ? '✓ Set' : '✗ NOT SET — set OPENAI_API_KEY in .env'}\n`);
});

export default app;
