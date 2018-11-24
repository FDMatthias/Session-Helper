# Session-Helper

Session Helper is a module that helps you save a timestamp as an 'expiry time' to your local/session storage to be able to perform checks against it and to trigger callbacks when this expiry time has been reached.

[![npm version](https://badge.fury.io/js/session-helper.svg)](https://badge.fury.io/js/session-helper)

## Usage

### 0) Install

`npm install session-helper --save`

### 1) initialize the session helper with a unique id so that it does not conflict with others also using this package

``` javascript
// es6
import SessionHelper from 'session-helper'

export default new SessionHelper(
  "123-my-unique-id-here",    // uuid
  "localStorage",             // cache location: choose between 'localStorage' or 'sessionStorage'
  30,                         // timeout in minutes
  true,                       // debugMode, 'false' by default, enable it to push log messages to console
)
```

``` javascript
// es5
const SessionHelper = require('session-helper')

const sessionHelper = new SessionHelper(
  "123-my-unique-id-here",    // uuid
  "localStorage",             // cache location: choose between 'localStorage' or 'sessionStorage'
  30,                         // timeout in minutes
  true,                       // debugMode, 'false' by default, enable it to push log messages to console
)
```


### 2) use the following methods to manipulate your session/local storage

#### expiry

Function to get expiry from storage:
  `let expiryFromStorage = SessionHelper.expiry`

#### setExpiry

Function to set expiry from storage:
  `SessionHelper.setExpiry()`

#### removeExpiry

Function to remove expiry from storage:
  `SessionHelper.removeExpiry()`

#### isTokenExpired

Boolean to check if expiry in storage is set and is expired:
  `let isTokenExpired = SessionHelper.isTokenExpired`

#### isTokenExpiredOrNull

Boolean to check if expiry in storage is set and if it is expired, or if it is not even set:
  `let isTokenExpiredOrNull = SessionHelper.isTokenExpiredOrNull`
> _Important_: It can be null when, for example, there are two tabs (or more) open and the first tab has called `removeExpiry()` before the second. Then the expiry will be null in the second, meaning the Session Helper would interpret it as "it is not set" instead of "it is set **and expired**" because of the other tab. This might be useful when an expiry had to log out a user in the first tab and thus in the second there can be checked if the user is still logged in or not by checking the `isTokenExpiredOrNull` boolean.

#### expiryTimeout

Boolean to get the amount of time left in seconds until the expiry is reached (if the timer has started and the callback is set):
  `let timeLeftUntilExpiryIsReached = SessionHelper.expiryTimeout`

#### expiryTimeoutCallback

Variable to set a callback function which will trigger when the timeout function ends:

  ``` javascript
  SessionHelper.expiryTimeoutCallback = function() {
    console.log('Expiry has been reached')
    // perform actions like a logout
  }
  ```

To get the callback function which will be triggered at the end of the timeout function:
  `let callback = SessionHelper.expiryTimeoutCallback`
  > You can trigger this callback manually by adding extra parentheses like so: `SessionHelper.expiryTimeoutCallback()`

#### startExpiryTimeout

Function to start the timeout function, using the timeoutInMinutes configuration parameter:
  `SessionHelper.startExpiryTimeout()`

#### stopExpiryTimeout

Function to stop the timeout function:
  `SessionHelper.stopExpiryTimeout()`

#### resetExpiryTimeout

Function to restart the timeout function, using the timeoutInMinutes configuration parameter. Internally it's simply calling _.stopExpiryTimeout_ and _.startExpiryTimeout_:
  `SessionHelper.resetExpiryTimeout()`

## TODO

* add tests
* catch situations where the timeout is being started/reached but there is no callback set
* add pause functionality
* add functionality to poll the session/local storage and to trigger a callback based on the polled results instead of the timeout function
* add link(s) to blogpost(s)
* proposal: refactor the expiryTimeout to time in seconds instead of in minutes (something for v2)

## Contributing

PRs are more than welcome and will be reviewed asap!

## License

MIT - For full license see the [LICENSE](./LICENSE) file.
