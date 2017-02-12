'use strict'

const   authenticate = require('./lib/authentication'),
        workouts = require('./lib/workouts'),
        workout = require('./lib/workout')

module.exports= {
    authenticate: authenticate,
    workouts: workouts,
    workout: workout
}