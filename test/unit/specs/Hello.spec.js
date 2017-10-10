import Vue from 'vue'
import WeatherWidget from '@/components/WeatherWidget'

describe('WeatherWidget.vue', () => {
  var Constructor
  var vm

  beforeEach(() => {
    Constructor = Vue.extend(WeatherWidget)
    vm = new Constructor().$mount()
  })

  it('should render the headline', () => {
    expect(vm.$el.querySelector('.weather h1').textContent)
      .to.equal('Forecast')
  })
})
