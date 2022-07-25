<template>
  <q-page>
    <InfoTemplate :title="title" :content="content" :actions="actions" />
  </q-page>
</template>

<script setup>
import { useAuth } from "stores/auth";
import InfoTemplate from "components/InfoTemplate.vue";
const auth = useAuth();
const title = {
  label: `${auth.user.nombre} ${auth.user.apellido}`,
  icon: "person",
};
const content = [
  {
    label: auth.user.dni,
    icon: "badge",
  },
  {
    label: auth.user.email,
    icon: "email",
  },
  {
    label: auth.user.telefono,
    icon: "phone",
    link: `https://wa.me/549${auth.user.telefono}`,
  },
  {
    label: "Ver Persona",
    icon: "account_box",
    link: `#/personas/${auth.user.persona_id}`,
  },
];
const actions = [
  {
    label: "Editar",
    icon: "edit",
    handler: () => {
      console.log("edit");
    },
  },
];
</script>
