<template>
  <div class="nav">
    <button v-for="item in navList" :key="item.path" @click="$router.push({name:item.name})">{{item.name}}</button>
  </div>
</template>

<script>
export default {
  name: "Nav",
  computed: {
    navList() {
      return this.$store.state.permission.routes.filter(v => !v.hidden);
    }
  }
};
</script>