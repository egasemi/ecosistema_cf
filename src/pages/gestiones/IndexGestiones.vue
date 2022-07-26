<template>
  <q-page class="row flex flex-center gutter-8">
    <div class="col-xs-12 col-sm-8 col-md-8 q-pa-md">
      <SearcherInput
        v-if="false"
        @show-new="() => console.log('nuevo')"
        module="gestiones"
        label="Búsqueda gestiones"
        desc="Ingresá un número de gestión o descripción"
      />
    </div>
  </q-page>
</template>

<script setup>
import SearcherInput from "components/SearcherInput.vue";
</script>
