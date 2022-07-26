<template>
  <q-item
    clickable
    :disable="!active"
    tag="a"
    @click="navegateTo"
    active-class="text-secondary bg-accent"
    :active="currentRoute === title"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { format } from "quasar";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const { capitalize } = format;
    const router = useRouter();
    const currentRoute = computed(() => {
      return capitalize(useRoute().name);
    });
    return {
      currentRoute,
      navegateTo() {
        router.push({ name: props.link });
      },
    };
  },
});
</script>
