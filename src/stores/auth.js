import { defineStore } from "pinia";
import { api } from "../boot/axios";
import { LocalStorage } from "quasar";
import { capitalize } from "vue";

export const useAuth = defineStore("auth", {
  state: () => ({
    access: null,
    update: null,
    user: null,
  }),
  actions: {
    saveAuth(res) {
      // save access data in state
      this.access = res.sesion.acceso;
      // save access data in local storage
      LocalStorage.set("access", this.access);

      // save update data in state
      this.update = res.sesion.actualizacion;
      // save update data in local storage
      LocalStorage.set("update", this.update);

      //save user data in state
      this.user = res.usuaria;
      //save user data in local storage
      LocalStorage.set("user", this.user);
    },

    async autenticacion(credentials) {
      try {
        // api request
        let res = await api.post("auth/autenticacion", credentials);

        if (res.status >= 200 && res.status < 400) {
          res = await res.data;

          this.saveAuth(res);

          return res.estado;
        }
      } catch (error) {
        return error.response?.data.estado;
      }
    },

    async getUpdate() {
      try {
        let res = await api.post(
          "auth/actualizacion",
          { id: this.user?.id },
          { headers: { "token-actualizacion": this.update.token } }
        );

        if (res.status >= 200 && res.status < 400) {
          res = await res.data;

          this.saveAuth(res);
          console.log("token updated");
          return res.estado;
        }
      } catch (error) {
        console.error(error.response?.data.estado);
        return error.response?.data.estado;
      }
    },

    async checkAuth() {
      this.access = LocalStorage.getItem("access");
      this.update = LocalStorage.getItem("update");
      this.user = LocalStorage.getItem("user");
      if (this.access === null)
        return { resultado: "error", detalle_error: "Sin acceso" };

      if (this.access?.token && this.access?.exp * 1000 < Date.now()) {
        console.log("token expired");
        const updated = await this.getUpdate();
        return updated;
      } else {
        console.log("authOk");
        return { resultado: "ok" };
      }
    },

    async logOut() {
      try {
        let res = await api.post(
          "auth/cerrar-sesion",
          { id: this.user.id },
          { headers: { "token-actualizacion": this.update.token } }
        );

        if (res.status >= 200 && res.status < 400) {
          this.access = null;
          this.user = null;
          this.update = null;
          LocalStorage.clear();
          return res.data.estado;
        }
      } catch (error) {
        return error.response?.data.estado;
      }
    },
  },
  getters: {
    username: (state) =>
      `${capitalize(state.user?.nombre)} ${capitalize(state.user?.apellido)}`,
  },
});
