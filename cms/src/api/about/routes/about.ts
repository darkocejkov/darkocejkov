export default {
  routes: [
    {
      method: "GET",
      path: "/about",
      handler: "about.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/about",
      handler: "about.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
