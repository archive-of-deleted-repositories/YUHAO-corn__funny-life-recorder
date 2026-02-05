# Funny Life Recorder

一个反 KPI 的生活记录器。

## 这是什么？

生活不需要被量化成冰冷的数字。

- 吃饭？只记「几分饱」，不数卡路里
- 社交？只关心「有没有认识新朋友」，不统计人脉
- 运动？随便记记时长就好

然后你今天的状态会反映在一台复古电视机上——开心、一般、还是摆烂，一目了然。

## 设计理念

- **No KPI**：没有目标，没有打卡，没有连续天数焦虑
- **Neubrutalism**：粗边框、硬阴影、明亮色块，好看就完事了
- **离线可用**：PWA 支持，数据存本地，不收集任何信息

## 如何使用

### 在线访问
直接打开 GitHub Pages 链接即可使用。

### 添加到手机主屏幕
1. 用 Safari（iOS）或 Chrome（Android）打开页面
2. 点击分享按钮 → 「添加到主屏幕」
3. 像原生 App 一样使用

### 本地运行
```bash
python3 -m http.server 8080
# 或
npx serve .
```

## 技术栈

纯前端，零依赖（除了 Tailwind CDN）：
- HTML + CSS + Vanilla JS
- localStorage 持久化
- Service Worker 离线缓存

## License

MIT - 随便用，开心就好。
