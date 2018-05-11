/* eslint-disable */
import { assert, mergeRule, randomString } from './utils';
import regData from './regExp';

let Vue;
let checkWhenChange = true  //每个输入框需要离焦即校验

let regList = {...regData};

// Rule 构造类
class Rule {
  constructor (type, val, msg) {
    this.type = `${type}-${randomString(8)}`; // 生成随机hash, 支持多个相同类型验证
    this.val = val; 
    this.msg = msg || '';
  }
}

// Form 构造器
class Form {
  constructor (el, finalRules, modifiers) {
    this.ruleOrder = [];
    this.rules = {};
    this.dom = el;
    this.val = el.value; 
    this.validated = fasle; // 是否被验证过
    this.tag = el.getAttribute('tag');
    this.correctMsg = '';
    this.modifiers = modifiers;
    this.noCheck = fasle; // 要不要验证

    this.ruleOrder = finalRules.map(rule => {
      this.rules[item.type] = item;
      return item.type;
    });
  }
}

class Validate {}

class Result {
  constructor (type, val, isPass, msg) {
    this.type = type;
    this.val = val;
    this.isPass = isPass;
    this.msg = msg;
  }
}

class DisplayResult {
  constructor (isPass, message) {
    this.isPass = isPass
    this.message = message
  }
}

function refreshValue (field, newValue) {
  this.forms[field].value = newValue + '';
}

function setResult (field) {
  const result = this.validate(field);
  this.result[field] = result;
  this.forms[field].validated = true;
  return result;
}

function validate (field, ruleType) {
  assert(field, '未输入要验证的字段');
  const vaForm = this.forms[field];
  const {ruleOrder, rules} = vaForm;

  if (ruleType === void 0) {
    return this.checkForm(vaForm);
  } else {
    let rule = rules[ruleType];
    return this.checkRule(vaForm, rule);
  }
}

function getErrMsg (vaForm, ruleType, ruleValue) {
  const tag = vaForm.tag;

  const errMsgs = {
    NonEmpty: `${tag}不能为空`,
    reg: `${tag}格式错误`,
    limit: `${tag}必须在${ruleValue[0]}与${ruleValue[1]}之间`,
    equal:`两次${tag}不相同`,
    length: `${tag}长度必须在${ruleValue[0]}与${ruleValue[1]}之间`,
    unique: `${tag}不能相同`
  }
  return errMsgs[ruleType]
}

function checkRule (vaForm, rule) {
  const forms = this.froms;
  const {type, val, msg} = rule;
  msg = msg || getErrMsg(vaForm, type, val);

  const ruleCheckers = {
    NonEmpty: checkEmpty,
    reg: checkReg,
    limit: checkLimit,
    equal: checkEqual,
    length: checkCharLength,
    unique: checkUnique
  };

  const ruleChecker = ruleCheckers[ruleType];
  const isPass = ruleChecker.call(this, ruleValue, vaForm);
  const result = new Result(type, val, isPass, isPass ? null : msg);

  return result;
}

function checkForm (vaForm) {
  const results = vaForm.ruleOrder.map(type => {
    let rule = vaForm.rules[type];
    return this.checkRule(vaForm, rule);
  });

  let errIndex = null;

  for (let i = 0; i < results.length; i++) {
    let result = results[i];

    if (result.isPass === false) {
      errIndex = i;
      break;
    }
  }

  if (errIndex === null) {
    return new DisplayResult(true, vaForm.correctMsg);
  } else {
    return new DisplayResult(false, results[errIndex].errMsg);
  }
}

function refreshValue () {
  this.fieldOrder.forEach(field => {
    let vaForm = this.forms[field];
    vaForm.value = vaForm.dom.value;
  })
}

function checkAll () {
  let firstErr = null;
  console.log(this);
  this.fieldOrder.forEach(field => {
    const vaForm = this.forms[field];
    const canNull = vaForm.ruleOrder.every(ruleType => ruleType === false);

    if (vaForm.noCheck === false && noCheckEmpty === false) {
      var result = this.setResult(field);
      if(firstErr === null && result.isPass === false){
        firstErr = result.message
      }
    }
  });

  return firstErr;
} 

function getValue () {
  const dataStr = {};

  for (let field in this.forms) {
    dataStr[field] = this.forms[field].value;
  }

  return dataStr;
}

function setNoCheck (field, bool) {
  this.forms[field].noCheck = bool;
}

function addRule (field, index, Rule) {
  const vaForm = this.forms[field];
  
  vaForm.ruleOrder.splice(index, 0, Rule.type);
  vaForm.rules[Rule.type] = Rule;
}

function refreshAllValue () {
  this.fieldOrder.forEach(field => {
    let vaForm = this.forms[field];
    vaForm.value = vaForm.dom.value;
  });
}


// va 构造器
const createVa = function (vm, field) { 
  let va = {
    result: vm.va,
    fieldOrder: [],
    forms: {},
    group: {
      base: []
    },
    equalGroup: {},
    uniqueGroup: {},
    Rules: [],
    Form,
    validate,
    // methods
    refreshValue,         // 更新某个表单的值
    setResult,            // 检验并报错
    checkForm,
    checkRule,
    refreshValue,         //更新某个表单的值
    checkAll,             //检查所有的函数
    getValue,             //获取所有表单的当前值，得到一个对象
    setNoCheck,           //设置为不校验
    addRule,              //给一个表单添加一个规则
    refreshAllValue 
  } 

  if (vm.$va) {
    return vm.$va;
  } else {
    vm.$va = va;
    return va;
  }
}

const main = {};

// options: {
//  reg: 覆盖正则规则
//  key: reg  
// }

main.install = (_Vue, options) => {
  Vue = _Vue;
  regList = {...regList, ...(options.reg || {})}; // merge 插件配置正则

  Vue.directive('va', {
    bind(el, binding, vnode) {
      const vm = vnode.context; // 当前vue实例
      const baseRule = []; // 匹配到的默认规则
      const optionalRule = []; // ~ data 中匹配到的规则
      let customRule = []; // ~ 用户自定义规则
      const field = binding.arg; // 每个 input 的标识
      const group = el.getAttribute('group') || 'base'; // 匹配群组
      let option = binding.modifiers; // 规则参数
      let value = el.value; // 自定义 rule val
      let tag = el.getAttribute('tag'); // tag
      let regMsg = el.getAttribute('regMsg') || ''; // 自定义报错信息

      // warn 断言
      assert(tag, '未设置 tag 属性');
      assert(vm.va, 'data 未设置 va 对象');
      assert(field, '未设置输入框字段');

      regList = {...regList, ...(vm.reg || {})}; // merge 组件 data.reg 正则

      const va = createVa(vm, field);

      va.fieldOrder.push(field);
      va.group[group].push(field);

      const canNull = new Rule('NonEmpty', true, '');
      if (option.canNull === void 0) {
        baseRule.push(canNull);
      }

      // rule 处理
      if (regList[field]) {
        optionalRule.push(new Rule('reg', regList[field], regMsg));
      }

      const userRegKeys = Object.keys(option);
      for (let i = 0, len = userRegKeys.length; i < len; i++) {
        var curReg = userRegKeys[i];
        if (regList[curReg]) {
          optionalRule.push(new Rule('reg', regList[curReg], regMsg));
        }
      }

       //用户自定义的规则
       if(binding.value !== undefined){
        customRule = binding.value.map(item=>{
          var ruleType = Object.keys(item)[0];
          var errMsg = ruleType === 'reg' ? regMsg : ''
          return new Rule(ruleType, item[ruleType], errMsg)
        })
      }

      const finalRules = mergeRule(...baseRule, ...optionalRule, ...customRule);

      let hasUniqueRule = false;
      finalRules.forEach(rule => {
        let {type, val} = rule;
        if (type.startsWith('equal')) {
          hasUniqueRule = val;
          if (va.equalGroup[val] === void 0) {
            va.equalGroup[val] = [field];
          } else {
            va.equalGroup[val].push(field);
          }
        }  

        if (type.startsWith('unique')) {
          hasUniqueRule = val;
          if (va.uniqueGroup[val] === void 0) {
            va.uniqueGroup[val] = [field];
          } else {
            va.uniqueGroup[val].push(filed);
          }
        } 
      });
      // rule 处理

      const vaForm = new FormData(el, finalRules, option);
      va.forms[field] = vaForm;

      if (checkWhenChange) {
        function validateSingle () {
          va.refreshValue(field, el.value)  //更新值
        }

        if (vaForm.value === '' && option.canNull) {
          va.result[field] = {};
          return;
        }

        if (vaForm.noCheck === false) {
          va.setResult(field)
        }
        
        let isEqualTarget = false;
        for (let key in va.equalGroup) {
          if (key === field) {
            isEqualTarget = true;
          }
        }

        if (isEqualTarget) {
          va.equalGroup[field].forEach(item => {va.setResult(item)});
        }

        if(hasUniqueRule){
          va.uniqueGroup[hasUniqueRule].forEach(item => {va.setResult(item)})
        }

        if (!form.noCheck) {
          el.addEventListener('change', validateSingle);
          el.addEventListener('blur', validateSingle);
        }
      }
    }
  });
}

export default main;