import { defineStore } from "pinia";
import { api } from "../boot/axios";
import { LocalStorage } from "quasar";
import { useAuth } from "./auth";

export const useModules = defineStore("modules", {
  state: () => ({
    personas: {
      search: "",
      coincidencias: 0,
      resultados: [],
    },
  }),

  actions: {
    saveModule(coll, res, page) {
      this[coll].coincidencias = res.respuesta.coincidencias;
      let newResultados;
      if (page !== 0) {
        console.log("load more");
        newResultados = [...this[coll].resultados, ...res.respuesta.resultados];
      } else {
        console.log("first search");
        newResultados = res.respuesta.resultados;
        this[coll].search = res.respuesta.search;
      }
      this[coll].resultados = newResultados;
      LocalStorage.set(coll, this[coll]);
    },

    async moduleSearch(coll, query) {
      const auth = useAuth();
      try {
        const url = `${coll}/buscar?value=${encodeURI(query.value)}&p=${
          query.p
        }`;
        console.log("making fetch to " + url);
        const authOk = await auth.checkAuth();
        if (authOk.resultado === "ok") {
          let res = await api.get(url, {
            headers: { "Token-Acceso": auth.access.token },
          });
          console.log(res);

          if (res.status >= 200 && res.status < 400) {
            res = await res.data;
            console.log(res);

            this.saveModule(coll, res, query.p);

            return res.estado;
          }
        }
        console.log(res);
      } catch (error) {
        return error.response?.data.estado;
      }
    },
  },
});
