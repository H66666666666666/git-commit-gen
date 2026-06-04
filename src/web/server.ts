import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { generateCommitMessage, getAvailableProviders } from '../core/ai.js';
import { getStagedDiff, hasStagedChanges } from '../core/git.js';
import { getCommitHistory } from '../core/history.js';
import { loadConfig, saveConfig } from '../utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 当前项目路径（默认为 git-commit-gen 项目目录）
let currentProjectPath = process.cwd();

// 项目列表配置文件
const projectsConfigPath = path.join(process.cwd(), '.git-commit-gen-projects.json');

// 读取项目列表
function loadProjects(): string[] {
  try {
    if (fs.existsSync(projectsConfigPath)) {
      const data = fs.readFileSync(projectsConfigPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load projects:', error);
  }
  return [];
}

// 保存项目列表
function saveProjects(projects: string[]): void {
  try {
    fs.writeFileSync(projectsConfigPath, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
}

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件 - 使用 process.cwd() 获取项目根目录
const publicPath = path.join(process.cwd(), 'src', 'web', 'public');
app.use(express.static(publicPath));

// 根路由 - 提供 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// API: 设置项目路径
app.post('/api/project', (req, res) => {
  try {
    const { path: projectPath } = req.body;
    if (!projectPath) {
      return res.status(400).json({ error: 'Project path is required' });
    }

    // 验证路径是否存在
    if (!fs.existsSync(projectPath)) {
      return res.status(400).json({ error: 'Project path does not exist' });
    }

    currentProjectPath = projectPath;
    res.json({ success: true, message: 'Project path set', path: projectPath });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to set project path',
    });
  }
});

// API: 获取项目列表
app.get('/api/projects', (req, res) => {
  try {
    const projects = loadProjects();
    res.json({
      projects,
      current: currentProjectPath,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to load projects',
    });
  }
});

// API: 添加项目
app.post('/api/projects', (req, res) => {
  try {
    const { path: projectPath } = req.body;
    if (!projectPath) {
      return res.status(400).json({ error: 'Project path is required' });
    }

    // 验证路径是否存在
    if (!fs.existsSync(projectPath)) {
      return res.status(400).json({ error: 'Project path does not exist' });
    }

    const projects = loadProjects();
    if (!projects.includes(projectPath)) {
      projects.push(projectPath);
      saveProjects(projects);
    }

    res.json({ success: true, message: 'Project added', projects });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to add project',
    });
  }
});

// API: 删除项目
app.delete('/api/projects', (req, res) => {
  try {
    const { path: projectPath } = req.body;
    if (!projectPath) {
      return res.status(400).json({ error: 'Project path is required' });
    }

    let projects = loadProjects();
    projects = projects.filter(p => p !== projectPath);
    saveProjects(projects);

    // 如果删除的是当前项目，切换到第一个项目
    if (currentProjectPath === projectPath && projects.length > 0) {
      currentProjectPath = projects[0];
    }

    res.json({ success: true, message: 'Project removed', projects });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to remove project',
    });
  }
});

// API: 暂存所有文件
app.post('/api/stage', async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      exec('git add .', { cwd: currentProjectPath }, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve(stdout);
      });
    });
    res.json({ success: true, message: 'All files staged' });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to stage files',
    });
  }
});

// API: 生成 commit 信息
app.post('/api/generate', async (req, res) => {
  try {
    const { provider, language, autoStage } = req.body;

    // 如果设置了自动暂存，先暂存所有文件
    if (autoStage) {
      await new Promise((resolve, reject) => {
        exec('git add .', { cwd: currentProjectPath }, (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve(stdout);
        });
      });
    }

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

// API: 检查项目是否有未提交的更改
app.get('/api/check-updates', async (req, res) => {
  try {
    const projects = loadProjects();
    const updates = [];

    for (const projectPath of projects) {
      try {
        const result = await new Promise((resolve, reject) => {
          exec('git status --porcelain', { cwd: projectPath }, (error, stdout, stderr) => {
            if (error) reject(error);
            else resolve(stdout);
          });
        });

        const hasChanges = (result as string).trim().length > 0;
        updates.push({
          path: projectPath,
          hasChanges,
          changesCount: (result as string).trim().split('\n').filter(line => line.trim()).length
        });
      } catch (error) {
        updates.push({
          path: projectPath,
          hasChanges: false,
          changesCount: 0,
          error: 'Not a git repository'
        });
      }
    }

    res.json({ updates });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to check updates',
    });
  }
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
      projectPath: currentProjectPath,
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
    console.log(`📁 Project path: ${currentProjectPath}`);
  });
}

// 如果直接运行此文件
if (process.argv[1] === __filename) {
  startWebServer(PORT);
}
