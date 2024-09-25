<script setup>
import { computed } from "vue";

const props = defineProps({
  meals: Object,
  currentDateString: String,
  items: Array,
  mealTranslations: Object,
}); //передаем данные из родителя

const emit = defineEmits(["removeProduct", "addProduct"]); //собщаем родителю о нажатиях

const removeProduct = (meal, index) => {
  emit("removeProduct", meal, index);
};

const addProduct = (meal) => {
  emit("addProduct", meal);
};
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="meal in ['Breakfast', 'Lunch', 'Dinner']" :key="meal"
      class="mt-2"
      rounded="shaped"
    >
      <v-expansion-panel-title>
        <v-icon>
            mdi-food-variant
        </v-icon>
        {{ mealTranslations[meal] }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-list v-if="!meals[currentDateString] || !meals[currentDateString][meal] || meals[currentDateString][meal].length === 0">
          <v-list-item>
            Пока ничего нет
        </v-list-item>
        </v-list>
        <v-list v-else>
          <v-list-item v-for="(product, index) in meals[currentDateString][meal]" :key="index">
            {{ product.name }} - {{ product.weight }} г
            <div v-for="item in items">
              <li v-if="item.name === product.name">
                <p class="product-name">{{ parseInt((parseInt(item.calories) / 100) * parseInt(product.weight)) }} кКал</p>
                <p class="product-name">Белков {{ parseInt((parseInt(item.proteins) / 100) * parseInt(product.weight)) }} г</p>
                <p class="product-name">Жиров {{ parseInt((parseInt(item.fats) / 100) * parseInt(product.weight)) }} г</p>
                <p class="product-name">Углеводов {{ parseInt((parseInt(item.carbs) / 100) * parseInt(product.weight)) }} г</p>
              </li>
            </div>
            <div>
              <v-btn
                icon="mdi-delete"
                @click="removeProduct(meal, index)"
              />
            </div>
          </v-list-item>
        </v-list>
        <v-btn
          text="Добавить"
          @click="addProduct(meal)"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.v-expansion-panels {
  width: 50em;
}
</style>
