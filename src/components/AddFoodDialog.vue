<script setup>
import { ref } from 'vue';
import { useFoodStore } from "/src/stores/ProductStore.js";

const foodStore = useFoodStore();
const foodname = ref("");
const foodcalories = ref("");
const foodcarbs = ref("");
const foodproteins = ref("");
const foodfats = ref("");

const addFood = () => {
  if (foodname.value.length > 0) {
    const newFood = {
      name: foodname.value,
      calories: foodcalories.value + " кКал",
      fats: foodfats.value + " г",
      proteins: foodproteins.value + " г",
      carbs: foodcarbs.value + " г",
    };
    foodStore.addFood(newFood);
    foodname.value = "";
    foodcalories.value = "";
    foodfats.value = "";
    foodproteins.value = "";
    foodcarbs.value = "";
  }
};
</script>

<template>
  <v-dialog transition="dialog-bottom-transition" width="auto">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" text="Добавить свой продукт" block />
    </template>
    <template v-slot:default="{ isActive }">
      <v-card id="add-card">
        <v-card-title class="pl-12">
          <h2>Введите название</h2>
        </v-card-title>
        <v-card-actions class="d-flex flex-column">
          <v-text-field v-model="foodname" label="Введите название" />
          <v-text-field v-model="foodcalories" label="Количество каллорий на 100г" type="Number" />
          <v-text-field v-model="foodproteins" label="Количество белка" type="Number" />
          <v-text-field v-model="foodfats" label="Количество жиров" type="Number" />
          <v-text-field v-model="foodcarbs" label="Количество углеводов" type="Number" />
        </v-card-actions>
        <v-card-actions>
          <v-btn text="Закрыть" @click="isActive.value = false" />
          <v-btn text="Добавить" @click="addFood" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped lang="scss">
#add-card {
  background-color: rgb(248, 248, 248);
  height: 40em;
  display: flex;
  flex-direction: column;
  width: 40em;
  justify-content: center;
  color: black;
  .v-text-field {
    color: black;
    width: 30em;
    font-size: 1em;
  }
  .v-btn {
    width: 10em;
    background-color: white;
    color:black;
  }
}

.v-btn {
  background-color: white;
  color:black;
}

h2 {
  color: black;
}
</style>
