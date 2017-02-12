# ![logomakr_7drp6q](https://cloud.githubusercontent.com/assets/3071208/22858608/36797c5e-f088-11e6-9821-ad926355ff05.png)

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
  facebookConnected: <true|false>,
  secureToken: <token> 
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

## Thanks

Special thanks to @aperezm85 whos code was used as inspiration for this package.

### Logo 

Sport graphic by <a href="http://www.flaticon.com/authors/webalys">Webalys</a> from <a href="http://www.flaticon.com/">Flaticon</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made with <a href="http://logomakr.com" title="Logo Maker">Logo Maker</a>

## Disclaimer, legalese and everything else.

This is not affiliated or endorset by Endomondo, or any other party. This software available on the site is provided "as is" and any expressed or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. In no event shall the user under the pseudonym Kanekotic, or any of their contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.
