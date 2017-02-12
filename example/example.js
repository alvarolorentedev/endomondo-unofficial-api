var endomondo = require('../index')

var params = {
    email: '',
    password: ''
}

var token = undefined
var userId = undefined

endomondo.authenticate(params)
    .then((result) => {
        console.log(result)
        token = result.authToken
        userId = result.userId
        return result
    })
    .then((result) => {return endomondo.workouts({authToken: token})})
    .then((result) => {
        console.log(result)
        return result
    })
    .then((result) => {return endomondo.workout.get({authToken: token, workoutId: result.data[0].id})})
    .then((result) => {
        console.log(result)
        return result
    })
    .then((result) => {return endomondo.workout.set({authToken: token, userId: userId, time: Date.now()-70,duration: 60, distance: 0.05 })})
    .then((result) => {
        console.log(result)
        return result
    })
    .catch((result) => console.log(result))
