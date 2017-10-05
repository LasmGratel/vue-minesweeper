<template>
  <div id="app">
    <hello></hello>
  </div>
</template>

<script>
  require('jQuery');
  require('bootstrap');
  require('bootstrap/dist/css/bootstrap.min.css');
  require('./assets/style.css');
import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
