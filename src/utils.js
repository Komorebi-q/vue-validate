/* eslint-disable */
import { Result, DisplayResult } from './class';

export const assert = (condition, msg) => {
  if (!condition) {
    console.warn(`[va-warn]:${msg}`);
  }  
}

export const randomString = (max) => {
  const bytes = [
    '0', '1', '2', '3', '4', '5', 
    '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', 
    'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'W',
    'X', 'Y', 'Z', 
    '~', '!', '@', '/', '~', '`',
    '#', '$', '%', '^', '&', '*',
    '(', ')', '_', '+', '{', '}',
    '|', ',',' <', '>', '[', ']',
    '\\', ':', '\'', '"', '.', '?'
  ];

  const len = bytes.length;
  let result = '';
  
  for (let i = 0; i < max; i++) {
    result += bytes[Math.floor(Math.random()*len)];
  }

  return result;
}

export const mergeRule = (...rules) => {
  const result = [];
  const hash = {};
  
  rules.forEach(rule => {
    if (hash[rule.type] === void 0) {
      result.push(rule);
      hash[rule.type] = result.length - 1;
    } else {
      Object.assign(result[hash[rule.type]], rule);
    }
  });
  
  return result;
}

/*
  @params{dom: target}
  @params{className: object | string}
*/
export const addClass = (dom, className = '') => {
  let result = '';
  let classList = {};

  for (let i = 0, len = dom.classList.length; i < len; i++) {
    let target = dom.classList[i];
    classList[target] = target; 
  }

  if (Array.isArray(className)) {
    className.forEach(item => {
      classList[item] = item;
    });
  } else {
    classList[className] = className;
  }

  const newClasses = Object.keys(classList);
  newClasses.forEach(item => {
    result += `${item} `;
  });

  result = result.trim();
  dom.className = result;

  return result;
}

const validateTest = {
  testEmpty () {},
  testEqual () {},
  testUnqiue () {},
  testLength () {},
  testMax () {},
  testMin () {},
  testRegExp () {}
}

export const validateFn = {
  // $va 对象的方法
  refreshValue (field) {
    if (field !== void 0) {
      const form = this.forms[field];
      form.value = form.el.value;
    } else {
      let keys = Object.keys(this.forms);
      keys.forEach(key => {
        let form = this.forms[key];
        form.value = form.el.value;
      });
    }
  },

  getValue (field) {
    let result;
    const forms = this.forms;

    this.refreshValue();
    if (field !== void 0) {
      return forms[field].value;
    } else {
      result = {};
      const keys = Object.keys(forms);

      keys.forEach(key => {
        result[key] = forms[key].value;
      });
    }

    return result;
  },

 /*  setValue (field, val = '') {
    const forms = this.forms;

    forms[field].value = val;
    forms[field].el.value = val;
  },

  setValues (targets) {
    const forms = this.forms;
    const keys = Object.keys(targets);

    keys.forEach(key => {
      forms[key].value = targets[key];
      forms[key].el.value = targets[key];
    });
  } */

  setResult (field) {
    // 获取result
  },

  validate (field, type) {
    // 进行单个验证
    const form = this.forms[filed];

    if (type !== void 0) {
      return this.checkRule(field, form.rules[type]);
    } else {
      return this.checkForm(field);
    }   
  },
  
  checkForm (field) {
    const form = this.forms[field];
    const {rules} = form;
  },

  checkRule (field, rule) {
    const checker = {
      testEmpty: validateTest.testEmpty,
      testLength: validateTest.testLength,
      testMax: validateTest.testMax,
      testMin: validateTest.testMin,
      testUnqiue: validateTest.testUnqiue,
      testRegExp: validateTest.testRegExp      
   }
  },

  checkAll () {},

  addRules (field, rule, index) {},
  
  addNoCheck (fields) {}
}

