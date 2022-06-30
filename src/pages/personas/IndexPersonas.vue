<template>
  <q-page class="row flex flex-center gutter-8">
    <div class="col-xs-12 col-sm-8 col-md-8 q-pa-md">
      <q-input
        bottom-slots
        rounded
        outlined
        label="Búsqueda personas"
        v-model="busqueda.personas.search"
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
    <div class="col-xs-12 col-sm-8 col-md-8">
      <q-list v-if="busqueda.personas.resultados.length !== 0">
        <q-item-label header
          >Resultados ({{ busqueda.personas.coincidencias }})</q-item-label
        >
        <q-infinite-scroll
          @load="load"
          :disable="busqueda.personas.resultados.length < 15"
        >
          <div
            v-for="(per, index) in busqueda?.personas.resultados"
            :key="per._id"
          >
            <q-separator v-if="index !== 0" />
            <q-item
              clickable
              v-ripple
              class="q-pa-md"
              :to="{ name: 'persona', params: { id: per._id } }"
            >
              <q-item-section avatar top>
                <q-icon name="account_circle" size="34px"> </q-icon>
              </q-item-section>

              <q-item-section top>
                <q-item-label lines="2">
                  <span class="text-weight-medium text-capitalize"
                    >{{ per.nombre }} {{ per.apellido }}</span
                  >
                </q-item-label>
                <q-item-label caption lines="1" v-if="per.dni !== null">
                  <q-icon name="badge" />
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
      <div class="column items-center" v-if="showNew">
        <p class="text-color-indigo">No se encontraron resultados</p>
        <q-btn icon="add" color="positive" fab @click="create"
          >Agregar Persona</q-btn
        >
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue-demi";
import { useModules } from "stores/modules";
import { Loading, Notify } from "quasar";
import { useRouter } from "vue-router";

export default {
  setup() {
    const showNew = ref(false);
    const busqueda = useModules();
    const router = useRouter();

    const search = async (first) => {
      if (first) {
        Loading.show();
        busqueda.personas.pagina_actual = 0;
      } else {
        busqueda.personas.pagina_actual++;
      }
      const res = await busqueda.moduleSearch("personas", {
        value: busqueda.personas.search,
      });

      if (res === undefined || res?.resultado !== "ok") {
        Notify.create({
          message: res ? res?.detalle_error : "Error desconocido",
          type: "negative",
          icon: "error",
        });
      } else {
        if (busqueda.personas.coincidencias === 0) {
          showNew.value = true;
        } else {
          showNew.value = false;
        }
      }
      Loading.hide();
    };

    const load = async (index, done) => {
      if (
        busqueda.personas.coincidencias !== busqueda.personas.resultados.length
      ) {
        await search(false);
        done();
      } else {
        done(stop());
      }
    };

    const create = () => {
      router.push({ name: "nueva persona" });
      busqueda.$reset();
    };

    return {
      showNew,
      search,
      busqueda,
      load,
      create,
    };
  },
};
</script>
