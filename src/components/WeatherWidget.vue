<template>
  <div class="weather">
    <h4 id="ajax-await-message" class="weather-await-message" v-if="waiting">{{ message }}</h4>
    <section id="ajax-complete" class="weather-info" v-else>
      <h4 class="day-summary" v-if="showDaySummary">{{ daySummary }}</h4>
      <h4 class="weather-summary" v-else>{{ daily.summary }}</h4>
      <ul class="day-list">
        <li class="day" v-for="(item, index) in getDays" v-on:click="clickDay(item)">
          <span :style="item.style" :class="item.class" :title="item.showTemp +'°C'" :id="'bar_' + index">
            {{ days[index] }}
          </span>
        </li>
      </ul>
      <p class="weather-text">Click on a day to see a daily weather summary</p>
      <section class="weather-buttons">
        <button id="summary_btn" class="btn btn-weather element-blue" type="button" v-on:click="summaryRestore()">Show weekly summary</button>
        <button id="highs_btn" class="btn btn-weather element-orange" type="button" v-on:click="showHighs()">Show highs</button>
        <button id="lows_btn" class="btn btn-weather element-blue" type="button" v-on:click="showLows()">Show lows</button>
      </section>
    </section>
  </div>
</template>

<script>
  'use strict'
  import axios from 'axios'

  const tempCutOff = 17
  const tempHeightFactor = 10

  var weatherData = {
    API: 'https://jsonbin.io/b/59db791f3a67f427208e223f',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'],
    waiting: true,
    showDaySummary: false,
    daySummary: '',
    message: 'Awaiting weather data',
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
        this.getDayStyles()
        return this.daily.data
      }
    },
    methods: {
      getDayStyles (day) {
        this.daily.data.forEach((day) => {
          var height = 'height:' + day.showTemp * tempHeightFactor + 'px;'
          var color
          day.showTemp < tempCutOff ? color = 'day day-temp element-blue' : color = 'day day-temp element-orange'
          day.style = height
          day.class = color
        })
      },
      clickDay (day) {
        this.daySummary = day.summary
        this.showDaySummary = true
      },
      summaryRestore () {
        this.showDaySummary = false
      },
      showLows () {
        this.daily.data = this.daily.data.map((day) => {
          day.showTemp = day.apparentTemperatureLow
          return day
        })
      },
      showHighs () {
        this.daily.data = this.daily.data.map((day) => {
          day.showTemp = day.apparentTemperatureHigh
          return day
        })
      },
      getData () {
        let widget = this
        return axios.get(this.API)
          .then((response) => {
            weatherData.waiting = false
            Object.assign(weatherData, response.data)
            widget.showHighs()
          })
          .catch(() => {
            weatherData.message = 'Weather data could not be retrieved'
          })
      }
    }
  }
</script>

<style scoped>
  .weather {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 2em 0;
    width: 50%;
    margin: 2em auto 0;
  }

  .weather-info {
    display: flex;
    flex-direction: column;
  }

  .weather-text {
    font-size: 0.8em;
  }

  .weather-buttons {
    padding-top: 1em;
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

  .element-blue {
    background: rgb(209, 236, 250);
  }

  .element-blue:hover {
    background: rgba(209, 236, 250, 0.5);
  }

  .element-orange {
    background: rgb(255, 193, 37)
  }

  .element-orange:hover {
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
  }

  .day-temp:before {
    position:absolute;
    left:0;right:0;top:100%;
    text-align:center;
    font-size: 0.8em;
    content:attr(title);
    word-wrap: break-word;
  }
</style>
