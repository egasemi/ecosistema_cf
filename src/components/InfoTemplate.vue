<template>
  <q-list class="col-xs-12 col-sm-8 col-md-8 q-pa-md">
    <q-item
      :class="
        $q.screen.lt.sm
          ? 'flex column items-center q-gutter-md'
          : 'flex justify-between'
      "
    >
      <q-item-section avatar class="gt-xs">
        <q-icon :name="title.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label lines="2">
          {{ title.label }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <q-item-label header>Más información</q-item-label>
        <q-list>
          <q-item
            v-for="(item, index) in content"
            :key="index"
            :clickable="item.link !== undefined"
            :href="item.link"
            :target="link(item) ? '_blank' : ''"
            class="row items-center"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup>
const props = defineProps(["title", "content", "actions"]);
const link = (item) => {
  return item.link !== undefined && item.link.includes('https')
};
</script>
