module.exports = {
  'Weather widget e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .assert.elementPresent('.weather')
      .assert.containsText('p', 'Awaiting weather data')
      .waitForElementVisible('#ajax-complete', 5000)
      .assert.containsText('h1', 'Forecast')
      .assert.containsText('.weather-summary', 'Drizzle today and Thursday')
      .assert.elementCount('li', 8)
      .click('#bar_0')
      .assert.elementNotPresent('.weather-summary')
      .assert.containsText('.day-summary', 'Light rain in the afternoon')
      .click('#bar_4')
      .assert.containsText('.day-summary', 'Mostly cloudy until evening')
      .click('.weather-interaction')
      .assert.elementNotPresent('.day-summary')
      .assert.elementPresent('.weather-summary')
      .end()
  }
}
