<template>
  <q-page class="row flex flex-center gutter-8">
    <div class="col-xs-12 col-sm-8 col-md-8 q-pa-md">
      <SearcherInput
        @show-new="(value) => (showNew = value)"
        module="personas"
        label="Búsqueda personas"
        desc="Ingresá un Nombre, Apellido, DNI o Teléfono para buscar una persona"
      />
    </div>
    <div class="col-xs-12 col-sm-8 col-md-8">
      <q-list v-if="busqueda.personas.resultados.length !== 0">
        <q-item-label header
          >Resultados ({{ busqueda.personas.coincidencias }})</q-item-label
        >
        <q-infinite-scroll
          @load="load"
          :disable="
            busqueda.personas.coincidencias ===
            busqueda.personas.resultados.length
          "
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
import { useRouter } from "vue-router";
import SearcherInput from "components/SearcherInput.vue";

export default {
  components: { SearcherInput },
  setup() {
    const showNew = ref(false);
    const busqueda = useModules();
    const router = useRouter();

    const load = async (index, done) => {
      await busqueda.moduleSearch("personas", false);
      done(stop());
    };
    const create = () => {
      router.push({ name: "nueva persona" });
      busqueda.$reset();
    };
    return {
      showNew,
      busqueda,
      load,
      create,
    };
  },
};
</script>
