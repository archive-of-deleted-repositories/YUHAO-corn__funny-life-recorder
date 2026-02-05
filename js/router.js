// router.js - Hash 路由

const Router = {
  routes: ['home', 'exercise', 'food', 'social'],
  currentRoute: 'home',

  init() {
    window.addEventListener('hashchange', () => this.handleRouteChange());
    this.handleRouteChange();
  },

  handleRouteChange() {
    const hash = window.location.hash.slice(1) || 'home';
    if (this.routes.includes(hash)) {
      this.currentRoute = hash;
      if (typeof App !== 'undefined' && App.render) {
        App.render();
      }
    }
  },

  navigate(route) {
    window.location.hash = route;
  },

  getCurrentRoute() {
    return this.currentRoute;
  }
};
