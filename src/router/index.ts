import {createRouter, createWebHashHistory} from "vue-router";
import {Route} from "@/common/constant";

const routes = [
  {
    path: "/",
    component: () => import("../components/layout/MainLayout.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        redirect: "/dashboard/system",
        component: () => import("../view/dashboard/Dashboard.vue"),
        children: [
          {
            path: "/dashboard/system",
            name: "systemData",
            component: () => import("../view/dashboard/panel/System.vue"),
          },
          {
            path: "/dashboard/application",
            name: "applicationData",
            component: () => import("../view/dashboard/panel/Application.vue"),
          }
        ]
      },
      {
        path: "/regression",
        name: "regressionTest",
        component: () => import("../view/regression/Regression.vue"),
        children: [
          {
            path: "/regression/report",
            name: "report",
            component: () => import("../view/report/Report.vue"),
            children: [
              {
                path: "/regression/report/analysis",
                name: "detailAnalysis",
                component: () => import("../view/analysis/Analysis.vue"),
              },
              {
                path: "/regression/report/diffDetail",
                name: "diffDetail",
                component: () => import("../view/analysis/diff/DiffDetail.vue"),
              },
            ]
          }
        ]
      },
      {
        path: "/results",
        name: "executionRecords",
        component: () => import("../view/records/Records.vue"),
      },
      {
        path: "/configuration",
        name: "basicConfiguration",
        component: () => import("../view/configuration/Configuration.vue"),
      },
    ]
  },
  {
    path: "/",
    component: () => import("../components/layout/MainLayout.vue"),
    children: [
      {
        path: "/portal",
        name: Route.PORTAL,
        component: () => import("../view/portal/Portal.vue")
      },
      {
        path: "/404",
        name: Route.ERROR_404,
        component: () => import("../view/error/404.vue")
      },
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

router.beforeEach((to: any) => {
  if (!to.matched || to.matched.length === 0) {
    return Route.ERROR_404;
  } else if (to.path === "/") {
    return Route.PORTAL;
  }
  return true;
});
