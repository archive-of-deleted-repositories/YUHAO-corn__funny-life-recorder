// score.js - 积分计算逻辑

const Score = {
  // GIF URLs
  GIFS: {
    good: 'https://media.giphy.com/media/cabGjXc02QutwiIaKO/giphy.gif',
    normal: 'https://media.giphy.com/media/XlPYdm2hexRMpmBleo/giphy.gif',
    bad: 'https://media.giphy.com/media/fVYdmzeXoq7eVIhgjw/giphy.gif'
  },

  // 计算单条记录的积分
  calculateScore(record) {
    switch (record.type) {
      case 'exercise':
        return Math.floor(record.value / 10);
      case 'food':
        if (record.value <= 7) return 5;
        if (record.value === 8) return 2;
        if (record.value === 9) return 0;
        if (record.value >= 10) return -2;
        return 0;
      case 'social':
        return record.isNewFriend ? 5 : 2;
      default:
        return 0;
    }
  },

  // 获取当日总积分
  getTodayScore(records) {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.date === today);
    return todayRecords.reduce((sum, r) => sum + this.calculateScore(r), 0);
  },

  // 根据积分获取状态 GIF
  getStatusGif(score) {
    if (score >= 15) return this.GIFS.good;
    if (score >= 5) return this.GIFS.normal;
    return this.GIFS.bad;
  },

  // 获取月度统计（按类型）
  getMonthStats(records, type, month) {
    const filtered = records.filter(r => r.type === type && r.month === month);

    switch (type) {
      case 'exercise':
        return {
          total: filtered.reduce((sum, r) => sum + r.value, 0),
          count: filtered.length,
          label: '总运动时长',
          unit: '分钟'
        };
      case 'food':
        const avg = filtered.length > 0
          ? (filtered.reduce((sum, r) => sum + r.value, 0) / filtered.length).toFixed(1)
          : 0;
        return {
          total: avg,
          count: filtered.length,
          label: '平均饱腹感',
          unit: ''
        };
      case 'social':
        const newFriends = filtered.filter(r => r.isNewFriend).length;
        const oldFriends = filtered.filter(r => !r.isNewFriend).length;
        return {
          total: filtered.length,
          newFriends,
          oldFriends,
          label: '社交次数',
          unit: '次'
        };
      default:
        return { total: 0, count: 0 };
    }
  }
};
