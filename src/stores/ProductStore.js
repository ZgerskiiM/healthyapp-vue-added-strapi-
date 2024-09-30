import { defineStore } from "pinia";
import axios from "axios";

export const useFoodStore = defineStore("food", {
  state: () => ({
    food: [],
  }),

  actions: {
    async loadFood() {
      try {
        const response = await axios.get("http://localhost:1337/api/foods");
        // Предполагаем, что нам нужен первый элемент массива data
        const foodData = response.data.data[0].attributes.food;
        this.food = foodData;
        console.log('Loaded food:', this.food);
      } catch (error) {
        console.error("Ошибка при загрузке данных с сервера:", error);
      }
    },

    async addFood(newFood) {
      try {
        const response = await axios.get("http://localhost:1337/api/foods");
        const currentData = response.data.data[0];
        const updatedFood = [...currentData.attributes.food, newFood];
        const updateResponse = await axios.put(`http://localhost:1337/api/foods/${currentData.id}`, {
          data: {
            food: updatedFood
          }
        });
        this.food = updatedFood;
        return updateResponse.data;
      } catch (error) {
        console.error("Ошибка при добавлении продукта:", error);
        throw error;
      }
    },

    async updateFood(id, updatedFood) {
      try {
        const response = await axios.put("http://localhost:1337/api/foods", updatedFood);
        const index = this.food.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.food[index] = response.data;
        }
      } catch (error) {
        console.error("Ошибка при обновлении данных на сервере:", error);
      }
    },
  },
});
