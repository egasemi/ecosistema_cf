<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-capitalize">
          {{ currentRoute }}
        </q-toolbar-title>

        <q-btn
          round
          :icon="dark ? 'light_mode' : 'dark_mode'"
          @click="toogleTheme"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Inicio",
    icon: "home",
    link: "inicio",
  },
  {
    title: "Personas",
    icon: "face",
    link: "personas",
  },
  {
    title: "Gestiones",
    icon: "settings",
    link: "gestiones",
  },
  {
    title: "Proyectos",
    icon: "description",
    link: "proyectos",
  },
  {
    title: "Subsidios",
    icon: "payments",
    link: "subsidios",
  },
];

export default {
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const $q = useQuasar();
    const dark = ref(false);
    const leftDrawerOpen = ref(false);

    const currentRoute = computed(() => {
      return useRoute().name;
    });

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const toogleTheme = () => {
      $q.dark.toggle();
      dark.value = !dark.value;
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      dark,
      currentRoute,
      toggleLeftDrawer,
      toogleTheme,
    };
  },
};
</script>
