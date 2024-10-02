import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null,
  }),
  actions: {
    setUser(user) {
      this.currentUser = user;
    },
    async sendUserToServer() {
      if (!this.users) {
        console.error("Нет данных пользователя для отправки");
        return;
      }

      try {
        const response = await axios.post("http://localhost:1337/api/users1", {
          data: this.users
        });
      } catch (error) {
        console.error("Ошибка при отправке данных на сервер Strapi:", error);
      }
    }
  },
  getters: {
    getUser: (state) => state.currentUser,
  },
});
