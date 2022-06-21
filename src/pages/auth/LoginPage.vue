<template>
  <q-page class="row flex flex-center">
    <div class="col-xs-12 col-sm-4 col-md-4 q-pa-md">
      <h5 class="q-my-md text-center">Ingresar</h5>
      <q-card>
        <q-card-section>
          <q-form class="q-pa-md q-gutter-y-md">
            <q-input
              type="text"
              label="Usuaria"
              placeholder="DNI, Celular o Email"
              v-model="credentials.user"
            />
            <q-input
              type="password"
              label="Contraseña"
              v-model="credentials.pin"
              @keyup.enter="login"
            />
            <q-btn color="positive" class="full-width" @click="login">
              Ingresar
            </q-btn>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { ref } from "vue";
import { useAuth } from "stores/auth";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
export default {
  setup() {
    const $q = useQuasar();

    const auth = useAuth();
    const router = useRouter();
    const credentials = ref({
      user: "",
      pin: "",
    });

    const login = async () => {
      const res = await auth.autenticacion(credentials.value);
      if (res.resultado === "error") {
        $q.notify({
          message: res.detalle_error,
          type: "negative",
          icon: "error",
        });
      } else {
        router.push({ name: "inicio" });
      }
    };

    return {
      credentials,
      auth,
      login,
    };
  },
};
</script>
