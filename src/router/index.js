import Vue from 'vue'
import Router from 'vue-router'
import WeatherWidget from '@/components/WeatherWidget'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'WeatherWidget',
      component: WeatherWidget
    }
  ]
})
