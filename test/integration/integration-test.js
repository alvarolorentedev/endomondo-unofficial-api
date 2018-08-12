const index = require('../../index'),
    faker = require('faker')

describe('integration should', () => {
    test('can authenticate and retrieve data', async () => {
        let params = {
            email: process.env.ENDOMONDO_EMAIL,
            password: process.env.ENDOMONDO_PASSWORD,
        }
        let auth = await index.authenticate(params)
        expect(auth.authToken).toBeDefined()
        
        let paramsWorkouts = {
            authToken: auth.authToken
        }
        let workouts = await index.workouts(paramsWorkouts)
        expect(workouts.data).toBeDefined()

        let paramsSetWorkout = {
            workoutId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            authToken: auth.authToken, 
            userId: auth.userId, 
            time: Date.now()-70,
            duration: 60, 
            distance: 0.05 
        }
        let workout = await index.workout.set(paramsSetWorkout)
        expect(workout.workoutId).toEqual(paramsSetWorkout.workoutId)

        let paramsGetWorkout = {
            workoutId: paramsSetWorkout.workoutId,
            authToken: auth.authToken
        }
        let workoutGet = await index.workout.get(paramsGetWorkout)
        expect(workoutGet).toBeDefined()
    })
})