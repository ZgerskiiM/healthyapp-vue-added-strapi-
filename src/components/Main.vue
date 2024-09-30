<script setup>
import { ref, reactive, onMounted, computed, watch, onBeforeUnmount } from "vue";
import Navigation from "/src/components/Navigation.vue";
import UserData from "/src/components/UserData.vue";
import MealExpansionPanels from "./ExpansionPanels.vue";
import AddProductDialog from './AddProductDialog.vue';
import { useFoodStore } from "/src/stores/ProductStore.js";
import { useUserStore } from "/src/stores/UserStore.js";
import { useCaloriesStore } from "/src/stores/DailyNutritionStore.js";
import axios from 'axios';

const showDatePicker = ref(false);
const meals = reactive({});
const selectedDate = ref(new Date(new Date().setHours(0, 0, 0, 0)));
const showAddProductDialog = ref(false);
const currentMeal = ref("");
const selectedMeal = ref("");
const foodStore = useFoodStore();
const items = ref([]);
const userStore = useUserStore();
const dailyNutrition = useCaloriesStore();
const currentDateString = computed(() => {
  return selectedDate.value.toISOString().split('T')[0];
});

onMounted(async () => {
  checkFirstVisit();
  await foodStore.loadFood();
  items.value = foodStore.food;

  await loadMealsFromServer();
  initializeMealsForDate(selectedDate.value);
  loadDataFromLocalStorage();
});

onBeforeUnmount(() => {
  saveDataToLocalStorage();
});

const isFirstVisit = ref(false);
const checkFirstVisit = () => {
  if (!localStorage.getItem("hasVisited")) {
    isFirstVisit.value = true;
    localStorage.setItem("hasVisited", "true");
  }
};

const closeFirstVisitComponent = () => {
  isFirstVisit.value = false;
};

const mealTranslations = {
  Breakfast: "Завтрак",
  Lunch: "Обед",
  Dinner: "Ужин",
};

const initializeMealsForDate = (date) => {
  const dateString = date.toISOString().split("T")[0];
  if (!meals[dateString]) {
    meals[dateString] = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
    };
    saveMealsToServer();
  }
};

const dailyCalorieGoal = computed(() => {
  const user = userStore.getUser;
  return user ? user.ucalories : 2500;
});

const newProduct = reactive({
  name: "",
  weight: 0,
  calories: 0,
});

const addProduct = (meal) => {
  selectedMeal.value = mealTranslations[meal];
  currentMeal.value = meal;
  showAddProductDialog.value = true;
  initializeMealsForDate(selectedDate.value);
};

const confirmAddProduct = () => {
  if (newProduct.name && newProduct.weight > 0) {
    const dateString = selectedDate.value.toISOString().split("T")[0];
    initializeMealsForDate(selectedDate.value);
    meals[dateString][currentMeal.value].push({ ...newProduct });
    saveMealsToServer();
    showAddProductDialog.value = false;
    newProduct.name = "";
    newProduct.weight = 0;
    newProduct.calories = 0;
  }
};

const totalCalories = computed(() => {
  return dailyNutrition.getDailyCalories(meals, selectedDate.value, items.value);
});

const totalNutrients = computed(() => {
  if (!meals[currentDateString.value]) return { proteins: 0, carbs: 0, fats: 0 };
  return ["Breakfast", "Lunch", "Dinner"].reduce((total, meal) => {
    return (meals[currentDateString.value][meal] || []).reduce((mealTotal, product) => {
      const item = items.value.find((i) => i.name === product.name);
      if (item) {
        const weight = parseInt(product.weight);
        return {
          proteins: mealTotal.proteins + parseInt((parseInt(item.proteins) / 100) * weight),
          carbs: mealTotal.carbs + parseInt((parseInt(item.carbs) / 100) * weight),
          fats: mealTotal.fats + parseInt((parseInt(item.fats) / 100) * weight),
        };
      }
      return mealTotal;
    }, total);
  }, { proteins: 0, carbs: 0, fats: 0 });
});

const totalProteins = computed(() => totalNutrients.value.proteins);
const totalCarbs = computed(() => totalNutrients.value.carbs);
const totalFats = computed(() => totalNutrients.value.fats);

const removeProduct = (meal, index) => {
  const dateString = selectedDate.value.toISOString().split("T")[0];
  if (meals[dateString] && meals[dateString][meal]) {
    meals[dateString][meal].splice(index, 1);
    saveMealsToServer();
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ru-RU", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
};

const loadMealsFromServer = async () => {
  try {
    const response = await axios.get(`http://localhost:1337/api/meals?filters[date][$eq]=${currentDateString.value}`);
    if (response.data && response.data.data.length > 0) {
      const mealsData = response.data.data[0].attributes.meal;
      meals[currentDateString.value] = { ...mealsData };
      console.log("Данные загружены:", meals[currentDateString.value]);
    } else {
      initializeMealsForDate(selectedDate.value);
      console.log("Данных нет, инициализирована пустая структура");
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных с сервера:", error);
  }
};


const saveMealsToServer = async () => {
  try {
    const dataToSave = {
      data: {
        date: currentDateString.value,
        meal: (meals[currentDateString.value]),
      },
    };

    console.log('Data to save:', (dataToSave));
    const response = await axios.get(
      `http://localhost:1337/api/meals?filters[date][$eq]=${currentDateString.value}`
    );

    if (response.data && response.data.data.length > 0) {
      const mealId = response.data.data[0].id;
      await axios.put(`http://localhost:1337/api/meals/${mealId}`, dataToSave, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Updated meal:', (meals[currentDateString.value]));
    } else {
      await axios.post('http://localhost:1337/api/meals', dataToSave, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Created new meal:', (meals[currentDateString.value]));
    }
  } catch (error) {
    console.error('Error saving meals to server:', error);
  }
};

function saveDataToLocalStorage() {
  localStorage.setItem('selectedDate', selectedDate.value.toISOString());
}

function loadDataFromLocalStorage() {
  const savedSelectedDate = localStorage.getItem('selectedDate');
  if (savedSelectedDate) {
    selectedDate.value = new Date(savedSelectedDate);
  }
}

watch(selectedDate, async (newDate) => {
  await loadMealsFromServer();
  initializeMealsForDate(newDate);
  saveDataToLocalStorage();
});
</script>

<template>
  <UserData
    v-if="isFirstVisit"
    @close="closeFirstVisitComponent"
  />
  <div
    v-else
    class="main-window"
  >
    <v-container class="progress-card">
      <v-card-title>
        <h1>Счет калорий</h1>
      </v-card-title>
      <v-card-item>
        <v-progress-circular
          :size="200"
          :width="15"
          :model-value="(totalCalories / dailyCalorieGoal) * 100"
          color="white"
        >
        Осталось {{ Math.max(0, dailyCalorieGoal - totalCalories) }} кКал
        </v-progress-circular>
      </v-card-item>
      <v-container class="d-flex flex-column">
        Каллорий {{ totalCalories }} кКал
        Белков {{ totalProteins }} г
        Жиров {{ totalFats }} г
        Углеводов {{ totalCarbs }} г
      </v-container>
    </v-container>
    <v-container>
      <v-btn @click="showDatePicker = true">
        {{ formatDate(selectedDate) }}
      </v-btn>
    </v-container>

    <v-dialog v-model="showDatePicker" max-width="290px">
      <v-date-picker
        v-model="selectedDate"
        @change="showDatePicker = false"
        show-adjacent-months
        hide-header
      />
    </v-dialog>
    <v-card-item class="d-flex justify-center">
        <MealExpansionPanels
          :meals="meals"
          :current-date-string="currentDateString"
          :items="items"
          :meal-translations="mealTranslations"
          @remove-product="removeProduct"
          @add-product="addProduct"
        />
    </v-card-item>
    <Navigation />
    <AddProductDialog
      v-model:show="showAddProductDialog"
      :selected-meal="selectedMeal"
      :items="items"
      :new-product="newProduct"
      @confirm="confirmAddProduct"
    />
  </div>
</template>

<style scoped lang="scss">
.v-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-card {
  width: 1000em;
  font-weight: 400;
  color: rgb(255, 255, 255);
}

.v-list-item {
  margin: 10px;
  display: flex;
  justify-content: flex-start;
}

.v-list-group {
  border: 1px solid rgb(118, 118, 118);
  margin: 10px;
  display: flex;
  flex-direction: row;
  border-radius: 10em;
  .v-list-item {
    border: none;
    justify-content: flex-start;
  }
}

h1 {
  font-weight: 200;
  font-size: 40px;
}

#id {
  background: none;
}

.v-expansion-panels {
  width: 50em;
}

.v-date-picker {
  max-height: 300px;
}

.main-window {
  height: 100%;
}
</style>
