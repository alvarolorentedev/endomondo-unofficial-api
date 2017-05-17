'use strict'

const   authenticate = require('./lib/authentication'),
        workouts = require('./lib/workouts'),
        workout = require('./lib/workout'),
        attributes = require('./lib/attributes'),
        gpx = require('./lib/gpx')

module.exports= {
    authenticate: authenticate,
    workouts: workouts,
    workout: workout,
    attributes: attributes,
    gpx: gpx
}
