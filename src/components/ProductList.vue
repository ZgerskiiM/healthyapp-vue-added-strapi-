<script setup>
import { ref, onMounted } from "vue";
import Navigation from "./Navigation.vue";
import AddFoodDialog from "./AddFoodDialog.vue";
import { useFoodStore } from "/src/stores/ProductStore.js";

const model = ref();
const foodStore = useFoodStore();
const items = ref([]);

onMounted(async () => {
  await foodStore.loadFood();
  items.value = foodStore.food;
  console.log('Items in component:', items.value);
});
</script>

<template>
  <v-card>
    <v-card-title class="pl-12">
      <h1>Справочник</h1>
    </v-card-title>
    <v-card-item>
      <v-container>
        <v-autocomplete
          v-model="model"
          :items="items.map((item) => item.name)"
          item-text="item.name"
          item-value="item.name"
          label="Какой продукт вы хотите найти?"
          auto-select-first
        />
      </v-container>
      <v-list v-if="model">
        <v-list-item>
          <p>Название</p>
          <p class="product-name">{{ model }}</p>
          <p>Каллории</p>
          <template v-for="item in items">
            <li v-if="item.name === model">
              <p class="product-name">{{ item.calories }}</p>
            </li>
          </template>
          <p>Белки</p>
          <template v-for="item in items">
            <li v-if="item.name === model">
              <p class="product-name">{{ item.proteins }}</p>
            </li>
          </template>
          <p>Жиры</p>
          <template v-for="item in items">
            <li v-if="item.name === model">
              <p class="product-name">{{ item.fats }}</p>
            </li>
          </template>
          <p>Углеводы</p>
          <template v-for="item in items">
            <li v-if="item.name === model">
              <p class="product-name">{{ item.carbs }}</p>
            </li>
          </template>
        </v-list-item>
      </v-list>
    </v-card-item>
    <v-card-actions>
      <v-container>
        <v-row justify="space-around">
          <v-col cols="12" md="6">
            <AddFoodDialog />
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
    <Navigation />
  </v-card>
</template>

<style scoped lang="scss">
* {
  color: white;
}

h1 {
  font-weight: 200;
  font-size: 40px;
}

.v-card {
  background-color: rgb(82, 193, 106);
  height: 100vh;
  border-radius: 0;
}

.v-list {
  background-color: transparent;
  list-style: none;
  padding-left: 75px;
}

p {
  font-size: 32px;
  font-weight: 600;
}

.product-name {
  font-size: 20px;
  font-weight: 200;
}

.v-btn {
  color: black;
  background-color: white;
}
</style>
