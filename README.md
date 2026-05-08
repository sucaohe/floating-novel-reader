# 悬浮小说阅读器

一个基于 Electron 的桌面悬浮小说阅读器，点击展开、离开收起，常驻桌面角落随读随用。

## 功能特性

- **悬浮常驻** — 以悬浮按钮形式常驻桌面，不占任务栏
- **点击展开/离开收起** — 点击图标展开阅读器，鼠标离开窗口自动收起
- **点击锁定/窗口置顶** — 锁定后窗口置顶且不自动收起
- **本地 TXT 上传 + 拖拽打开** — 支持上传或拖拽 TXT 文件
- **自动编码检测** — 自动识别 UTF-8/GBK 等编码，无需手动转码
- **章节解析与导航** — 自动识别章节标题，支持目录跳转
- **自动滚动（两档速度）** — 收起工具栏后可开启慢速/快速自动滚动
- **字体大小/颜色/透明度调节** — 自由调整阅读视觉风格
- **阅读进度保存** — 自动保存章节和滚动位置，下次继续阅读
- **键盘快捷键** — ← 上一章，→ 下一章

## 快速开始

### 直接下载

从 [Releases](https://github.com/sucaohe/floating-novel-reader/releases) 页面下载对应系统的安装包。

### 从源码运行

```bash
# 克隆仓库
git clone https://github.com/your-username/floating-novel-reader.git
cd floating-novel-reader

# 安装依赖
npm install

# 启动应用
npm start
```

## 构建

```bash
# 构建 macOS 版本
npm run build

# 构建 Windows 版本
npm run build:win

# 同时构建 macOS + Windows
npm run build:all
```

构建产物输出在 `release/` 目录。

## 技术栈

- [Electron](https://www.electronjs.org/) — 桌面应用框架
- [iconv-lite](https://github.com/ashtuchkin/iconv-lite) — 编码转换
- [jschardet](https://github.com/aadsm/jschardet) — 编码自动检测
- [electron-builder](https://www.electron.build/) — 应用打包构建

## 开发计划

- [x] 本地 TXT 上传与阅读
- [x] 自动编码检测
- [x] 章节目录导航
- [x] 拖拽文件打开
- [x] 自动滚动阅读
- [x] 字体/颜色/透明度自定义
- [ ] 更多功能等你建议

## 许可

MIT License
