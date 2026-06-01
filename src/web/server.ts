import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCommitMessage, getAvailableProviders } from '../core/ai.js';
import { getStagedDiff, hasStagedChanges } from '../core/git.js';
import { getCommitHistory } from '../core/history.js';
import { loadConfig, saveConfig } from '../utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: 生成 commit 信息
app.post('/api/generate', async (req, res) => {
  try {
    const { provider, language } = req.body;

    const hasStaged = await hasStagedChanges();
    if (!hasStaged) {
      return res.status(400).json({ error: 'No staged changes found' });
    }

    const diff = await getStagedDiff();
    const message = await generateCommitMessage(diff.staged, {
      provider,
      language,
    });

    res.json({
      success: true,
      message,
      stats: {
        files: diff.files.length,
        insertions: diff.insertions,
        deletions: diff.deletions,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// API: 获取 commit 历史
app.get('/api/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const history = await getCommitHistory(limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// API: 获取配置
app.get('/api/config', (req, res) => {
  const config = loadConfig();
  res.json(config);
});

// API: 更新配置
app.post('/api/config', (req, res) => {
  try {
    saveConfig(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// API: 获取可用模型
app.get('/api/providers', (req, res) => {
  const providers = getAvailableProviders();
  res.json(providers);
});

// API: 检查 Git 状态
app.get('/api/status', async (req, res) => {
  try {
    const hasStaged = await hasStagedChanges();
    const config = loadConfig();
    res.json({
      hasStagedChanges: hasStaged,
      provider: config.provider,
      language: config.language,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// 启动服务器
export function startWebServer(port: number = 3000): void {
  app.listen(port, () => {
    console.log(`🚀 Web server running at http://localhost:${port}`);
    console.log(`📊 Dashboard: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
  });
}

// 如果直接运行此文件
if (process.argv[1] === __filename) {
  startWebServer(PORT);
}
