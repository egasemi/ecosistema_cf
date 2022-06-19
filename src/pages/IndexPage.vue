<template>
  <q-page class="flex flex-center"> </q-page>
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
