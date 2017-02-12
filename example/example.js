var endomondo = require('../index')

var params = {
    email: '',
    password: ''
}

var token = null

endomondo.authenticate(params)
    .then((result) => {
        console.log(result)
        token = result.authToken
        return result
    })
    .then((result) => {return endomondo.workouts({authToken: token})})
    .then((result) => {
        console.log(result)
        return result
    })
    .then((result) => {return endomondo.workout({authToken: token, workoutId: result.data[0].id})})
    .then((result) => {
        console.log(result)
        return result
    })
    .catch((result) => console.log(result))
