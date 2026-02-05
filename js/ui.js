// ui.js - UI 渲染

const UI = {
  // 渲染导航栏
  renderNav() {
    const route = Router.getCurrentRoute();
    return `
      <nav class="bottom-nav">
        <div class="flex justify-around">
          <div class="nav-item ${route === 'home' ? 'active' : ''}" onclick="Router.navigate('home')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="square">
              <path d="M3 12L12 3L21 12"/>
              <path d="M5 12V21H19V12"/>
            </svg>
            <span class="text-xs font-bold mt-1">首页</span>
          </div>
          <div class="nav-item ${route === 'exercise' ? 'active' : ''}" onclick="Router.navigate('exercise')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="square">
              <circle cx="12" cy="5" r="2"/>
              <path d="M12 7V14M8 10H16M12 14L8 21M12 14L16 21"/>
            </svg>
            <span class="text-xs font-bold mt-1">运动</span>
          </div>
          <div class="nav-item ${route === 'food' ? 'active' : ''}" onclick="Router.navigate('food')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="square">
              <rect x="4" y="8" width="16" height="12"/>
              <path d="M4 12H20"/>
              <path d="M8 8V4M16 8V4"/>
            </svg>
            <span class="text-xs font-bold mt-1">饮食</span>
          </div>
          <div class="nav-item ${route === 'social' ? 'active' : ''}" onclick="Router.navigate('social')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="square">
              <circle cx="8" cy="8" r="3"/>
              <circle cx="16" cy="8" r="3"/>
              <path d="M4 21C4 17 6 14 8 14C10 14 10 14 12 14C14 14 14 14 16 14C18 14 20 17 20 21"/>
            </svg>
            <span class="text-xs font-bold mt-1">社交</span>
          </div>
        </div>
      </nav>
    `;
  },

  // 渲染电视框架
  renderTV(gifUrl) {
    return `
      <div class="tv-frame mx-4 my-4">
        <div class="tv-screen">
          <img src="${gifUrl}" alt="生活状态" />
        </div>
        <div class="flex justify-center gap-2 mt-3">
          <div class="w-3 h-3 bg-black"></div>
          <div class="w-3 h-3 bg-black"></div>
        </div>
      </div>
    `;
  },

  // 渲染月份选择器
  renderMonthSelector(currentMonth) {
    const [year, month] = currentMonth.split('-');
    const displayText = `${year}年${parseInt(month)}月`;
    return `
      <div class="month-selector my-4">
        <button onclick="App.prevMonth()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3">
            <path d="M15 6L9 12L15 18"/>
          </svg>
        </button>
        <span class="font-bold text-lg">${displayText}</span>
        <button onclick="App.nextMonth()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3">
            <path d="M9 6L15 12L9 18"/>
          </svg>
        </button>
      </div>
    `;
  },

  // 渲染记录列表项
  renderListItem(record) {
    const typeLabels = { exercise: '运动', food: '饮食', social: '社交' };
    const chipClass = `chip chip-${record.type}`;
    let valueText = '';

    switch (record.type) {
      case 'exercise':
        valueText = `${record.value} 分钟`;
        break;
      case 'food':
        valueText = `${record.value} 成饱`;
        break;
      case 'social':
        valueText = record.isNewFriend ? '新朋友' : '老朋友';
        break;
    }

    const time = new Date(record.timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="list-item" onclick="App.editRecord('${record.id}')">
        <div class="flex justify-between items-center">
          <div>
            <span class="${chipClass}">${typeLabels[record.type]}</span>
            <span class="ml-2 font-bold">${record.category}</span>
          </div>
          <span class="text-gray-600">${time}</span>
        </div>
        <div class="mt-2 text-lg font-bold">${valueText}</div>
      </div>
    `;
  },

  // 渲染统计卡片
  renderStatCard(stats) {
    return `
      <div class="stat-card mx-4 my-4">
        <div class="stat-value">${stats.total}${stats.unit}</div>
        <div class="stat-label">${stats.label}</div>
        ${stats.newFriends !== undefined ? `
          <div class="mt-2 text-sm">
            新朋友 ${stats.newFriends} | 老朋友 ${stats.oldFriends}
          </div>
        ` : ''}
      </div>
    `;
  },

  // 渲染添加按钮
  renderAddButton() {
    return `
      <button class="btn fixed right-4 bottom-24" style="padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));" onclick="App.openAddModal()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3">
          <path d="M12 4V20M4 12H20"/>
        </svg>
      </button>
    `;
  }
};
