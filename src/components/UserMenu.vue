<template>
  <div class="q-pa-md">
    <q-fab icon="person" direction="down" color="secondary" padding="xs">
      <q-fab-action icon="manage_accounts" color="accent" />
      <q-fab-action icon="directions_run" color="accent" @click="logOut" />
    </q-fab>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../stores/auth";

export default {
  setup() {
    const auth = useAuth();
    const router = useRouter();

    const logOut = async () => {
      await auth.logOut();
      router.push({ name: "login" });
    };

    return {
      auth,
      logOut,
    };
  },
};
</script>
