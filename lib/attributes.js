/* Track commands are used to indicate current tracking state for tracking points. */
var track = {
     START: 2,
     PAUSE: 0,
     RESTART: 1,
     END: 3
};

/* Sport codes */
var sport = {
  RUNNING: 0,
  CYCLING: 2
};

module.exports = {
    track: track,
    sport: sport
}
