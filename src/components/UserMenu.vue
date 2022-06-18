<template>
  <div class="q-pa-md">
    <q-btn icon="person" flat fab-mini>
      <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Settings</div>
            <!--             <q-toggle label="Use Mobile Data" />
            <q-toggle label="Bluetooth" /> -->
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <q-icon name="person" />
            </q-avatar>

            <div class="text-subtitle1 text-capitalize q-mt-md q-mb-xs">
              {{ auth.username }}
            </div>

            <q-btn
              color="primary"
              label="Cerrar Sesión"
              size="sm"
              @click="logOut"
              v-close-popup
            />
          </div>
        </div>
      </q-menu>
    </q-btn>
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

    const logOut = () => {
      auth.logOut();
      router.push({ name: "login" });
    };

    return {
      auth,
      logOut,
    };
  },
};
</script>
