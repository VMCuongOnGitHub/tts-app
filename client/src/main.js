// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'

import { BootstrapVue,BootstrapVueIcons } from 'bootstrap-vue'
import Vuex from 'vuex'

import AudioVisual from 'vue-audio-visual'

Vue.use(AudioVisual)


import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store : store,
  router,
  components: { App },
  template: '<App/>'
})
