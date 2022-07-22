<script>
export default {
  props: ["personas", "row"],
  setup(props) {
    return { props };
  },
};
</script>

<template>
  <div class="flex justify-end q-gutter-xs">
    <q-btn
      flat
      :disable="personas.detalle.contacto.telefonos[0] === undefined"
      :color="
        personas.detalle.contacto.telefonos[0] === undefined
          ? 'grey'
          : 'positive'
      "
      size="12px"
      round
      icon="phone"
      :href="`https://wa.me/549${personas.detalle.contacto.telefonos[0]}`"
      target="_blank"
    />
    <q-btn
      flat
      :disable="personas.detalle.contacto.emails[0] === undefined"
      :color="
        personas.detalle.contacto.emails[0] === undefined ? 'grey' : 'positive'
      "
      size="12px"
      round
      icon="email"
      :href="'to:' + personas.detalle.contacto.emails[0]"
    />
    <q-btn
      flat
      round
      icon="edit"
      color="positive"
      size="12px"
      :to="{
        name: 'editar persona',
        params: { id: personas.detalle._id },
      }"
    />
    <q-btn
      flat
      round
      icon="archive"
      color="warning"
      size="12px"
      @click="$emit('toggleDialog')"
    />
  </div>
</template>
