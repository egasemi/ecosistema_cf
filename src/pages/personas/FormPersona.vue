<template>
  <q-page class="row flex flex-center">
    <div class="col-xs-12 col-sm-8 col-md-8 q-pa-md">
      <q-form class="q-gutter-xs">
        <q-input
          outlined
          label="DNI"
          type="tel"
          reverse-fill-mask
          mask="##.###.###"
          unmasked-value
          maxlength="10"
          v-model="data.dni"
          :rules="[(val) => !!val || 'Campo requerido']"
        />
        <q-input
          outlined
          label="Nombre"
          type="text"
          v-model="data.nombre"
          :rules="[(val) => !!val || 'Campo requerido']"
        />
        <q-input
          outlined
          label="Apellido"
          type="text"
          v-model="data.apellido"
          :rules="[(val) => !!val || 'Campo requerido']"
        />
        <q-input
          outlined
          label="Contacto"
          type="tel"
          v-model="data.contacto.telefonos[0]"
          bottom-slots
        />
        <q-input
          outlined
          label="Email"
          type="email"
          v-model="data.contacto.emails[0]"
          bottom-slots
        />
        <q-input
          outlined
          label="Apodo"
          type="text"
          v-model="data.apodo"
          bottom-slots
        />
        <q-input
          outlined
          label="Profesión"
          type="text"
          v-model="data.profesion"
          bottom-slots
        />
        <q-card flat bordered class="bg-transparent q-mb-lg">
          <q-card-section class="q-pb-none">
            <div class="text-body1">Domicilio</div>
          </q-card-section>
          <q-card-section
            class="row justify-between items-center q-gutter-y-md bg-none"
          >
            <q-input
              label="Dirección"
              v-model="domicilio.direccion"
              class="col-12"
            />
            <q-toggle
              class="toggle"
              left-label
              keep-color
              :color="domicilio.dni ? 'positive' : 'negative'"
              checked-icon="done"
              unchecked-icon="clear"
              toggle-indeterminate
              v-model="domicilio.dni"
              label="Domicilio DNI"
            />
            <q-toggle
              class="toggle"
              left-label
              keep-color
              :color="domicilio.actual ? 'positive' : 'negative'"
              checked-icon="done"
              unchecked-icon="clear"
              toggle-indeterminate
              v-model="domicilio.actual"
              label="Domicilio actual"
            />
          </q-card-section>
        </q-card>
        <q-input
          outlined
          label="Fecha de nacimiento"
          v-model="nacimiento"
          type="date"
          stack-label
          bottom-slots
        />
        <q-input
          outlined
          label="Observaciones"
          type="textarea"
          autogrow
          v-model="data.observaciones"
          bottom-slots
        />
        <div class="row justify-between">
          <q-btn label="Cancelar" @click="router.back()" color="negative" />
          <q-btn label="Guardar" @click="send" color="positive" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script>
import { computed, ref } from "vue-demi";
import { useModules } from "src/stores/modules";
import { date, Loading, Notify } from "quasar";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const busqueda = useModules();
    const data = ref({
      dni: "",
      nombre: "",
      apellido: "",
      apodo: "",
      apodo: "",
      contacto: {
        emails: [""],
        telefonos: [""],
      },
      profesion: "",
      domicilios: [],
      nacimiento: "",
      observaciones: "",
    });
    const domicilio = ref({
      dni: null,
      actual: null,
      direccion: "",
    });

    if (busqueda.personas.detalle !== null) {
      data.value = busqueda.personas.detalle;
    }

    if (data.value.domicilios.length > 0) {
      domicilio.value = data.value.domicilios[0];
    }

    const nacimiento = computed({
      get() {
        return date.formatDate(
          date.addToDate(data.value.nacimiento, { hours: 3 }),
          "YYYY-MM-DD"
        );
      },
      set(newValue) {
        data.value.nacimiento = date.formatDate(
          date.addToDate(newValue, { hours: 3 }),
          "YYYY-MM-DDT03:mm:ss.SSS[Z]"
        );
      },
    });

    const send = async () => {
      Loading.show();
      if (domicilio.value.direccion !== "") {
        data.value.domicilios = [
          {
            direccion: domicilio.value.direccion,
            dni: domicilio.value.dni,
            actual: domicilio.value.actual,
          },
        ];
      } else {
        data.value.domicilios = [];
      }

      [
        "etiquetas",
        "modificacion",
        "modificacion_por",
        "creacion",
        "creacion_por",
      ].forEach((elem) => {
        delete data.value[elem];
      });

      let res = await busqueda.moduleEdit(
        "personas",
        data.value._id,
        data.value
      );
      console.log(res);
      if (res?.resultado === "ok") {
        router.push({
          name: "persona",
          params: { id: busqueda.personas.detalle._id },
        });
        Notify.create({
          message: "El registro se guardó correctamente",
          type: "positive",
          icon: "done",
        });
      } else {
        Notify.create({
          message: res ? res?.detalle_error : "Error desconocido",
          type: "negative",
          icon: "error",
        });
      }
      Loading.hide();
    };

    return {
      send,
      data,
      domicilio,
      nacimiento,
      router,
    };
  },
};
</script>

<style>
.q-toggle__thumb:after {
  background-color: var(--q-negative);
}
.q-card--dark {
  border-color: rgba(255, 255, 255, 0.6);
}
.q-card--dark:hover {
  border-color: rgba(255, 255, 255);
}
</style>
