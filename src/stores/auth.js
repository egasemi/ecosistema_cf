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
      LocalStorage.set("access", res.sesion.acceso);

      // save update data in state
      this.update = res.sesion.actualizacion;
      // save update data in local storage
      LocalStorage.set("update", res.sesion.actualizacion);

      //save user data in state
      this.user = res.usuaria;
      //save user data in local storage
      LocalStorage.set("user", res.usuaria);
    },

    async autenticacion(credentials) {
      try {
        // api request
        let res = await api.post("auth/autenticacion", credentials);
        console.log(res);
        if (res.status >= 200 && res.status < 400) {
          res = await res.data;

          this.saveAuth(res);

          return res.estado;
        }
      } catch (error) {
        return error.data.estado;
      }
    },

    async checkAuth() {
      this.access = LocalStorage.getItem("access");
      this.update = LocalStorage.getItem("update");
      this.user = LocalStorage.getItem("user");
      if (this.access === null) {
        console.log("access null");
        return false;
      }

      if (this.access?.token && this.access?.exp * 1000 < Date.now()) {
        console.log("access expired");
        try {
          let res = await api.post(
            "auth/actualizacion",
            { id: this.user?.id },
            { headers: { "token-actualizacion": this.update.token } }
          );
          console.log(res);
          if (res.status >= 200 && res.status < 400) {
            res = await res.data;

            this.saveAuth(res);

            return true;
          }
        } catch (error) {
          console.log("catch error");
          return false;
        }
      } else {
        console.log("authOk");
        return true;
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
        }
      } catch (error) {
        return error.data.estado;
      }
    },
  },
  getters: {
    username: (state) =>
      `${capitalize(state.user?.nombre)} ${capitalize(state.user?.apellido)}`,
  },
});
