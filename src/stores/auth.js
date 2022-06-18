import { defineStore } from "pinia";
import { api } from "../boot/axios";
import { LocalStorage } from "quasar";
import { capitalize } from "vue";

export const useAuth = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
  }),
  actions: {
    async autenticacion(credentials) {
      try {
        // peticion a la api
        let res = await api.post("auth/autenticacion", credentials, {
          withCredentials: true,
        });
        res = await res.data;

        // token al state
        this.token = res.sesion.acceso.token;
        // token al local storage
        LocalStorage.set("token", res.sesion.acceso.token);

        //user al state
        this.user = res.usuaria;
        //user al local storage
        LocalStorage.set("user", res.usuaria);

        return res.estado;
      } catch (error) {
        return error.response?.data.estado;
      }
    },
    checkAuth() {
      this.token = LocalStorage.getItem("token");
      this.user = LocalStorage.getItem("user");
    },
    logOut() {
      this.token = null;
      this.user = null;
      LocalStorage.clear();
    },
  },
  getters: {
    username: (state) =>
      `${capitalize(state.user?.nombre)} ${capitalize(state.user?.apellido)}`,
  },
});
