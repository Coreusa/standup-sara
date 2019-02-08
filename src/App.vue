<template>
  <div id="app">
    <div class="container-fluid">
      <router-view/>
    </div>
  </div>
</template>

<style lang="less">
#app {
  text-align: center;
  font-family: Helvetica;
  background: url('/static/standup-sara.png') bottom right no-repeat #f4f4f4;
  background-size: 30%;
  height: 100vh;
}
.container-fluid {
  padding: 20px;
}
</style>
