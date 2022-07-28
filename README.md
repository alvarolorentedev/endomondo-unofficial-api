# ![logomakr_7drp6q](https://cloud.githubusercontent.com/assets/3071208/22858608/36797c5e-f088-11e6-9821-ad926355ff05.png)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
[![Build Status](https://img.shields.io/github/workflow/status/kanekotic/endomondo-unofficial-api/Build%20%26%20Publish)](https://travis-ci.org/kanekotic/endomondo-unofficial-api)
[![Coverage Status](https://coveralls.io/repos/github/kanekotic/endomondo-unofficial-api/badge.svg?branch=master)](https://coveralls.io/github/kanekotic/endomondo-unofficial-api?branch=master)
[![npm](https://img.shields.io/npm/dt/endomondo-unofficial-api.svg)](https://github.com/kanekotic/endomondo-unofficial-api)
[![GitHub license](https://img.shields.io/github/license/kanekotic/endomondo-unofficial-api.svg)](https://github.com/kanekotic/endomondo-unofficial-api/blob/master/LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/kanekotic/endomondo-unofficial-api/graphs/commit-activity)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/kanekotic/)

This is a promise based unofficial endomondo api.

## installation 

```
npm install endomondo-unofficial-api
```

## Use

the API provides the next functionalities

### Authentication

Get login information and tokens. The next snippet describes an example of the call:

```js
var authenticate = require('endomondo-unofficial-api').authenticate

authenticate({email: <email>, password: <password>})
    .then((result) => console.log(result))
    .catch((result) => console.log(result))

```

the complete set of parameters get determined by:
```
{
    email: params.email,
    password: params.password,
    deviceId: params.uuid || uuid,
    country: params.country || 'ES',
    action: params.action || 'pair'
}
```

The result of the promise will be if failed the error that caused it and if success an result object similar to this:

```
{ 
  authToken: <token>,
  measure: <mesure unit>,
  displayName: <user name>,
  userId: <user id>,
  facebookConnected: <true|false>
}
```

### Workouts

Get a list of your workouts. The next snippet describes an example of the call:

```js
var workouts = require('endomondo-unofficial-api').workouts

var token = 'authToken'

workouts({authToken: token})
    .then((result) => { console.log(result) })
    .catch((result) => console.log(result))

```

the complete set of parameters get determined by:
```
{
    authToken: params.authToken,
    fields: params.fields || undefined,
    maxResults: params.maxResults || undefined,
    deflate: params.deflate || undefined,
    compression: params.compression || undefined,
    before: params.before || undefined,
    after: params.after || undefined,
}
```

The result of the promise will be if failed the error that caused it and if success an result object similar to this:

```
{
  "data":[<activities>],
  "more":false
}
```

### Workout (get)

Get a specific workout. The next snippet describes an example of the call:

```js
var workoutGet = require('endomondo-unofficial-api').workout.get

var token = 'authToken'
var workoutId = 'workoutId'

workoutGet({authToken: token, workoutId: workoutId})
    .then((result) => { console.log(result) })
    .catch((result) => console.log(result))

```

the complete set of parameters are determined by:
```
{
    workoutId: params.id,
    sport: params.sport || 0,
    duration: params.duration || 0,
    gzip: params.gzip || true,
    audioMessage: params.audioMessage || false,
    goalType: params.goalType || 'BASIC',
    extendedResponse: params.extendedResponse || undefined,
    calories: params.calories || undefined,
    hydration: params.hydration || undefined
}
```

The result of the promise will be if failed the error that caused it and if success an result object that is quite complex to describe just try it ;) .

### Workout (set)

Set (or create) a specific workout. The next snippet describes an example of the call:

```js
var workoutSet = require('endomondo-unofficial-api').workout.set

var token = 'authToken'
var userId = 'userId'

workoutSet({authToken: token, userId: userId, time: Date.now()-70, duration: 60, distance: 0.05 })
    .then((result) => { console.log(result) })
    .catch((result) => console.log(result))

```

the complete set of parameters are determined by:
```
{
    authToken: params.authToken,
    duration: params.duration,
    trackPoints: [ { dateTime, inst, latitude, longitude, distance, speed, altitude, heartRate }],
    workoutId: params.workoutId || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}
```
or 
```
{
    authToken: params.authToken,
    duration: params.duration,
    time: params.time, 
    distance: params.distance,
    workoutId: params.workoutId || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}
```

The result of the promise will be if failed the error that caused it and if success an result object like this:

```
{ workoutId: <workoutId> }
```

## Thanks

Special thanks to @aperezm85 whos code was used as inspiration for this package.

### Logo 

Sport graphic by <a href="http://www.flaticon.com/authors/webalys">Webalys</a> from <a href="http://www.flaticon.com/">Flaticon</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made with <a href="http://logomakr.com" title="Logo Maker">Logo Maker</a>

## Disclaimer, legalese and everything else.

This is not affiliated or endorset by Endomondo, or any other party. This software available on the site is provided "as is" and any expressed or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. In no event shall the user under the pseudonym Kanekotic, or any of their contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.toranders.com"><img src="https://avatars.githubusercontent.com/u/422309?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tor Anders Johansen</b></sub></a><br /><a href="https://github.com/kanekotic/endomondo-unofficial-api/commits?author=toralux" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/marcpoppleton"><img src="https://avatars.githubusercontent.com/u/10866813?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marc Poppleton</b></sub></a><br /><a href="https://github.com/kanekotic/endomondo-unofficial-api/commits?author=marcpoppleton" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!