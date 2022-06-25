<template>
  <q-page class="row flex flex-center gutter-8" v-if="show">
    <div class="col-xs-12 col-sm-8 col-md-8 q-pa-md">
      <q-list>
        <q-item>
          <q-item-section avatar top>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="2">
              {{ personas.detalle.nombre }} {{ personas.detalle.apellido }}
            </q-item-label>
            <q-item-label caption lines="1">
              <q-icon name="badge" v-if="personas.detalle.dni !== null" />
              {{ personas.detalle.dni }}
            </q-item-label>
          </q-item-section>
          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn
                :disable="personas.detalle.contacto.telefonos[0] === undefined"
                :color="
                  personas.detalle.contacto.telefonos[0] === undefined
                    ? 'grey'
                    : 'positive'
                "
                size="12px"
                flat
                dense
                round
                icon="phone"
                :href="`https://wa.me/549${personas.detalle.contacto.telefonos[0]}`"
                target="_blank"
              />
              <q-btn
                :disable="personas.detalle.contacto.emails[0] === undefined"
                :color="
                  personas.detalle.contacto.emails[0] === undefined
                    ? 'grey'
                    : 'positive'
                "
                size="12px"
                flat
                dense
                round
                icon="email"
                :href="'to:' + personas.detalle.contacto.emails[0]"
              />
              <q-btn
                round
                flat
                dense
                icon="edit"
                color="positive"
                size="12px"
              />
            </div>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label header>Más información</q-item-label>
            <q-list>
              <q-item class="row items-center" v-if="formatedDate()">
                <q-item-section avatar top>
                  <q-icon name="cake" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ formatedDate() }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                class="row items-center"
                v-if="personas.detalle.domicilios.length > 0"
              >
                <q-item-section avatar top>
                  <q-icon name="home" />
                </q-item-section>
                <q-item-label>
                  {{ personas.detalle.domicilios[0].direccion }}
                </q-item-label>
              </q-item>
              <q-item
                class="row items-center"
                v-if="personas.detalle.contacto.telefonos.length > 0"
              >
                <q-item-section avatar top>
                  <q-icon name="phone" />
                </q-item-section>
                <q-item-label>
                  {{ personas.detalle.contacto.telefonos[0] }}
                </q-item-label>
              </q-item>
              <q-item
                class="row items-center"
                v-if="personas.detalle.contacto.emails.length > 0"
              >
                <q-item-section avatar top>
                  <q-icon name="mail" />
                </q-item-section>
                <q-item-label>
                  {{ personas.detalle.contacto.emails[0] }}
                </q-item-label>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label header>Vinculos</q-item-label>
            <q-list>
              <q-item
                v-for="(value, key) in nullLess(personas.detalle.etiquetas)"
                :key="key"
              >
                <q-item-section v-if="value != null">
                  <q-chip :label="key" class="text-capitalize" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { useModules } from "../../stores/modules";
import { storeToRefs } from "pinia";
import { date, Loading } from "quasar";
import { onBeforeMount, ref } from "vue";
export default {
  setup() {
    const show = ref(false);
    const busqueda = useModules();
    const route = useRoute();
    onBeforeMount(async () => {
      Loading.show();
      const res = await busqueda.moduleFind("personas", route.params.id);
      if (res.resultado === "ok") {
        show.value = true;
      } else {
        console.log("fucking error");
      }
      Loading.hide();
    });
    const { formatDate, addToDate } = date;
    const { personas } = storeToRefs(busqueda);
    const formatedDate = () => {
      if (![undefined, null].includes(personas.value.detalle.nacimiento)) {
        let dbDate = new Date(personas.value.detalle.nacimiento);
        dbDate = addToDate(dbDate, { hours: 3 });
        return formatDate(dbDate, "DD/MM/YYYY");
      } else {
        return false;
      }
    };
    const nullLess = (obj) => {
      return Object.entries(obj)
        .filter(([_, v]) => v != null)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    };

    return {
      personas,
      route,
      formatedDate,
      nullLess,
      show,
    };
  },
};
</script>
