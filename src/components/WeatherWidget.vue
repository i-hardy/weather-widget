<template>
  <div class="weather">
    <h1>{{ header }}</h1>
    <p id="ajax-await-message" v-if="waiting">{{ message }}</p>
    <section id="ajax-complete" v-else>
      <p>{{ daily.summary }}</p>
      <ul>
        <li v-for="item in daily.data">
          <span :style="getDayStyle(item)" :title="item.apparentTemperatureHigh">
            {{ days[daily.data.indexOf(item)] }}
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import axios from 'axios'

  var weatherData = {
    API: 'https://jsonbin.io/b/59db791f3a67f427208e223f',
    days: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'],
    waiting: true,
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
      getDayStyle (day) {
        var height = 'height:' + day.apparentTemperatureHigh * 10 + 'px;'
        var background
        day.apparentTemperatureHigh < 17 ? background = 'background:#d1ecfa;' : background = 'background:#ffc125;'
        return height + background
      },
      getData () {
        return axios.get(this.API)
          .then(function (response) {
            weatherData.waiting = false
            Object.assign(weatherData, response.data)
          })
          .catch(function (error) {
            console.log(error.response)
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
  background-color: white;
  padding: 2em 0 4em 0;
  width: 75%;
  margin-left: auto;
  margin-right: auto;
}

h1, h2 {
  font-weight: normal;
}

ul {
  display:table;
  table-layout: fixed;
  width:70%;
  max-width:80em;
  height:10em;
  margin:0 auto;
  margin-top: 2em;
}

li {
  position:relative;
  display:table-cell;
  vertical-align:bottom;
  height: 15em;
}

span {
  margin:0 1em;
  display: block;
  animation: draw 1s ease-in-out;
}

span:before{
  position:absolute;
  left:0;right:0;top:100%;
  padding:5px 1em 0;
  display:block;
  text-align:center;
  content:attr(title);
  word-wrap: break-word;
}

@keyframes draw{
  0%{height:0;}
}

a {
  color: #42b983;
}
</style>
