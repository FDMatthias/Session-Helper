# Session-Helper

Session helper is a module that helps you save a timestamp as an 'expiry time' to your local/session storage, to be able to perform checks against it, and to trigger callbacks when this expiry time has been reached.

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
var SessionHelper = require('session-helper')

var sessionHelper = new SessionHelper(
  "123-my-unique-id-here",    // uuid
  "localStorage",             // cache location: choose between 'localStorage' or 'sessionStorage'
  30,                         // timeout in minutes
  true,                       // debugMode, 'false' by default, enable it to push log messages to console
)
```


### 2) use the following methods to manipulate your session/local storage

#### expiry

To get expiry from storage:
  `var expiryFromStorage = SessionHelper.expiry`

#### setExpiry

To set expiry from storage:
  `SessionHelper.setExpiry()`

#### removeExpiry

To remove expiry from storage:
  `SessionHelper.removeExpiry()`

#### isTokenExpired

To check if expiry in storage is set and is expired:
  `var isTokenExpired = SessionHelper.isTokenExpired`

#### isTokenExpiredOrNull

To check if expiry in storage is set and is expired, or if it is not set:
  `var isTokenExpiredOrNull = SessionHelper.isTokenExpiredOrNull`
> It can be null when, for example, there are multiple tabs open and one of the tabs has called 'removeExpiry' before the other. Then the expiry is null in the other, while you still want it to be interpreted as 'expired'.

#### expiryTimeout

To get the amount of time left in seconds until the expiry is reached (if the timer has started and the callback is set):
  `var timeLeftUntilExpiryIsReached = SessionHelper.expiryTimeout`

#### expiryTimeoutCallback

To set a callback function which will trigger when the timeout function ends:

  ``` javascript
  SessionHelper.expiryTimeoutCallback = function() {
    console.log('Expiry has been reached')
    // perform actions like a logout
  }
  ```

To get the callback function which will be triggered at the end of the timeout function:
  `var callback = SessionHelper.expiryTimeoutCallback`
  > You can trigger this callback manually by adding extra parentheses like so: `SessionHelper.expiryTimeoutCallback()`

#### startExpiryTimeout

To start the timeout function, using the timeoutInMinutes configuration parameter:
  `SessionHelper.startExpiryTimeout()`

#### stopExpiryTimeout

To stop the timeout function:
  `SessionHelper.stopExpiryTimeout()`

#### resetExpiryTimeout

To restart the timeout function, using the timeoutInMinutes configuration parameter. Underlying it's simply calling _.stopExpiryTimeout_ and _.startExpiryTimeout_:
  `SessionHelper.resetExpiryTimeout()`

## TODO

* add tests
* catch situations where the timeout is being started but there is no callback set
* add pause functionality
* add functionality to poll the session/local storage, and trigger a callback based on the polled results instead of the timeout function
* add link(s) to blogpost(s)

## Contributing

PRs are more than welcome and will be reviewed asap!

## License

MIT - For full license see the [LICENSE](./LICENSE) file.
