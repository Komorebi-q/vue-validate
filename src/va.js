/* eslint-disable */
import { Form, Result, Rule, DisplayResult } from './class';
import config from './config';
import { assert, mergeRule, validateFn, validateTest } from './utils';

const {
  refreshValue,
  getValue,
  setResult,
  validate,
  checkAll,
  checkForm,
  checkRule,
  addNoCheck,
  addRules
} = validateFn;

let Vue;
let va;

const Va = function (vm, field, opts) {
  const va = {
    vm,
    result: {}, // 验证结果
    fieldOrder: [], // 表单域的队列
    forms: {}, // 表单集合
    groups: { // 群组集合 
      base: []
    },
    equalGroup: {}, // 相等表单群组
    unqiueGroup: {}, // 不相等群组
    classes: { // 构造类集合
      Form,
      Result,
      Rule,
      DisplayResult
    },
    opts: {
      ...config,
      ...opts,
      regExps: {
        ...config.regExps,
        ...(opts.regExps || {})
      }
    },
    // methods
    refreshValue,
    getValue,
    setResult,
    validate,
    checkAll,
    checkRule,
    checkForm,
    addNoCheck,
    addRules,
    validateTest
  }

  if (vm.$va) {
    return vm.$va;
  } else {
    vm.$va = va;
    return va;
  }
}

function getFinalRules (field, modifiers, componentOpts, regExps) {
  // rules
  let baseRules = [];
  let componentRules = [];
  let finalRules = [];
  
  const baseKeys = Object.keys(modifiers); 
  baseRules = baseKeys.map(key => {
    return new Rule('regExp', regExps[key], '', key);
  });

  componentRules = componentOpts.map(item => {
    let key = Object.keys(item)[0];

    return new Rule(key, item[key], '');
  });
  
  finalRules = mergeRule(...baseRules, ...componentRules);

  finalRules.forEach(rule => {
    const { type, val } = rule;

    switch (type.split('-')[0]) {
      case 'equal':
        if (va.equalGroup[field] === void 0) {
          va.equalGroup[field] = [val];
        } else {
          va.equalGroup[field].push(val);
        }
        break;
      case 'unique':
        if (va.unqiueGroup[field] === void 0) {
          va.unqiueGroup[field] = [val];
        } else {
          va.unqiueGroup.push(val);
        }
        break;
      default: 
        break;    
    }
  });

  return finalRules;
  // rules
}

export default {
  install: function (_Vue, options) {
    Vue = _Vue;

    Vue.directive('va', {
      bind (el, binding, vnode) {
        const vm = vnode.context;
        const field = binding.arg;
        const group = el.getAttribute('group') || 'base';
        const modifiers = binding.modifiers;
        const componentOpts= binding.value || [];
        config.regExps = {...config.regExps, ...vm.regExps};
        va = new Va(vm, field, options);
        const regExps =  va.opts.regExps;
        
         // warn
         // assert(tag, '[va-warn] 未提供 tag');
         assert(field, '[va-warn] 未提供 arg');
         assert(vm.va, '[va-warn] 未提供 va');
         // warn

        va.fieldOrder.push(field);
        if (va.groups[group]) {
          va.groups[group].push(field);
        } else { 
          va.groups[group] = [field];
        }

        const finalRules = getFinalRules(field, modifiers, componentOpts, regExps);

        const form = new Form(el, finalRules, componentOpts, {...va.opts, field});
        va.forms[field] = form;

        if (form.checkType === 'single') {
          function singleValidate () {
            va.refreshValue();
            if (!form.canEmpty && form.value === '') {
              va.result[field] = {isPass: true};
              return;
            }
            va.validate(field);
          }

          if (!form.noCheck) {
            form.listenerMethods.forEach(method => {
              el.addEventListener(method, singleValidate);
            });    
          }
        }
      }
    })
  }
}