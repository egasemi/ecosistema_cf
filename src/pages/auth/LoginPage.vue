<template>
  <q-page class="flex flex-center" padding>
    <div>
      <h5 class="q-my-md text-center">Ingresar</h5>
      <q-card>
        <q-card-section>
          <q-form class="q-pa-md q-gutter-y-md">
            <q-input type="number" label="DNI" v-model="credentials.dni" />
            <q-input
              type="password"
              label="Contraseña"
              v-model="credentials.pin"
            />
            <q-btn color="positive" class="full-width" @click="getToken">
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
      dni: "",
      pin: "",
    });

    const getToken = async () => {
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
      getToken,
    };
  },
};
</script>
