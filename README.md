# Funny Life Recorder

一个有趣的生活状态追踪器 PWA 应用。

## 功能

追踪三个生活维度：
- 🏃 运动（分钟）
- 🍽️ 饮食（饱腹感 1-10）
- 👥 社交（新朋友/老朋友）

通过 GIF 动画展示每日生活状态，而非枯燥的数字。

## 技术栈

- 纯前端 PWA（HTML + CSS + JS）
- Tailwind CSS（CDN）
- localStorage 数据持久化
- Neubrutalism 设计风格

## 目录结构

```
/
├── index.html          # 主入口
├── manifest.json       # PWA 配置
├── sw.js              # Service Worker
├── css/
│   └── styles.css     # 自定义样式
├── js/
│   ├── app.js         # 应用入口
│   ├── store.js       # 数据存储层
│   ├── score.js       # 积分计算
│   ├── router.js      # Hash 路由
│   └── ui.js          # UI 渲染
└── assets/
    └── icons/         # 应用图标
```

## 本地开发

```bash
npx serve .
```

## License

MIT
