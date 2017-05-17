'use strict'

var request = require('request'),
    moment = require('moment'),
    common = require('./common'),
    apiUrl = common.urls.api,
    paths = common.urls.paths,
    regex = common.regex.workout,
    handleError = common.handleError,
    attributes = require('./attributes'),
    sportAttr = attributes.sport,
    trackAttr = attributes.track

function getQueryString(params){
    return {
        authToken: params.authToken,
        workoutId: params.workoutId,
        fields: params.fields || [
			'device', 'simple','basic', 'motivation', 'interval',
			'hr_zones', 'weather', 'polyline_encoded_small', 'points',
			'lcp_count', 'tagged_users', 'pictures', 'feed'
		].join(",")
    }
}

function workoutGet(params) {
    return new Promise((resolve, reject) =>{
    var qs = getQueryString(params)
    var url = apiUrl + paths.activity.get

    request.get({ url: url, qs: qs }, (err, response, body) => {
        if(err)
            reject(err)
        else
            resolve(JSON.parse(body))
        });
    })
}

function getWorkoutParams(params){
    return{
        workoutId: params.id,
        sport: params.sport || sportAttr.RUNNING,
        duration: params.duration || 0,
        gzip: params.gzip || true,
        audioMessage: params.audioMessage || false,
        goalType: params.goalType || 'BASIC',
        extendedResponse: params.extendedResponse || undefined,
        calories: params.calories || undefined,
        hydration: params.hydration || undefined
    }
}

function convertWorkout(workoutPoints){
    var points = '';
    for(var workoutPoint of workoutPoints){
        points +=   moment.utc(workoutPoint.time).format('YYYY-MM-DD hh:mm:ss UTC') + ';' +
                    workoutPoint.inst + ';' +
                    (workoutPoint.latitude ? workoutPoint.latitude.toFixed(8) : '') + ';' +
                    (workoutPoint.longitude ? workoutPoint.longitude.toFixed(8) : '') + ';' +
                    (workoutPoint.distance ? workoutPoint.distance.toFixed(3) : '') + ';' +
                    (workoutPoint.speed ? workoutPoint.speed.toFixed(3) : '') + ';' +
                    (workoutPoint.altitude ? workoutPoint.altitude.toFixed(3) : '') + ';' +
                    workoutPoint.heartRate + ';\n'
    }
    return points.replace(/undefined/g,'');
}

function postQueryString(params){
    var points = params.points ? params.points : [{time: params.time, distance: params.distance, inst: trackAttr.END}]
    return {
        authToken: params.authToken,
        duration: params.duration,
        distance: params.distance || 0,
        sport: params.sport || sportAttr.RUNNING,
        trackPoints: convertWorkout(points),
        workoutId: params.workoutId || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    }
}

function workoutSet(params) {
    return new Promise((resolve, reject) =>{
    var qs = postQueryString(params)
    var url = apiUrl + paths.activity.post

    request.post({ url: url, qs: qs }, (err, response, body) => {
        if (err || !regex.isOk.test(body))
        {
            reject(handleError(err))
        }
        else
            resolve({workoutId: qs.workoutId})
        });
    })
}

function fixTracks(tracks, splitAfterMin, pauseBelowSpeed) {
    var _setInst = function(t) {
      if(t.length > 1) {
          t[0].inst = trackAttr.START;           //mark first point as start
      }
      if(t.length > 0) {
          t[t.length - 1].inst = trackAttr.END; //mark last point as end
      }
      return t;
    };

    var splitAfter = splitAfterMin ? (splitAfterMin * 60 * 1000) : (24 * 60 * 60 * 1000);
    var pauseSpeed = pauseBelowSpeed || 0.03;
    var pause = false;

    var res = [];
    tracks.forEach(function(track){
      var newTrack = [];
      track.forEach(function(p){
        /* for a new track add a point */
        if(newTrack.length == 0){
          newTrack.push(p);
        }
        /* mark point as paused if below thresholde value, do not add further low speed points */
        else if (p.speed < pauseSpeed) {
          if(!pause) {
            pause = true;
            p.inst = trackAttr.PAUSE;
          }
        }
        /* detect new track after long pause, e.g. next day */
        else if((p.time - splitAfter) > newTrack[newTrack.length - 1].time) {
          res.push(_setInst(newTrack));
          newTrack = [];
        }
        /* add point to current track */
        else {
          if(pause){
            pause = false;
            p.inst = trackAttr.RESTART;
          }
          newTrack.push(p);
        }
      });
      /* add track if no more points available */
      if(newTrack.length > 0){
        res.push(_setInst(newTrack));
      }
    });
    return res;
}

module.exports = {
    get: workoutGet,
    set: workoutSet,
    fix: fixTracks
}
