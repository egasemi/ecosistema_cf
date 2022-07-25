<template>
  <div class="q-pa-md">
    <q-fab icon="person" direction="down" color="secondary" padding="xs">
      <q-fab-action icon="manage_accounts" color="accent" to="/user" />
      <q-fab-action
        icon="directions_run"
        color="accent"
        @click="async () => await auth.logOut()"
      />
    </q-fab>
  </div>
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
