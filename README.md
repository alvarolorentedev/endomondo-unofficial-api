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

The result of the promise will be if failed the error that caused it and if success an result object similar to this:

```

```

## Disclaimer

This is not affiliated or endorset by Endomondo, or any other party. If you are copying this for a commercial project, be aware that it might be so that clean room implementation rules aren't fully complied with.

### Logo 

Sport graphic by <a href="http://www.flaticon.com/authors/webalys">Webalys</a> from <a href="http://www.flaticon.com/">Flaticon</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made with <a href="http://logomakr.com" title="Logo Maker">Logo Maker</a>