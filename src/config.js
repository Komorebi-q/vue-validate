import regData from './regExp';

export default {
  noCheck: false, // 默认不检查
  canEmpty: false, // 可为空
  regExps: regData, // 新添加的验证规则
  listenerMethods: [
    // 验证监听事件
    'blur',
    'change'
  ],
  checkType: 'all', // single, all 验证方式
  errMsg: {}, // 错误信息
  errClass: 'n-error' // 错误类名
};
