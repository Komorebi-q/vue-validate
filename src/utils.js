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
//  test

const errMsg = (type, tag, ruleValue) => {
  const msg = {
    noEmpty: `${tag}不能为空`,
    regExp: `${tag}格式错误`,
    // limit: `${tag}必须在${ruleValue[0]}与${ruleValue[1]}之间`,
    equal:`两次${tag}不相同`,
    length: `${tag}长度不服`,
    unique: `${tag}不能相同`
  };

  return msg[type];
}

export const validateTest = {
  noEmpty (field, type, val) {
    const form = this.forms[field];

    if (val === '') {
      return new Result(type, val, false, errMsg(type, form.field));
    } else {
      return new Result(type, val, true, '');
    }
  },
  equal (field, type, val) {
    type = type.split('-')[0];
    const form = this.forms[field];
    const modifiers = form.modifiers;
    let  equalValue;
    modifiers.forEach(modifier => {
      let key = Object.keys(modifier)[0];
      if (key === type) {
        equalValue = this.forms[modifier[key]].value;
      }
    });

    if (equalValue === val) {
      return new Result(type, val, true, '');
    } else {
      return new Result(type, val, false, errMsg(type, field, [val, equalValue]));
    }
  },
  unique (field, type, val) {
    type = type.split('-')[0];
    const form = this.forms[field];
    const modifiers = form.modifiers;
    let  equalValue;
    modifiers.forEach(modifier => {
      let key = Object.keys(modifier)[0];
      if (key === type) {
        equalValue = this.forms[modifier[key]].value;
      }
    });

    if (equalValue !== val) {
      return new Result(type, val, true, '');
    } else {
      return new Result(type, val, false, errMsg(type, field, [val, equalValue]));
    }
  },
  length (field, type, val) {
    type = type.split('-')[0];
    const form = this.forms[field];
    const modifiers = form.modifiers;
    let len;
    modifiers.forEach(modifier => {
      let key = Object.keys(modifier)[0];
      console.log(modifier);
      if (key === type) {
        len = modifier[key];
      }
    });

    if (len === val.length) {
      return new Result(type, val, true, '');
    } else {
      return new Result(type, val, false, errMsg(type, field));
    }
  },
  max () {},
  min () {},
  regExp () {}
}

const testData = [
  'noEmpty',
  'equal',
  'unique',
  'regExp',
  'max',
  'min',
  'length'
];

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

  setResult (field) {
    // 获取result
  },

  validate (field, type) {
    // 进行单个验证
    const form = this.forms[field];

    if (type !== void 0) {
      return this.checkRule(field, form.rules[type], form);
    } else {
      return this.checkForm(field);
    }   
  },
  
  checkForm (field) {
    const form = this.forms[field];
    const {rules} = form;
    const result = [];

    rules.forEach(rule => {
      result.push(this.checkRule(field, rule.type.split('-')[0], form));
    });
    console.log(result);
  },

  checkRule (field, rule, form) {
    const checkers = {};

    testData.forEach(item => {
      checkers[item] = this.validateTest[item].bind(this);
    });

    return checkers[rule](field, rule, form.value)
  },

  checkAll () {},

  addRules (field, rule, index) {},
  
  addNoCheck (fields) {}
}

