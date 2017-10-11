<template>
  <div class="weather">
    <h4 id="ajax-await-message" class="weather-await-message" v-if="waiting">{{ message }}</h4>
    <section id="ajax-complete" class="weather-info" v-else>
      <h4 class="weather-summary" v-if="!showDaySummary">{{ daily.summary }}</h4>
      <h4 class="day-summary" v-if="showDaySummary">{{ daySummary }}</h4>
      <ul class="day-list">
        <li class="day" v-for="(item, index) in getDays" v-on:click="clickDay(item)">
          <span :style="item.style" :class="item.class" :title="item.showTemp +'°C'" :id="'bar_' + index">
            {{ days[index] }}
          </span>
        </li>
      </ul>
      <p class="weather-text">Click on a day to see a daily weather summary</p>
      <section class="weather-interaction">
        <div class="weather-buttons">
          <button id="summary_btn" class="btn btn-weather btn-blue" type="button" v-on:click="summaryRestore()">Show weekly summary</button>
          <button id="highs_btn" class="btn btn-weather btn-orange" type="button" v-on:click="showHighs()">Show highs</button>
          <button id="lows_btn" class="btn btn-weather btn-blue" type="button" v-on:click="showLows()">Show lows</button>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
  import axios from 'axios'

  const tempCutOff = 17
  const tempDisplayFactor = 10

  var weatherData = {
    API: 'https://jsonbin.io/b/59db791f3a67f427208e223f',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'],
    waiting: true,
    showDaySummary: false,
    daySummary: '',
    message: 'Awaiting weather data',
    header: 'Forecast',
    daily: {
      summary: '',
      data: []
    }
  }

  export default {
    name: 'WeatherWidget',
    data () {
      return weatherData
    },
    created () {
      this.getData()
    },
    computed: {
      getDays () {
        return weatherData.daily.data
      }
    },
    methods: {
      getDayStyles () {
        weatherData.daily.data.forEach((day) => {
          var height = 'height:' + day.showTemp * tempDisplayFactor + 'px;'
          var color
          day.showTemp < tempCutOff ? color = 'day day-temp day-blue' : color = 'day day-temp day-orange'
          day.style = height
          day.class = color
        })
        this.$forceUpdate()
      },
      clickDay (day) {
        weatherData.daySummary = day.summary
        weatherData.showDaySummary = true
      },
      summaryRestore () {
        weatherData.showDaySummary = false
      },
      showLows () {
        weatherData.daily.data.forEach((day) => {
          day.showTemp = day.apparentTemperatureLow
        })
        this.getDayStyles()
      },
      showHighs () {
        weatherData.daily.data.forEach((day) => {
          day.showTemp = day.apparentTemperatureHigh
        })
        this.getDayStyles()
      },
      getData () {
        let widget = this
        return axios.get(this.API)
          .then(function (response) {
            weatherData.waiting = false
            Object.assign(weatherData, response.data)
            widget.showHighs()
          })
          .catch(function (error) {
            console.log(error)
            weatherData.waiting = false
            weatherData.daily.summary = 'Weather data could not be retrieved'
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.weather {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 2em 0 2em 0;
  width: 50%;
  margin-top: 2em;
  margin-left: auto;
  margin-right: auto;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.weather-interaction {
  padding-top: 1em;
}

.weather-text {
  font-size: 0.8em;
}

.weather-buttons {
  display: flex;
  justify-content: space-evenly;
}

.btn-weather {
  cursor: pointer;
  padding: 0.5em;
  display: inline-block;
  width: 20%;
  border: none;
  max-height: 100%;
}

.btn-weather:focus {
  outline: none;
}

.btn-blue {
  background: rgb(209, 236, 250);
}

.btn-blue:hover {
  background: rgba(209, 236, 250, 0.5);
}

.btn-orange {
  background: rgb(255, 193, 37)
}

.btn-orange:hover {
  background: rgba(255, 193, 37, 0.5);
}


.day-list {
  display:table;
  table-layout: fixed;
  width:70%;
  max-width:80em;
  margin: 0 auto 4em;
  height:50%;
}

.day {
  position:relative;
  display:table-cell;
  vertical-align:bottom;
  height: 15em;
}

.day-temp {
  display: block;
  cursor: pointer;
  margin-left: -1em;
  min-width: 1em;
  width: 90%;
  animation: draw 1s ease-in-out;
}

.day-temp:before {
  position:absolute;
  left:0;right:0;top:100%;
  text-align:center;
  font-size: 0.8em;
  content:attr(title);
  word-wrap: break-word;
}

.day-blue {
  background:rgb(209, 236, 250);
}

.day-blue:hover {
  background: rgba(209, 236, 250, 0.5);
}

.day-orange {
  background:rgb(255, 193, 37);
}

.day-orange:hover {
  background: rgba(255, 193, 37, 0.5);
}

@keyframes draw{
  0%{height:0;}
}
</style>
