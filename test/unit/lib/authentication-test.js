jest.mock('../../../lib/common', () => ({
    urls: {
        api: 'https://api.mobile.endomondo.com/',
        paths: {
            auth: 'mobile/auth'
        }
    },
    regex: {
        auth: {
            isOk: /OK\n/,
            authToken: /authToken=(.*?)\n/,
            measure: /measure=(.*?)\n/,
            displayName: /displayName=(.*?)\n/,
            userId: /userId=(.*?)\n/,
            facebookConnected: /facebookConnected=(.*?)\n/
        }
    },
    handleError: jest.fn()
}))
jest.mock('request-promise-native', () => ({ get: jest.fn() }))
jest.mock('uuid', () => ({v1: jest.fn()}))

const authenticate = require('../../../lib/authentication'),
    { faker } = require('@faker-js/faker'),
    request = require('request-promise-native'),
    common = require('../../../lib/common'),
    uuid = require('uuid')

describe('authenticate should', () => {    
    beforeEach(() => {
        uuid.v1.mockReturnValue(faker.string.uuid())
        request.get.mockClear()
        request.get.mockImplementation(() => 
        `
        OK\n
        authToken=pepe\n
        measure=pepe\n
        displayName=pepe\n
        userId=pepe\n
        facebookConnected=pepe\n
        `)

    })
    test('request get is called with correct url', async () => {

        await authenticate({})

        expect(request.get.mock.calls[0][0].url).toEqual(`${common.urls.api}${common.urls.paths.auth}`)
    })

    test('request get is called with correct query parameters if all passed', async () => {
        let params = {
            email: faker.string.uuid(),
            password: faker.string.uuid(),
            uuid: faker.string.uuid(),
            country: faker.string.uuid(),
            action: faker.string.uuid()
        }

        await authenticate(params)

        expect(request.get.mock.calls[0][0].qs.email).toEqual(params.email)
        expect(request.get.mock.calls[0][0].qs.password).toEqual(params.password)
        expect(request.get.mock.calls[0][0].qs.deviceId).toEqual(params.uuid)
        expect(request.get.mock.calls[0][0].qs.country).toEqual(params.country)
        expect(request.get.mock.calls[0][0].qs.action).toEqual(params.action)
    })

    test('request get is called with default parameter for country as US', async () => {
        authenticate({})

        await expect(request.get.mock.calls[0][0].qs.country).toEqual('US')
    })

    test('request get is called with default parameter for action as pair', async () => {
        authenticate({})

        await expect(request.get.mock.calls[0][0].qs.action).toEqual('pair')
    })

    test('request get is called with default parameter for uuid', async () => {
        let expected = faker.string.uuid()
        uuid.v1.mockReturnValue(expected)

        authenticate({})

        await expect(request.get.mock.calls[0][0].qs.deviceId).toEqual(expected)
    })

    test('request get response is not Ok', async () => {
        let expected = faker.string.uuid()
        common.handleError.mockReturnValue(expected)
        request.get.mockImplementation(() => 'Fail\n')
        expect(authenticate({})).rejects.toEqual(expected)
    })

    test('request get response should return mapped object', async () => {
        let authToken= faker.string.uuid()
        let measure= faker.string.uuid()
        let displayName= faker.string.uuid()
        let userId= faker.string.uuid()
        let facebookConnected= faker.string.uuid()
        let secureToken= faker.string.uuid()
        request.get.mockImplementation(() => `
        OK\n
        authToken=${authToken}\n
        measure=${measure}\n
        displayName=${displayName}\n
        userId=${userId}\n
        facebookConnected=${facebookConnected}\n
        `)

        let result = await authenticate({})

        expect(result).toEqual({
            authToken: authToken,
            measure: measure,
            displayName: displayName,
            userId: userId,
            facebookConnected: facebookConnected
        })
    })
})
