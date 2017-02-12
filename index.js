'use strict'

const authenticate = require('./lib/authentication'),
    workouts = require('./lib/workouts')

module.exports= {
    authenticate: authenticate,
    workouts: workouts
}