/* eslint no-unused-expressions: 0 */

import Vue from 'vue'
import WeatherWidget from '@/components/WeatherWidget'
import moxios from 'moxios'

describe('WeatherWidget.vue', () => {
  var widget

  function getComp (Component) {
    let Comp = Vue.extend(Component)
    return new Comp()
  }

  beforeEach(() => {
    moxios.install()
    widget = getComp(WeatherWidget).$mount()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  describe('#data', () => {
    it('should initially return an await message', () => {
      expect(widget.$el.querySelector('#ajax-await-message').textContent)
        .to.equal('Awaiting weather data')
    })

    it('should initially contain an empty daily data array', () => {
      expect(widget.$data.daily.data).to.have.length(0)
    })

    it('should initially have no summary', () => {
      expect(widget.$data.daily.summary).to.equal('')
    })
  })

  describe('#getData - AJAX success', () => {
    beforeEach(() => {
      moxios.stubRequest('https://jsonbin.io/b/59db791f3a67f427208e223f', {
        status: 200,
        response: {
          daily: {
            summary: 'Cloudy with a chance of meatballs',
            data: [{}, {}, {}, {}]
          }
        }
      })
    })

    it('populates the daily data array', (done) => {
      widget.getData().then(() => {
        expect(widget.$data.daily.data).to.have.length(4)
      }).then(done, done)
    })

    it('sets waiting to false', (done) => {
      widget.getData().then(() => {
        expect(widget.$data.waiting).to.equal(false)
      }).then(done, done)
    })

    it('sets the daily summary', (done) => {
      widget.getData().then(() => {
        expect(widget.$data.daily.summary).to.equal('Cloudy with a chance of meatballs')
      }).then(done, done)
    })
  })

  describe('#getData - AJAX reject response', () => {
    beforeEach(() => {
      moxios.stubRequest('https://jsonbin.io/b/59db791f3a67f427208e223f', {
        status: 404
      })
    })

    it('logs the error to the console', (done) => {
      var consoleSpy = sinon.stub(console, 'log')
      widget.getData().then(() => {
        expect(consoleSpy).to.have.been.called
      }).then(done, done)
    })

    it('sets waiting to false', (done) => {
      widget.getData().then(() => {
        expect(widget.$data.waiting).to.equal(false)
      }).then(done, done)
    })

    it('sets an error message as the summary', (done) => {
      widget.getData().then(() => {
        expect(widget.$data.daily.summary).to.equal('Weather data could not be retrieved')
      }).then(done, done)
    })
  })

  describe('#getDayStyles', () => {
    var day

    beforeEach(() => {
      day = {}
    })

    it('sets the height in pixels for each day', () => {
      day.apparentTemperatureHigh = 5
      widget.$data.daily.data = [day]
      widget.getDayStyles()
      expect(day.style).to.include('height:50px')
    })

    it('sets the blue day class if the temperature is below 17', () => {
      day.apparentTemperatureHigh = 15
      widget.$data.daily.data = [day]
      widget.getDayStyles()
      expect(day.class).to.include('day-blue')
    })

    it('sets the orange day class if the temperature is 17 or above', () => {
      day.apparentTemperatureHigh = 18
      widget.$data.daily.data = [day]
      widget.getDayStyles()
      expect(day.class).to.include('day-orange')
    })
  })

  describe('#clickDay', () => {
    var day

    beforeEach(() => {
      day = {}
    })

    it('shows the specific day summary', () => {
      day.summary = 'Raining cats and dogs'
      widget.$data.daily.data = [day]
      widget.clickDay(day)
      expect(widget.daySummary).to.equal('Raining cats and dogs')
    })

    it('shows the day summary', () => {
      widget.$data.daily.data = [day]
      widget.clickDay(day)
      expect(widget.showDaySummary).to.equal(true)
    })
  })

  describe('#summaryRestore', () => {
    beforeEach(() => {
      var day = {}
      widget.$data.daily.data = [day]
      widget.clickDay(day)
    })

    it('hides the day summary', () => {
      widget.summaryRestore()
      expect(widget.showDaySummary).to.equal(false)
    })
  })
})
