import { defineStore } from "pinia";
import { api } from "../boot/axios";
import { LocalStorage } from "quasar";

export const useAuth = defineStore("auth", {
  state: () => ({
    token: null,
  }),
  actions: {
    async autenticacion(credentials) {
      try {
        let res = await api.post("auth/autenticacion", credentials, {
          withCredentials: true,
        });
        res = await res.data;
        this.token = res.sesion.acceso.token;
        LocalStorage.set("token", res.sesion.acceso.token);
        LocalStorage.set("user", res.usuaria);
        return res.estado;
      } catch (error) {
        return error.response?.data.estado;
      }
    },
    checkAuth() {
      this.token = localStorage.getItem("token");
    },
  },
});
