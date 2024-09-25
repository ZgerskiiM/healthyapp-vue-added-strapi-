import { defineStore } from "pinia";
import axios from "axios";

export const useFoodStore = defineStore("food", {
  state: () => ({
    food: [], // Инициализация пустого массива для данных
  }),

  actions: {
    // Загрузить данные с сервера Strapi
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

    // Сохранить новые данные на сервере Strapi
    async addFood(newFood) {
      try {
        // Сначала получаем текущие данные
        const response = await axios.get("http://localhost:1337/api/foods");
        const currentData = response.data.data[0];

        // Добавляем новый продукт к существующему массиву
        const updatedFood = [...currentData.attributes.food, newFood];

        // Обновляем данные на сервере
        const updateResponse = await axios.put(`http://localhost:1337/api/foods/${currentData.id}`, {
          data: {
            food: updatedFood
          }
        });

        // Обновляем локальное состояние
        this.food = updatedFood;

        console.log('Food added successfully:', newFood);
        return updateResponse.data;
      } catch (error) {
        console.error("Ошибка при добавлении продукта:", error);
        throw error;
      }
    },

    // Метод для обновления данных на сервере, если это требуется
    async updateFood(id, updatedFood) {
      try {
        const response = await axios.put("http://localhost:1337/api/foods", updatedFood); // Замените на корректный URL API
        const index = this.food.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.food[index] = response.data; // Обновляем элемент в локальном массиве
        }
      } catch (error) {
        console.error("Ошибка при обновлении данных на сервере:", error);
      }
    },
  },
});
