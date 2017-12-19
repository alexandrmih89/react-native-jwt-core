### Installation

```
react-native init exampleProject
cd examleProject
git clone git@github.com:alvelig/react-native-jwt-core.git src/core && src/core/install.sh
```

Configure `react-native-config` https://github.com/luggit/react-native-config#extra-step-for-ios-to-support-infoplist

Enjoy ReactNative app

### Usage

Disclaimer: 
> We are encouraging you to use modular structure (ORGANIZE BY FEATURE). See https://jaysoo.ca/2016/02/28/organizing-redux-application/  
Also it's welcome to understand how [`redux-saga`](http://redux-saga.js.org/docs/introduction/BeginnerTutorial.html) works, as we are using it extensively.
This lib also uses ReactNavigation connected to Redux store.

First define your `routes/navigators.js`:

```javascript
//import ReactNavigation Stacks:
import { StackNavigator, TabNavigator } from 'react-navigation';

//Define your Login Screen (We'll change it later)
const LoginScreen = () => <View><Text>LoginScreen</Text></View>;

//Define your NotAuthenticated stack:
export const NotAuthenticatedNavigator = StackNavigator({
  Login: {
    screen: LoginScreen
  },
});

//Let's define an example Profile (Authenticated view)
const ProfileScreen = () => <View><Text>ProfileScreen</Text></View>;

//Define your Authenticated stack;
export const AuthenticatedNavigator = TabNavigator({
  Login: {
    screen: ProfileScreen
  },
});
```

Run and it should give you the LoginScreen.


So, let's start a new module. For example, Login.

Let's start with `modules/Login/LoginActions.js`:
```javascript
import { createRoutine } from '../../core/redux-saga-api-call-routines';

const ENTITY = 'LOGIN_FORM';

const LoginFormRoutine = createRoutine(ENTITY);

export default LoginFormRoutine;
```

Ok. Then, let's add `modules/Login/LoginSagas.js`:

```javascript
import { put, take } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import LoginFormRoutine from './LoginActions';
import { ApiCall } from '../../core/redux-saga-api-call-routines';

//Our Nav login action
import { login } from '../../core/redux-saga-auth';

//This is to validate your form if you use redux-form
/***
 * Validate your form here
 ***/
const isValid = (form) => {

  return true;
};

//Here we define error strings returned for fields that did not validate. 
/*** Return errors for your form
 * { [field]: string }
 */
const getFormErrors = (form) => {
  return {};
};

export default function* formSubmitWatcher() {
  /***
   * don't take any actions until the flow is complete
   * if another LoginFormRoutine.TRIGGER is dispatched, it will not be taken, and will not affect our flow
   * this is done intentionally to avoid double click and other side effects
   */
  while(true) {
    const { payload } = yield take(LoginFormRoutine.TRIGGER);
    const { values } = payload || {};

    if (!isValid(payload)) {

      const errors = getFormErrors(payload);
      yield put(LoginFormRoutine.failure(new SubmissionError(errors)));

    } else {

      const { username, password } = values;

      const opts = {
        url: 'signin',
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      };

      //Magically works making request to the api
      const { response, error } = yield* ApiCall(LoginFormRoutine, opts);

      if(response) {
        /*** resolve the routine promise ***/
        yield put(LoginFormRoutine.success(response.json));
        /*** and tell AuthSaga that you are in ***/
        const { accessToken, refreshToken, user } = response.json;
        yield put(login({
          user,
          accessToken,
          refreshToken
        }));
      } else {

        const _error = error.json && error.json.message ? error.json.message : "Error desconocido";

        yield put(LoginFormRoutine.failure(new SubmissionError({ _error })));
      }
    }

    /*** trigger fulfill action to end routine lifecycle ***/
    yield put(LoginFormRoutine.fulfill());
  }
}
```

Configure `.env`, change BASE_URL for your API.

So, let's merge it all in `modules/Login/LoginForm.js`:

```javascript
import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Button,
  TextInput
} from 'react-native';
import { reduxForm, Field } from 'redux-form';

//Our Nav action creator to go to another screen 
import { goTo } from '../../core/modules/Nav/NavActions';
import LoginFormRoutine from './LoginActions';

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  goTo
};

const renderTextField = ({ input, label, meta: { touched, error }, ...props }) => (
  <TextInput
    {...input}
    {...props}
  />
);

class LoginForm extends React.Component {

  render() {

    const { handleSubmit, goTo, error, submitting } = this.props;

    return (
      <View>

        <Field
          name="username"
          placeholder="Email"
          keyboardType="email-address"
          component={renderTextField} />

        <Field
          name="password"
          secureTextEntry
          placeholder="Contraseña"
          component={renderTextField}
        />
        
        <Button onPress={handleSubmit(LoginFormRoutine)} title="Login" />

      </View>
    );
  }
}

LoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm);

LoginForm = reduxForm({
  form: 'LoginForm'
})(LoginForm);

export default LoginForm;
```

Now let's change a little our LoginScreen in `routes/navigators.js`:
```javascript
import LoginForm from '../modules/Login/LoginForm';

const LoginScreen = () => ( 
  <View>
    <Text>LoginScreen</Text>
    <LoginForm />
  </View>
);
```

The only thing left would be to edit `modules/sagas.js`:

```javascript
import LoginFormSaga from '../modules/Login/LoginSagas.js'
const appSagas = [
  LoginFormSaga
];
export default appSagas;
```


Now imagine we need to have a button to create an account. Let's edit our `routes/navigators.js`:

```javascript
const RegisterScreen = () => <View><Text>Register</Text></View>;

//Define your NotAuthenticated stack:
export const NotAuthenticatedNavigator = StackNavigator({
  Login: {
    screen: LoginScreen
  },
  Register: {
    screen: RegisterScreen
  },
});
```

Then we will add a Register button to our `LoginForm.js` (this can be done in any connected or with access to `dispatch` component):

```javascript
//add this within render method  
<Button onPress={this.props.goTo("Register")} title="Sign up" />
```

goTo accepts String or object with typical [Navigation params](https://reactnavigation.org/docs/navigators/navigation-actions#Navigate)


If we want to return from RegisterScreen to LoginScreen we need to `import { goBack } from '../../core/modules/Nav/NavActions';` and then just `dispatch(goBack())` in a Button.

ReactNavigation Reset action is also available: `import { resetTo } from '../../core/modules/Nav/NavActions';`


Ok, LoginSaga seems a little bit complicated. Here's an example of simple saga (Kind of redux-thunk simplest case):

```javascript
import { put, takeEvery } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';
import MainMapRoutine from './MainMapActions';
import { ApiCall } from '../../core/redux-saga-api-call-routines';


function* getStoresOnMainMap({ payload }) {

  // auth: true means we will use JWT for this request
  const opts = {
    auth: true,
    url: 'stores'
  };

  const { response, error } = yield* ApiCall(MainMapRoutine, opts);

  if(response) {
    yield put(MainMapRoutine.success(response.json));
  } else {

    const _error = error.json && error.json.message ? error.json.message : "Error desconocido";

    yield put(MainMapRoutine.failure(new SubmissionError({_error})));
  }

  yield put(MainMapRoutine.fulfill());
}

export default function* registerWatcherSaga() {
  yield takeEvery(MainMapRoutine.TRIGGER, getStoresOnMainMap);
}
```

### Action creators

core/modules/Nav/NavActions exposes the following actionCreators (See NavReducers.js):

| Action creator  | Description  | Arguments  |
|---|---|---|
| goTo  | pushes a new screen in a Stack | Screen name (String) or [Navigation params](https://reactnavigation.org/docs/navigators/navigation-actions#Navigate) |
| goBack | pops current screen from the Stack o restores last navigator state | - |
| resetTo | resets current stack to the provided screen | Screen name (String) or [Navigation params](https://reactnavigation.org/docs/navigators/navigation-actions#Navigate) |
| setParams | sets params for current screen | Navigation params object |
|---|---|---|
| login | Login action creator - sets Navigator state to authenticated (Changes the stack from NotAuthenticated to Authenticated). | { user, accessToken, refreshToken }|
| register| Register action creator - sets Navigator state to authenticated (Changes the stack from NotAuthenticated to Authenticated). | { user, accessToken, refreshToken }|
| logout | Logout action creator - sets Navigator state to not authenticated (Changes the stack from Authenticated to NotAuthenticated). | - |


### ApiCall

`import { ApiCall } from '../../core/redux-saga-api-call-routines';`

ApiCall translates your Routine to a request. Options (pretty the same as for `fetch`):

| Option |||
|---|---|---|
| auth | If use or not JWT authentication | |
| url | Api url | |
| body | Request Body| |
| headers | Request Headers | |