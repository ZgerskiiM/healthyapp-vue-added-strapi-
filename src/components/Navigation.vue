<script setup>
import { useRouter } from 'vue-router'

const router = useRouter();
</script>

<template>
  <v-layout
    class="overflow-visible"
    style="height: 56px;"
  >
    <v-bottom-navigation
      color="primary"
      active
    >
      <v-btn :to="({ name: 'Graph' })">
        <v-icon>
          mdi-thermostat-box
        </v-icon>
        Статистика
      </v-btn>
      <v-btn :to="({ name: 'Main' })">
        <v-icon>
          mdi-home-heart
        </v-icon>
        Главная
      </v-btn>
      <v-btn :to="({ name: 'List' })">
        <v-icon>
          mdi-book-heart
        </v-icon>
        Справочник
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
