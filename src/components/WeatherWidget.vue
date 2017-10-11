<template>
  <div class="weather">
    <h1>{{ header }}</h1>
    <p id="ajax-await-message" v-if="waiting">{{ message }}</p>
    <section id="ajax-complete" class="weather-info" v-else>
      <p class="weather-summary" v-if="!showDaySummary">{{ daily.summary }}</p>
      <p class="day-summary" v-if="showDaySummary">{{ daySummary }}</p>
      <ul class="day-list">
        <li class="day" v-for="(item, index) in daily.data" v-on:click="clickDay(item)">
          <span :style="item.style" :class="item.class" :title="item.apparentTemperatureHigh +'°C'" :id="'bar_' + index">
            {{ days[index] }}
          </span>
        </li>
      </ul>
      <p class="weather-interaction" v-on:click="summaryRestore()">
        Click on a day to see a weather summary, or click here to see the overall summary again
      </p>
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
    methods: {
      getDayStyles () {
        weatherData.daily.data.forEach((day) => {
          var height = 'height:' + day.apparentTemperatureHigh * tempDisplayFactor + 'px;'
          var color
          day.apparentTemperatureHigh < tempCutOff ? color = 'day day-temp day-blue' : color = 'day day-temp day-orange'
          day.style = height
          day.class = color
        })
      },
      clickDay (day) {
        weatherData.daySummary = day.summary
        weatherData.showDaySummary = true
      },
      summaryRestore () {
        weatherData.showDaySummary = false
      },
      getData () {
        let widget = this
        return axios.get(this.API)
          .then(function (response) {
            weatherData.waiting = false
            Object.assign(weatherData, response.data)
            widget.getDayStyles()
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
  width: 75%;
  margin-top: 2em;
  margin-left: auto;
  margin-right: auto;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.weather-interaction {
  font-size: 0.75em;
}

.day-list {
  display:table;
  table-layout: fixed;
  width:70%;
  max-width:80em;
  margin-left: auto;
  margin-right: auto;
  height:50%;
  margin-bottom: 4em;
}

.day {
  position:relative;
  display:table-cell;
  vertical-align:bottom;
  height: 15em;
}

.day-temp {
  display: block;
  min-width: 1em;
  width: 90%;
  animation: draw 1s ease-in-out;
}

.day-temp:before {
  position:absolute;
  left:0;right:0;top:100%;
  display:block;
  text-align:center;
  content:attr(title);
  word-wrap: break-word;
}

.day-blue {
  background:#d1ecfa;
}

.day-orange {
  background:#ffc125;
}

@keyframes draw{
  0%{height:0;}
}
</style>
