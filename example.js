"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const powerGauge = new Gauge({
    minValue: 5,
    maxValue: 300000,
    lowThreshhold: 300,
    highThreshhold: 2000,
    scale: "log",
    displayUnit: "Correlation level ",
  });

  powerGauge.render("#gauge");

  // Generate a random reading every 3 seconds
  setInterval(function () {
    powerGauge.update(Math.random() * 1000);
  }, 2 * 1000);
});
