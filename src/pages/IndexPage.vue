<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
  </q-page>
</template>

<script>
import { useAuth } from "../stores/auth";

export default {
  setup() {
    const auth = useAuth();
    return {
      auth,
    };
  },
};
</script>
