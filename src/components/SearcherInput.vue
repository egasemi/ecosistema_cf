<template>
  <q-input
    bottom-slots
    rounded
    outlined
    :label="label"
    v-model="busqueda[module].search"
    @keyup.enter="search()"
  >
    <template v-slot:append>
      <q-btn round dense icon="search" @click="search()" />
    </template>
    <template v-slot:hint>
      {{ desc }}
    </template>
  </q-input>
</template>
<script>
import { useModules } from "stores/modules";
import { ref } from "vue";
export default {
  emits: ["showNew"],
  props: ["label", "desc", "module"],
  setup(props, { emit }) {
    const busqueda = useModules();
    const module = ref(props.module);

    const search = async () => {
      await busqueda.moduleSearch(module.value, true);
      emit("showNew", busqueda[module.value].coincidencias === 0);
    };

    return {
      search,
      busqueda,
    };
  },
};
</script>
