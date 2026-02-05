// store.js - 数据存储层

const Store = {
  STORAGE_KEY: 'funny-life-records',

  // 获取所有记录
  getAll() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // 保存所有记录
  saveAll(records) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
  },

  // 添加记录
  add(record) {
    const records = this.getAll();
    record.id = crypto.randomUUID();
    records.push(record);
    this.saveAll(records);
    return record;
  },

  // 更新记录
  update(id, updates) {
    const records = this.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      this.saveAll(records);
      return records[index];
    }
    return null;
  },

  // 删除记录
  delete(id) {
    const records = this.getAll();
    const filtered = records.filter(r => r.id !== id);
    this.saveAll(filtered);
  },

  // 按日期获取记录
  getByDate(date) {
    return this.getAll().filter(r => r.date === date);
  },

  // 按月份获取记录
  getByMonth(month) {
    return this.getAll().filter(r => r.month === month);
  },

  // 按类型和月份获取记录
  getByTypeAndMonth(type, month) {
    return this.getAll().filter(r => r.type === type && r.month === month);
  }
};
