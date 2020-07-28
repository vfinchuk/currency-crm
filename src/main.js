import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from './filters/date.filter'
import currencyFilter from './filters/currency.filter'
import tooltipDirective from './directives/tooltip.directive'
import messagePlugin from './utils/message.plugin'
import Loader from '@/components/app/Loader'

import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

Vue.config.productionTip = false

Vue.use(messagePlugin)
Vue.use(Vuelidate)

Vue.component('Paginate', Paginate)
Vue.component('Loader', Loader)

Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)

Vue.directive('tooltip', tooltipDirective)

firebase.initializeApp({
  apiKey: 'AIzaSyCpCeGin2mP3cEh4wI0Ynm-Qaa20eDki2M',
  authDomain: 'currency-crm.firebaseapp.com',
  databaseURL: 'https://currency-crm.firebaseio.com',
  projectId: 'currency-crm',
  storageBucket: 'currency-crm.appspot.com',
  messagingSenderId: '516548188240',
  appId: '1:516548188240:web:d61d73cc0926a7e41f5955'
})

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
