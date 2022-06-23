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
      pagina_actual: null,
    },
  }),

  actions: {
    saveModule(coll, res) {
      const { coincidencias, pagina_actual, resultados, search } =
        res.respuesta;
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
          this.personas.pagina_actual
        }`;
        console.log("making fetch to " + url);
        const authOk = await auth.checkAuth();
        if (authOk.resultado === "ok") {
          let res = await api.get(url, {
            headers: { "Token-Acceso": auth.access.token },
          });

          if (res.status >= 200 && res.status < 400) {
            res = await res.data;

            this.saveModule(coll, res, query.p);

            return res.estado;
          }
        }
      } catch (error) {
        return error.response?.data.estado;
      }
    },
  },
});
