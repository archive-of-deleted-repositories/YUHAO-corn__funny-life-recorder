// sw.js - Service Worker

const CACHE_NAME = 'funny-life-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/store.js',
  '/js/score.js',
  '/js/router.js',
  '/js/ui.js',
  '/js/app.js',
  '/manifest.json'
];

// 安装 - 缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 请求拦截
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // GIF 使用 Network First
  if (url.href.includes('giphy.com')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 其他资源使用 Cache First
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
