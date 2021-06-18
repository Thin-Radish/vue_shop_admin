<template>
  <div>
    <el-button type="info" @click="logout">登出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      logout() {
        window.sessionStorage.removeItem('token');
        this.$router.push('/login');
      }
    }
  }
</script>

<style lang= "less" scoped>

</style>