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
        console.log("get to " + url);
        const authOk = await auth.checkAuth();
        if (authOk.resultado === "ok") {
          let res = await api.get(url, {
            headers: { "Token-Acceso": auth.access.token },
          });

          if (res.status >= 200 && res.status < 400) {
            this.saveSearch(coll, res.data);

            return res.data.estado;
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
          console.log("get to " + url);
          let res = await api.get(url, {
            headers: { "Token-Acceso": auth.access.token },
          });

          if (res.status >= 200 && res.status < 400) {
            this.saveOne(coll, res.data);

            return res.data.estado;
          }
        }
      } catch (error) {
        return error.response?.data.estado;
      }
    },

    async moduleEdit(coll, id = null, body) {
      const auth = useAuth();
      let method = "put";
      let url = `${coll}/${id}`;
      body["modificacion_por"] = auth.user.persona_id;
      try {
        const authOk = await auth.checkAuth();
        if (authOk.resultado === "ok") {
          if (id === null) {
            url = `${coll}`;
            method = "post";
            body["creacion_por"] = auth.user.persona_id;
          }
          console.log(`${method} to ${url}`);
          const config = {
            url,
            method,
            data: body,
            headers: { "Token-Acceso": auth.access.token },
          };
          let res = await api(config);
          console.log(res);
          if (res.status >= 200 && res.status < 400) {
            this.saveOne(coll, res.data);

            return res.data.estado;
          }
        }
      } catch (error) {
        return error.response?.data.estado;
      }
    },
  },
});
