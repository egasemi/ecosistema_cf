<template>
  <router-view />
</template>

<script>
import { onMounted } from "vue-demi";
import { useAuth } from "./stores/auth";

export default {
  setup() {
    const auth = useAuth();
    onMounted(() => {
      auth.checkAuth();
    });
  },
};
</script>
