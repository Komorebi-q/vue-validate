import { randomString } from './utils';

export class Form {
  constructor (el, rules, modifiers = {}, opts) {
    this.el = el; 
    this.value = el.value;
    this.rulesOrder = rules.map(rule => {
      return rule.type;
    }); // 验证顺序
    this.rules = rules; // 表单控件的规则
    this.modifiers = modifiers; // 用户配置
    this.field = opts.field; // field
    this.msg = {
      correct: '',
      err: ''
    },
    this.regExps = opts.regExps;
    this.checkType = el.getAttribute('checkType') || opts.checkType;
    this.noCheck = el.hasAttribute('noCheck') || opts.noCheck;
    this.canEmpty = el.hasAttribute('canEmpty') || opts.canEmpty;
    this.listenerMethods = el.getAttribute('listenerMethods') || opts.listenerMethods;
  }
}

export class Result {
  constructor (type, val, isPass, msg) {
    this.type = type.split('-')[0];
    this.val = val;
    this.isPass = isPass;
    this.msg = msg;
  }
}

export class Rule {
  constructor (type, val, msg, key) {
    this.type = `${type}-${randomString(8)}`;
    this.val = val;
    this.msg = msg;
    this.key = key;
  }
}

export class DisplayResult {
  constructor (isPass, msg) {
    this.isPass = isPass;
    this.msg = msg;
  }
}