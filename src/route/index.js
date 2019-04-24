import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

var routes = [];



routes.push({
  path: `/Visual`,
  name: 'Visual',
  component: () => import(`@/components/Visualization`),
  // props: true,
})

routes.push({
  path: `/List`,
  name: 'List',
  component: () => import(`@/components/MoviePage`),
  // props: true,
})

routes.push({
  path: `/`,
  name: 'FrontPage',
  component: () => import(`@/components/FrontPage`),
  // props: true,
})


export default new Router({
  routes
})
