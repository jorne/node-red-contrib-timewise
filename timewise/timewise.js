/**
* timewise node
*
* Copyright 2015, Jorne Roefs.
* All rights reserved.
*
*/

module.exports = function(RED) {
  'use strict';
  function TimewiseNode(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    var time = config.time || '';
    var days = config.days || '';
    var checkTime = false;

    // Parse time
    var timeParts = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time);
    if (timeParts !== null) {
      var hours = parseInt(timeParts[1], 10);
      var minutes = parseInt(timeParts[2], 10);

      checkTime = true;
    }

    // Parse days
    days = days.split(',').map((day, index, arr) => {
      day = parseInt(day, 10);
      if (0 <= day && day <= 6) return day;
    });

    this.on('input', function(msg) {
      var timePassedOrOmitted = true;
      var today = false;
      var now = new Date();

      // If a valid time was given, check whether it passed
      if (checkTime) {
        timePassedOrOmitted = false;
        var givenTime = new Date();

        givenTime.setHours(hours);
        givenTime.setMinutes(minutes);

        if (now >= givenTime) {
          timePassedOrOmitted = true;
        }
      }

      // Check if we should run today
      if (days.length > 0 && days.length <= 7) {
        // One or more days selected, check for today
        days.forEach((day) => {
          if (day == now.getDay()) {
            today = true;
          }
        });
      }

      if ( timePassedOrOmitted && today ) {
        node.send([msg, null]);
      } else {
        node.send([null, msg]);
      }
    });
  }

  RED.nodes.registerType('timewise', TimewiseNode);
};
