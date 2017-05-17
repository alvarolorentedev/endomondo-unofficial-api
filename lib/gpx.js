'use strict'

var gpxParse = require("gpx-parse");
var attributes = require('./attributes'),
    sportAttr = attributes.sport,
    trackAttr = attributes.track

var EARTH_RADIUS_KM = 6371.0;

function deg2rad(deg) {
    return (deg * Math.PI / 180);
}

function rad2deg(rad) {
    return (rad * 180 / Math.PI);
}

function distanceEarth(lat1, lon1, lat2, lon2) {
    var lat1r, lon1r, lat2r, lon2r, u, v;
    lat1r = deg2rad(lat1);
    lon1r = deg2rad(lon1);
    lat2r = deg2rad(lat2);
    lon2r = deg2rad(lon2);
    u = Math.sin((lat2r - lat1r)/2);
    v = Math.sin((lon2r - lon1r)/2);
    return 2.0 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(u * u + Math.cos(lat1r) * Math.cos(lat2r) * v * v));
};

function parseGpxFromFile(file, cb) {
    new Promise((resolve, reject) => {
        gpxParse.parseGpxFromFile(file, function(error, data) {
            if(error) {
                reject(error);
            }
            var tracks = data.tracks.map(function(track) {
                var points = [];
                track.segments.map(function(segment) {
                    var _dist = 0;
                    var last = segment[0];
                    var ps = segment.map((s) => {
                        var l = last;
                        last = s;
                        var dist = distanceEarth(l.lat, l.lon, s.lat, s.lon);
                        _dist += dist;
                        return {
                            time: Date.parse(s.time),
                            longitude: s.lon,
                            latitude: s.lat,
                            altitude: s.elevation,
                            dist: {last: dist, all: _dist}, // km
                            speed: (dist * 1000 / ((Date.parse(s.time) - Date.parse(l.time)) / 1000)) // m/s
                        }
                    });
                    if(ps.length > 1) {
                        ps[0].inst = trackAttr.RESTART;           //mark first point as restart
                    }
                    if(ps.length > 0) {
                        ps[ps.length - 1].inst = trackAttr.PAUSE; //mark last point as pause
                    }
                    points = points.concat(ps);
                });
                if(points.length > 1) {
                    points[0].inst = trackAttr.START;               //mark first point as start
                }
                if(points.length > 0) {
                    points[points.length - 1].inst = trackAttr.END; //mark last point as end
                }
                return points;
            });
          resolve(tracks);
        });
    }).then((tracks) => cb(null, tracks), function(error) {
        cb(error);
    });
}

module.exports = {
    parseGpxFromFile: parseGpxFromFile
}
