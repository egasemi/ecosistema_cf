const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "inicio",
        component: () => import("pages/IndexPage.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "personas",
        name: "personas",
        component: () => import("src/pages/personas/IndexPersonas.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "personas/:id",
        name: "persona",
        component: () => import("src/pages/personas/IndexPersona.vue"),
      },
      {
        path: "personas/:id/edit",
        name: "editar persona",
        component: () => import("src/pages/personas/FormPersona.vue"),
      },
      {
        path: "personas/crear",
        name: "nueva persona",
        component: () => import("src/pages/personas/FormPersona.vue"),
      },
      {
        path: "subsidios",
        name: "subsidios",
        component: () => import("src/pages/subsidios/IndexSubsidios.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "proyectos",
        name: "proyectos",
        component: () => import("src/pages/proyectos/IndexProyectos.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "gestiones",
        name: "gestiones",
        component: () => import("src/pages/gestiones/IndexGestiones.vue"),
        meta: { requireAuth: true },
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("src/pages/auth/LoginPage.vue"),
      },
      {
        path: "signup",
        name: "signup",
        component: () => import("src/pages/auth/SignupPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
