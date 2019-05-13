import Vue from 'vue'
import App from './App.vue'
// import router from './route'

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.use(iView);
Vue.use(VueResource);

new Vue({
  // router: router,
  render: h => h(App),
}).$mount('#app')
