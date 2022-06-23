<template>
  <q-page class="flex flex-center">
    <span class="text-h4">Inicio</span>
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
