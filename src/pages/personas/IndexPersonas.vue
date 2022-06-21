<template>
  <q-page
    :class="`row ${result ? 'justify-center' : 'flex flex-center'} gutter-8`"
  >
    <div class="col-xs-12 col-sm-8 col-md-8 q-pa-md">
      <q-input
        bottom-slots
        rounded
        outlined
        label="Búsqueda personas"
        v-model="personas.personas.search"
        @keyup.enter="search(true)"
      >
        <template v-slot:append>
          <q-btn round dense icon="search" @click="search(true)" />
        </template>
        <template v-slot:hint>
          Ingresá un Nombre, Apellido, DNI o Teléfono para buscar una persona
        </template>
      </q-input>
    </div>
    <div
      class="col-xs-12 col-sm-8 col-md-8"
      v-if="personas.personas.resultados.length !== 0"
    >
      <q-list>
        <q-item-label header
          >Resultados ({{ personas.personas.coincidencias }})</q-item-label
        >
        <q-infinite-scroll @load="load">
          <div
            v-for="(per, index) in personas?.personas.resultados"
            :key="per._id"
          >
            <q-separator v-if="index !== 0" />
            <q-item clickable v-ripple class="q-pa-md">
              <q-item-section avatar top>
                <q-icon name="account_circle" size="34px" />
              </q-item-section>

              <q-item-section top>
                <q-item-label lines="1">
                  <span class="text-weight-medium text-capitalize"
                    >{{ per.nombre }} {{ per.apellido }}</span
                  >
                  <span class="text-grey-8"></span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <q-icon name="badge" v-if="per.dni !== null" />
                  {{ per.dni }}
                </q-item-label>
              </q-item-section>

              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    :disable="per.contacto.telefonos[0] === undefined"
                    :color="
                      per.contacto.telefonos[0] === undefined
                        ? 'grey'
                        : 'positive'
                    "
                    size="12px"
                    flat
                    dense
                    round
                    icon="phone"
                    :href="`https://wa.me/549${per.contacto.telefonos[0]}`"
                    target="_blank"
                  />
                  <q-btn
                    :disable="per.contacto.emails[0] === undefined"
                    :color="
                      per.contacto.emails[0] === undefined ? 'grey' : 'positive'
                    "
                    size="12px"
                    flat
                    dense
                    round
                    icon="email"
                    :href="'to:' + per.contacto.emails[0]"
                  />
                </div>
              </q-item-section>
            </q-item>
          </div>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-list>
    </div>
    <div class="flex column" v-if="showNew">
      <p class="text-color-indigo">No se encontraron resultados</p>
      <q-btn icon="add" color="positive" fab>Agregar Persona</q-btn>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue-demi";
import { useModules } from "stores/modules";
import { useQuasar } from "quasar";

export default {
  setup() {
    const $q = useQuasar();

    const person = ref("");
    const p = ref(0);
    const result = ref(false);
    const showNew = ref(false);
    const personas = useModules();

    const search = async (first) => {
      if (first) {
        p.value = 0;
      }
      const res = await personas.moduleSearch("personas", {
        value: personas.personas.search,
        p: p.value,
      });
      if (res.resultado === "error") {
        $q.notify({
          message: res.detalle_error,
          type: "negative",
          icon: "error",
        });
      } else {
        if (personas.personas.coincidencias === 0) {
          showNew.value = true;
        }
      }
    };
    const load = async (index, done) => {
      if (
        personas.personas.coincidencias !== personas.personas.resultados.length
      ) {
        p.value = p.value + 1;
        await search(false);
        done();
      } else {
        done(stop());
      }
    };
    return {
      result,
      person,
      showNew,
      search,
      personas,
      load,
    };
  },
};
</script>
