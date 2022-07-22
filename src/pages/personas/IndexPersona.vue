<template>
  <q-page
    class="row flex flex-center gutter-8"
    v-if="personas.detalle !== null"
  >
    <div class="col-xs-12 col-sm-8 col-md-8 q-pa-md">
      <q-list>
        <q-item
          :class="
            $q.screen.lt.sm
              ? 'flex column items-center q-gutter-md'
              : 'flex justify-between'
          "
        >
          <q-item-section avatar top class="gt-xs">
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
          <q-item-section>
            <PersonaMenu
              :personas="personas"
              :row="true"
              @toggle-dialog="dialog = true"
            />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label header>Más información</q-item-label>
            <q-list>
              <q-item
                class="row items-center"
                v-if="formatedDate(personas.detalle.nacimiento)"
              >
                <q-item-section avatar top>
                  <q-icon name="cake" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ formatedDate(personas.detalle.nacimiento) }}
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
            <q-list class="flex">
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
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label header v-if="personas.detalle.observaciones?.length">
              Observaciones
            </q-item-label>
            <q-item-label>{{ personas.detalle.observaciones }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label header>Detalles</q-item-label>
            <q-item-label>{{
              "Creado el " + formatedDate(personas.detalle.creacion)
            }}</q-item-label>
            <q-item-label>{{
              "Modificado el " + formatedDate(personas.detalle.modificacion)
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Archivar</div>
        </q-card-section>
        <q-card-section>
          <p>Al archivar un registro ya no va a aparecer en las búsquedas</p>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="dialog = false"
          />
          <q-btn flat label="Confirmar" color="positive" @click="archive" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useModules } from "../../stores/modules";
import { storeToRefs } from "pinia";
import { date, Loading, Notify } from "quasar";
import { onBeforeMount, ref } from "vue";
import PersonaMenu from "components/PersonaMenu.vue";
export default {
  components: {
    PersonaMenu,
  },
  setup() {
    const dialog = ref(false);
    const busqueda = useModules();
    const route = useRoute();
    const router = useRouter();
    onBeforeMount(async () => {
      Loading.show();
      const res = await busqueda.moduleFind("personas", route.params.id);
      if (res.resultado !== "ok") {
        router.push({ name: "personas" });
        busqueda.$reset();
        Loading.hide();
        Notify.create({
          message: res.resutlado.detalle_error || "Algo salió mal",
          type: "negative",
          icon: "error",
        });
      }
      Loading.hide();
    });
    const { formatDate, addToDate } = date;
    const { personas } = storeToRefs(busqueda);
    const formatedDate = (fecha) => {
      if (![undefined, null].includes(fecha)) {
        let dbDate = new Date(fecha);
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

    const archive = async () => {
      Loading.show();
      const res = await busqueda.moduleEdit(
        "personas",
        busqueda.personas.detalle._id,
        { activo: false }
      );
      if (res.resultado === "ok") {
        Notify.create({
          message: "El registro se archivó correctamente",
          type: "positive",
          icon: "done",
        });
        router.push({ name: "personas" });
        busqueda.$reset();
        Loading.hide();
      } else {
        Notify.create({
          message: res.resutlado.detalle_error || "Algo salió mal",
          type: "negative",
          icon: "error",
        });
        Loading.hide();
      }
    };

    return {
      personas,
      route,
      formatedDate,
      nullLess,
      dialog,
      archive,
    };
  },
};
</script>
