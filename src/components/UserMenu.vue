<template>
  <div class="q-pa-md">
    <q-fab icon="person" direction="down" color="secondary" padding="xs">
      <q-fab-action
        icon="manage_accounts"
        color="accent"
        to="/user"
        external-label
        label-position="left"
        label="Mis datos"
      />
      <q-fab-action
        icon="build"
        color="accent"
        href="https://wa.me/5493413341777"
        external-label
        label-position="left"
        label="Sugerencias y errores"
      />
      <q-fab-action
        icon="directions_run"
        color="accent"
        external-label
        label-position="left"
        label="Cerrar sesión"
        @click="async () => await auth.logOut()"
      />
    </q-fab>
  </div>
</template>

<script setup>
import { useAuth } from "../stores/auth";

const auth = useAuth();
</script>
