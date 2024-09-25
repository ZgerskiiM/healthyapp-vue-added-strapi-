import { defineStore } from 'pinia';

export const useCaloriesStore = defineStore('calories', {
  state: () => ({
    dailyCalories: {}
  }),
  actions: {
    updateDailyCalories(date, calories) {
      this.dailyCalories[date] = calories;
    },
    initializeCalories() {
      if (Object.keys(this.dailyCalories).length === 0) {
        const today = new Date().toISOString().split('T')[0];
        this.dailyCalories[today] = 0;
      }
    }
  },
  getters: {
    getDailyCalories: (state) => {
      return (meals, selectedDate, items) => {
        const dateString = typeof selectedDate === 'string'
          ? selectedDate
          : selectedDate.toISOString().split("T")[0];
        if (!meals[dateString]) return 0;
        return ['Breakfast', 'Lunch', 'Dinner'].reduce((total, meal) => {
          return total + (meals[dateString][meal] || []).reduce((mealTotal, product) => {
            const item = items.find(i => i.name === product.name);
            if (item) {
              return mealTotal + parseInt((parseInt(item.calories) / 100) * parseInt(product.weight));
            }
            return mealTotal;
          }, 0);
        }, 0);
      };
    },
    getAllDailyCalories: (state) => {
      return state.dailyCalories;
    }
  }
});
