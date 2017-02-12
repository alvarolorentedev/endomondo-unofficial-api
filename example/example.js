var endomondo = require('../index')

var params = {
    email: '',
    password: ''
}

endomondo.authenticate(params)
    .then((result) => {
        console.log(result)
        return result
    })
    .then((result) => {return endomondo.workouts({authToken: result.authToken})})
    .catch((result) => console.log(result))
