import { defineStore } from "pinia";
import axios, { api } from "../boot/axios";
import { LocalStorage } from "quasar";
import { useAuth } from "./auth";

export const useModules = defineStore("modules", {
  state: () => ({
    personas: {
      search: "",
      coincidencias: 0,
      resultados: [],
      pagina_actual: 0,
      detalle: null,
    },
  }),

  actions: {
    saveOne(coll, res) {
      const { resultados } = res.respuesta;
      this[coll].detalle = resultados;
      LocalStorage.set(coll, this[coll]);
    },

    saveSearch(coll, res) {
      const { coincidencias, pagina_actual, resultados, search } =
        res.respuesta;
      console.log(search);
      this[coll].coincidencias = coincidencias;
      this[coll].pagina_actual = pagina_actual;
      let newResultados;
      if (pagina_actual !== 0) {
        console.log("load more");
        newResultados = [...this[coll].resultados, ...resultados];
      } else {
        console.log("first search");
        newResultados = resultados;
        this[coll].search = search;
      }
      this[coll].resultados = newResultados;
      LocalStorage.set(coll, this[coll]);
    },

    async moduleSearch(coll, query) {
      const auth = useAuth();
      try {
        const url = `${coll}/buscar?value=${encodeURI(query.value)}&p=${
          this[coll].pagina_actual
        }`;
        console.log("making fetch to " + url);
        const authOk = await auth.checkAuth();
        if (authOk.resultado === "ok") {
          let res = await api.get(url, {
            headers: { "Token-Acceso": auth.access.token },
          });

          if (res.status >= 200 && res.status < 400) {
            res = await res.data;

            this.saveSearch(coll, res);

            return res.estado;
          }
        }
      } catch (error) {
        return error.response?.data.estado;
      }
    },

    async moduleFind(coll, id) {
      const auth = useAuth();
      try {
        const url = `${coll}/${id}`;
        const authOk = await auth.checkAuth();
        if (authOk.resultado === "ok") {
          console.log("making fetch to " + url);
          let res = await api.get(url, {
            headers: { "Token-Acceso": auth.access.token },
          });

          if (res.status >= 200 && res.status < 400) {
            res = await res.data;

            this.saveOne(coll, res);

            return res.estado;
          }
        }
      } catch (error) {
        return error.response?.data.estado;
      }
    },
  },
});
