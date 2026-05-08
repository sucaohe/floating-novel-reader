// main.js - Electron 主进程
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let isExpanded = false;

// 使用文件保存窗口位置
const fs = require('fs');

const configPath = path.join(app.getPath('userData'), 'window-config.json');

// 保存窗口配置（位置和阅读器大小）
function saveWindowConfig(x, y, width, height) {
  try {
    const config = {
      x, 
      y, 
      expandedWidth: lastExpandedWidth,
      expandedHeight: lastExpandedHeight
    };
    fs.writeFileSync(configPath, JSON.stringify(config));
  } catch (e) {
    console.log('Failed to save window config:', e);
  }
}

// 加载窗口配置
function loadWindowConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return data;
    }
  } catch (e) {
    console.log('Failed to load window config:', e);
  }
  return null;
}

let lastExpandedWidth = 600;
let lastExpandedHeight = 650;
const floatBarWidth = 50;  // 悬浮条宽度固定
const floatBarHeight = 200;  // 悬浮条高度固定

function createWindow() {
  // 获取所有显示器，使用当前鼠标所在的显示器
  const displays = screen.getAllDisplays();
  const cursorPoint = screen.getCursorScreenPoint();
  
  // 找到鼠标所在的显示器
  let targetDisplay = displays[0];
  for (const display of displays) {
    const { x, y, width, height } = display.bounds;
    if (cursorPoint.x >= x && cursorPoint.x <= x + width &&
        cursorPoint.y >= y && cursorPoint.y <= y + height) {
      targetDisplay = display;
      break;
    }
  }
  
  const { width, height, x: displayX, y: displayY } = targetDisplay.bounds;
  
  // 尝试加载保存的配置
  const savedConfig = loadWindowConfig();
  
  // 如果有保存的阅读器大小，使用它
  if (savedConfig && savedConfig.expandedWidth) {
    lastExpandedWidth = savedConfig.expandedWidth;
  }
  if (savedConfig && savedConfig.expandedHeight) {
    lastExpandedHeight = savedConfig.expandedHeight;
  }
  
  // 窗口放在屏幕右侧中间
  const windowWidth = floatBarWidth;
  const windowHeight = floatBarHeight;
  
  const defaultX = savedConfig && savedConfig.x ? savedConfig.x : displayX + width - windowWidth - 20;
  const defaultY = savedConfig && savedConfig.y ? savedConfig.y : displayY + Math.floor((height - windowHeight) / 2);
  
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: defaultX,
    y: defaultY,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    resizable: true,
    title: '小说阅读器',
    skipTaskbar: true,  // 不在任务栏显示
    hasShadow: false,  // 禁用窗口阴影
    backgroundColor: '#00000000',  // 完全透明背景
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();  // 关闭开发者工具
  
  // 打印实际位置
  setTimeout(() => {
    const [x, y] = mainWindow.getPosition();
    console.log(`Actual position: (${x}, ${y})`);
  }, 1000);
  
  // 监听窗口移动事件，保存位置
  mainWindow.on('move', () => {
    const [x, y] = mainWindow.getPosition();
    const [width, height] = mainWindow.getSize();
    saveWindowConfig(x, y, width, height);
  });
  
  // 监听窗口大小变化事件（只在展开状态保存）
  mainWindow.on('resize', () => {
    const [x, y] = mainWindow.getPosition();
    const [width, height] = mainWindow.getSize();
    
    if (isExpanded) {
      // 只有展开状态才保存阅读器大小
      lastExpandedWidth = width;
      lastExpandedHeight = height;
      saveWindowConfig(x, y, width, height);
    }
    // 收缩状态不保存大小（悬浮条大小固定）
  });
}

// 窗口扩展
ipcMain.on('expand-window', (event, width, height) => {
  if (isExpanded) return;
  isExpanded = true;
  
  const [currentX, currentY] = mainWindow.getPosition();
  // 使用上次保存的展开大小
  mainWindow.setSize(lastExpandedWidth, lastExpandedHeight);
  // 保持位置不变
});

// 窗口收缩
ipcMain.on('collapse-window', () => {
  if (!isExpanded) return;
  isExpanded = false;
  
  // 保存当前展开状态的大小后再收缩
  const [width, height] = mainWindow.getSize();
  lastExpandedWidth = width;
  lastExpandedHeight = height;
  
  // 使用保存的悬浮条大小收缩
  mainWindow.setSize(floatBarWidth, floatBarHeight);
});

// 调整窗口大小（预设大小）
ipcMain.on('resize-window', (event, type, value) => {
  if (!isExpanded) return;
  
  // 预设大小
  const presets = {
    small: { width: 400, height: 400 },
    medium: { width: 600, height: 650 },
    large: { width: 800, height: 700 }
  };
  
  if (type === 'preset' && presets[value]) {
    mainWindow.setSize(presets[value].width, presets[value].height);
  }
});

// 调整悬浮条大小
ipcMain.on('resize-float-bar', (event, width, height) => {
  if (!isExpanded) {
    mainWindow.setSize(width, height);
  }
});

// 切换窗口置顶
ipcMain.on('toggle-always-on-top', (event, locked) => {
  mainWindow.setAlwaysOnTop(locked);
});

// 初始化窗口
ipcMain.on('init-window', () => {
  // 初始化时保持收缩状态
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});