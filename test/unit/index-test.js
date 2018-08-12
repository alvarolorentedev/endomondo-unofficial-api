jest.mock('../../lib/authentication' , () => jest.fn())
jest.mock('../../lib/workout' , () => jest.fn())
jest.mock('../../lib/workouts' , () => jest.fn())

const index = require('../../index'),
    authenticate = require('../../lib/authentication')
    workouts = require('../../lib/workouts')
    workout = require('../../lib/workout')

describe('index should', () => {
    test('export authenticate from lib', async () => {
        expect(index.authenticate).toBe(authenticate)
    })
    test('export workout from lib', async () => {
        expect(index.workout).toBe(workout)
    })
    test('export workouts from lib', async () => {
        expect(index.workouts).toBe(workouts)
    })
})