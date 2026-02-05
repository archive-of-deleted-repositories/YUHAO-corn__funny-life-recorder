// app.js - 应用入口

const App = {
  currentMonth: new Date().toISOString().slice(0, 7),
  editingRecord: null,

  init() {
    Router.init();
    this.render();
  },

  render() {
    const route = Router.getCurrentRoute();
    const app = document.getElementById('app');

    switch (route) {
      case 'home':
        app.innerHTML = this.renderHomePage();
        break;
      case 'exercise':
      case 'food':
      case 'social':
        app.innerHTML = this.renderTypePage(route);
        break;
    }

    app.innerHTML += UI.renderNav();
  },

  renderHomePage() {
    const records = Store.getAll();
    const todayScore = Score.getTodayScore(records);
    const gifUrl = Score.getStatusGif(todayScore);

    // 月度数据
    const monthRecords = records.filter(r => r.month === this.currentMonth);
    const exerciseTotal = monthRecords
      .filter(r => r.type === 'exercise')
      .reduce((sum, r) => sum + r.value, 0);
    const foodCount = monthRecords.filter(r => r.type === 'food').length;
    const socialCount = monthRecords.filter(r => r.type === 'social').length;

    // 月度流水账
    const sortedRecords = monthRecords.sort((a, b) => b.timestamp - a.timestamp);

    return `
      <div class="p-4">
        <h1 class="text-2xl font-black mb-4">今日状态</h1>
        ${UI.renderTV(gifUrl)}

        ${UI.renderMonthSelector(this.currentMonth)}

        <div class="grid grid-cols-3 gap-2 mx-4 my-4">
          <div class="stat-card">
            <div class="stat-value">${exerciseTotal}</div>
            <div class="stat-label">运动分钟</div>
          </div>
          <div class="stat-card" style="background: var(--color-secondary);">
            <div class="stat-value">${foodCount}</div>
            <div class="stat-label">饮食记录</div>
          </div>
          <div class="stat-card" style="background: #c4b5fd;">
            <div class="stat-value">${socialCount}</div>
            <div class="stat-label">社交次数</div>
          </div>
        </div>

        <div class="space-y-3 mt-4">
          ${sortedRecords.length > 0
            ? sortedRecords.map(r => UI.renderListItem(r)).join('')
            : '<p class="text-gray-500">暂无记录</p>'
          }
        </div>
      </div>
      ${UI.renderAddButton()}
    `;
  },

  renderTypePage(type) {
    const typeLabels = { exercise: '运动', food: '饮食', social: '社交' };
    const records = Store.getByTypeAndMonth(type, this.currentMonth);
    const stats = Score.getMonthStats(Store.getAll(), type, this.currentMonth);

    const sortedRecords = records.sort((a, b) => b.timestamp - a.timestamp);

    return `
      <div class="p-4">
        <h1 class="text-2xl font-black mb-4">${typeLabels[type]}</h1>
        ${UI.renderMonthSelector(this.currentMonth)}
        ${UI.renderStatCard(stats)}

        <h2 class="text-xl font-bold mt-6 mb-3">记录列表</h2>
        <div class="space-y-3">
          ${sortedRecords.length > 0
            ? sortedRecords.map(r => UI.renderListItem(r)).join('')
            : '<p class="text-gray-500">暂无记录</p>'
          }
        </div>
      </div>
      ${UI.renderAddButton()}
    `;
  },

  prevMonth() {
    const [year, month] = this.currentMonth.split('-').map(Number);
    const prev = month === 1
      ? `${year - 1}-12`
      : `${year}-${String(month - 1).padStart(2, '0')}`;
    this.currentMonth = prev;
    this.render();
  },

  nextMonth() {
    const [year, month] = this.currentMonth.split('-').map(Number);
    const next = month === 12
      ? `${year + 1}-01`
      : `${year}-${String(month + 1).padStart(2, '0')}`;
    this.currentMonth = next;
    this.render();
  },

  openAddModal(type = null) {
    this.editingRecord = null;
    this.renderModal(type);
  },

  editRecord(id) {
    const record = Store.getAll().find(r => r.id === id);
    if (record) {
      this.editingRecord = record;
      this.renderModal(record.type);
    }
  },

  renderModal(preselectedType) {
    const route = Router.getCurrentRoute();
    const type = preselectedType || (route !== 'home' ? route : null);
    const record = this.editingRecord;

    const categories = {
      exercise: ['跑步', '健身', '游泳', '骑行', '瑜伽', '篮球', '羽毛球', '乒乓球', '爬山', '散步', '跳绳', '其他'],
      food: ['早餐', '午餐', '晚餐', '加餐'],
      social: ['聚会', '约饭', '运动', '电话', '视频', '逛街', '看电影', '桌游', '旅行', '拜访', '其他']
    };

    const now = new Date();
    const defaultDate = record?.date || now.toISOString().split('T')[0];
    const defaultTime = record
      ? new Date(record.timestamp).toTimeString().slice(0, 5)
      : now.toTimeString().slice(0, 5);

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-content" onclick="event.stopPropagation()">
          <h2 class="text-xl font-bold mb-4">${record ? '编辑记录' : '添加记录'}</h2>

          ${!type ? `
            <div class="mb-4">
              <label class="font-bold block mb-2">类型</label>
              <div class="flex gap-2">
                <button class="btn flex-1" onclick="App.selectType('exercise')">运动</button>
                <button class="btn flex-1" onclick="App.selectType('food')">饮食</button>
                <button class="btn flex-1" onclick="App.selectType('social')">社交</button>
              </div>
            </div>
          ` : `
            <input type="hidden" id="modal-type" value="${type}" />

            <div class="mb-4">
              <label class="font-bold block mb-2">类目</label>
              <div class="flex flex-wrap gap-2">
                ${categories[type].map(cat => `
                  <button class="btn ${record?.category === cat ? 'btn-secondary' : ''}"
                          onclick="App.selectCategory(this, '${cat}')">${cat}</button>
                `).join('')}
              </div>
              <input type="hidden" id="modal-category" value="${record?.category || categories[type][0]}" />
            </div>

            ${type === 'exercise' ? `
              <div class="mb-4">
                <label class="font-bold block mb-2">时长（分钟）</label>
                <input type="number" id="modal-value" value="${record?.value || 30}"
                       inputmode="numeric" min="1" max="999" />
              </div>
            ` : ''}

            ${type === 'food' ? `
              <div class="mb-4">
                <label class="font-bold block mb-2">饱腹感（1-10）</label>
                <input type="number" id="modal-value" value="${record?.value || 7}"
                       inputmode="numeric" min="1" max="10" />
              </div>
            ` : ''}

            ${type === 'social' ? `
              <div class="mb-4">
                <label class="font-bold block mb-2">朋友类型</label>
                <div class="flex gap-2">
                  <button class="btn flex-1 ${record?.isNewFriend === false ? 'btn-secondary' : ''}"
                          onclick="App.selectFriendType(false)">老朋友</button>
                  <button class="btn flex-1 ${record?.isNewFriend === true ? 'btn-secondary' : ''}"
                          onclick="App.selectFriendType(true)">新朋友</button>
                </div>
                <input type="hidden" id="modal-newfriend" value="${record?.isNewFriend ?? false}" />
              </div>
            ` : ''}

            <div class="mb-4">
              <input type="text" id="modal-note" value="${record?.note || ''}"
                     placeholder="备注（可选）" class="w-full" />
            </div>

            <div class="time-picker-compact" onclick="App.toggleTimePicker()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6V12L16 14"/>
              </svg>
              <span id="modal-datetime-display">${defaultDate} ${defaultTime}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                <path d="M6 9L12 15L18 9"/>
              </svg>
            </div>
            <div id="time-picker-expanded" class="time-picker-expanded hidden">
              <input type="date" id="modal-date" value="${defaultDate}" onchange="App.updateDateTimeDisplay()" />
              <input type="time" id="modal-time" value="${defaultTime}" onchange="App.updateDateTimeDisplay()" />
            </div>

            <div class="flex gap-2 mt-6">
              ${record ? `
                <button class="btn btn-danger flex-1" onclick="App.deleteRecord()">删除</button>
              ` : ''}
              <button class="btn btn-secondary flex-1" onclick="App.saveRecord()">保存</button>
            </div>
          `}
        </div>
      </div>
    `;
  },

  selectType(type) {
    this.renderModal(type);
  },

  selectCategory(btn, category) {
    document.querySelectorAll('#modal-container .btn').forEach(b => {
      if (b.parentElement.previousElementSibling?.textContent === '类目') {
        b.classList.remove('btn-secondary');
      }
    });
    btn.classList.add('btn-secondary');
    document.getElementById('modal-category').value = category;
  },

  selectFriendType(isNew) {
    const buttons = document.querySelectorAll('#modal-container .btn');
    buttons.forEach(b => {
      if (b.textContent === '老朋友' || b.textContent === '新朋友') {
        b.classList.remove('btn-secondary');
        if ((b.textContent === '新朋友' && isNew) || (b.textContent === '老朋友' && !isNew)) {
          b.classList.add('btn-secondary');
        }
      }
    });
    document.getElementById('modal-newfriend').value = isNew;
  },

  toggleTimePicker() {
    const expanded = document.getElementById('time-picker-expanded');
    expanded.classList.toggle('hidden');
  },

  updateDateTimeDisplay() {
    const date = document.getElementById('modal-date').value;
    const time = document.getElementById('modal-time').value;
    document.getElementById('modal-datetime-display').textContent = `${date} ${time}`;
  },

  saveRecord() {
    const type = document.getElementById('modal-type').value;
    const category = document.getElementById('modal-category').value;
    const date = document.getElementById('modal-date').value;
    const time = document.getElementById('modal-time').value;
    const note = document.getElementById('modal-note').value.trim();

    let value = null;
    let isNewFriend = null;

    if (type === 'exercise' || type === 'food') {
      value = parseInt(document.getElementById('modal-value').value, 10);
    }
    if (type === 'social') {
      isNewFriend = document.getElementById('modal-newfriend').value === 'true';
    }

    const timestamp = new Date(`${date}T${time}`).getTime();

    const recordData = {
      type,
      category,
      value,
      isNewFriend,
      note: note || null,
      timestamp,
      date,
      month: date.slice(0, 7)
    };

    if (this.editingRecord) {
      Store.update(this.editingRecord.id, recordData);
    } else {
      Store.add(recordData);
    }

    this.closeModal();
    this.render();
  },

  deleteRecord() {
    if (this.editingRecord && confirm('确定删除这条记录吗？')) {
      Store.delete(this.editingRecord.id);
      this.closeModal();
      this.render();
    }
  },

  closeModal(event) {
    if (!event || event.target.classList.contains('modal-overlay')) {
      document.getElementById('modal-container').innerHTML = '';
      this.editingRecord = null;
    }
  }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => App.init());
