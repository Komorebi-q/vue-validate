<template>
  <div id="app">
    <input
      type="text" 
      v-model.trim="val"
      tag = "登录密码"
      v-va:Password
    >
    <hr>
    <input 
      type="text"
      v-model.trim="val2"
      tag="testPassword"
      v-va:Password2
    >
    <hr>
    <input
      type="text" 
      v-model.trim="val1"
      tag = "确认密码"
      v-va:checkPassword.Password.Test = "[{'equal': 'Password'}, {'unique': 'Password2'}, {'noEmpty': true}, {'length': 10}]"
    >
    <button @click="check"> CHECK </button>
  </div>
</template>

<script>
import { addClass } from './utils';

export default {
  name: 'app',
  data () {
    return {
      va: {},
      regExps: {
          'Test111': /a/
      },
      val: 'dasdad',
      val1: 'aaa',
      val2: ''
    }
  },
  components: {
  },
  methods: {
    check () {
      
    }
  },
  mounted () {
    console.log(this.$va);
  }
}
</script>

<style lang="scss" scoped>
  #app {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    >input {
      width: 400px;
      height: 30px;
      border-radius: 10px;
      &.error {
        border: red 2px solid;
      }
    }
  }
</style>

