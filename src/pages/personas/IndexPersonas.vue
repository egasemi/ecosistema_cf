<template>
  <q-page
    :class="`row ${result ? 'justify-center' : 'flex flex-center'} gutter-8`"
    padding
  >
    <div class="col-8 col-sm-10">
      <q-input
        bottom-slots
        rounded
        outlined
        label="Búsqueda personas"
        v-model="person"
      >
        <template v-slot:append>
          <q-btn round dense icon="search" flat @click="search" />
        </template>
        <template v-slot:hint>
          Ingresá un Nombre, Apellido, DNI o Teléfono para buscar una persona
        </template>
      </q-input>
    </div>
    <div class="col-8 col-sm-10" v-if="result">
      <q-list>
        <q-item>
          <q-item-section side top>
            <q-item-label>Emiliano Arregui</q-item-label>
            <q-item-label caption>37145336</q-item-label>
            <div class="flex justify-content-center">
              <q-btn round flat color="green" icon="call" />
              <q-btn round flat color="green" icon="mail" />
              <q-btn round flat color="green" icon="send" />
            </div>
          </q-item-section>
        </q-item>
        <q-separator spaced inset />
        <q-item>
          <q-item-section side top>
            <q-item-label>Emiliano Arregui</q-item-label>
            <q-item-label caption>37145336</q-item-label>
            <div class="flex justify-content-center">
              <q-btn round flat color="green" icon="call" />
              <q-btn round flat color="green" icon="mail" />
              <q-btn round flat color="green" icon="send" />
            </div>
          </q-item-section>
        </q-item>
        <q-separator spaced inset />
      </q-list>
    </div>
    <div class="flex align-content-start" v-if="newPerson">
      <p class="text-color-indigo">No se encontraron resultados</p>
      <q-btn icon="add" color="positive" fab>Agregar Persona</q-btn>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue-demi";

export default {
  setup() {
    const person = ref("");
    const result = ref(false);
    const newPerson = ref(true);
    const search = () => {
      if (person.value.length > 0) {
        result.value = !result.value;
        newPerson.value = false;
      } else {
        newPerson.value = !newPerson;
        result.value = false;
      }
    };
    return {
      result,
      person,
      newPerson,
      search,
    };
  },
};
</script>
