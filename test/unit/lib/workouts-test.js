jest.mock('../../../lib/common', () => ({
    urls: {
        api: 'https://api.mobile.endomondo.com/',
        paths: {
            activitiesList: 'mobile/api/workout/list',
        }
    }
}))
jest.mock('request-promise-native', () => ({ get: jest.fn() }))

const workouts = require('../../../lib/workouts'),
    { faker } = require('@faker-js/faker'),
    request = require('request-promise-native'),
    common = require('../../../lib/common')

describe('workouts should', () => {    
    beforeEach(() => {
        request.get.mockClear()
        request.get.mockImplementation(() => `{}`)

    })

    test('request get is called with correct url', async () => {
        await workouts({})
        expect(request.get.mock.calls[0][0].url).toEqual(`${common.urls.api}${common.urls.paths.activitiesList}`)
    })

    test('request get is called with correct json parameter', async () => {
        await workouts({})
        expect(request.get.mock.calls[0][0].json).toEqual(true)
    })

    test('request get is called with correct query parameters if all passed', async () => {
        let params = {
            authToken: faker.string.uuid(),
            fields: faker.string.uuid(),
            maxResults: faker.string.uuid(),
            deflate: faker.string.uuid(),
            compression: faker.string.uuid(),
            before: faker.string.uuid(),
            after: faker.string.uuid()
        }

        await workouts(params)

        expect(request.get.mock.calls[0][0].qs).toEqual(params)
    })

    test('request get returns parsed json result', async () => {
        let expectedResult = { something : faker.string.uuid() }
        request.get.mockReturnValue(Promise.resolve(expectedResult))
        let result = await workouts({})
        expect(result).toEqual(expectedResult)
    })

})