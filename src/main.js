import Vue from 'vue'
import App from './App.vue'
import validate from './va'
import './style.scss'

Vue.config.productionTip = false
Vue.use(validate, {
  // noCheck: true, // 默认不检查
  // canEmpty: true, // 可为空
  regExps: {
    Test: /a/
  }, // 新添加的验证规则
  listenerMethods: [
    // 验证监听事件
    'input'
  ],
  checkType: "single", // single, all 验证方式
  errMsg: {
    phone: '手机格式错误'
  }, // 错误信息
  errClass: "error" // 错误类名
});

new Vue({
  render: h => h(App)
}).$mount('#app')
