<template>
  <div>
    <h1>这是模拟登录页</h1>
    <button @click="handleClickLogin">点击登录</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions({
      login: "login"
    }),
    handleClickLogin() {
      this.login().then(res => {
        this.$router.push("/");
      });
    }
  }
};
</script>

<style>
</style>