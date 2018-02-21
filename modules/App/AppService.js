import _ from 'lodash';
import invariant from 'fbjs/lib/invariant';
import { AsyncStorage } from 'react-native';
import Config from 'react-native-config';

const dataKey = '@TokenData';

const accessTokenKey = `${dataKey}:accessToken`;
const refreshTokenKey = `${dataKey}:refreshToken`;
const userKey = `${dataKey}:user`;

export const restoreTokens = () => {

  return Promise.all([
    AsyncStorage.getItem(accessTokenKey),
    AsyncStorage.getItem(refreshTokenKey),
    AsyncStorage.getItem(userKey)
      .then(JSON.parse)
      .catch((error) => {
        console.log( 'restoreUserData error. Probably malformed data.', error);
        return null;
      })
  ])
    .then(data => ({ accessToken: data[0], refreshToken: data[1], user: data[2] }))
    .catch((error) => {
      console.log(`restore ${dataKey} error.`, error);
      return null;
    });
};

export const saveTokens = ({ accessToken, refreshToken, user }) => {
  invariant(accessToken, "Save tokens: Access token must be present");
  invariant(refreshToken, "Save tokens: Refresh token must be present");
  return Promise.all(
    AsyncStorage.setItem(accessTokenKey, accessToken),
    AsyncStorage.setItem(refreshTokenKey, refreshToken),
    AsyncStorage.setItem(userKey, JSON.stringify(user))
  );
};

export const updateAccessToken = ({ accessToken }) => {
  invariant(accessToken, "Update tokens: Access token must be present");
  return AsyncStorage.setItem(accessTokenKey, accessToken);
};

export const resetTokens = () => {
  return Promise.all([
    AsyncStorage.removeItem(accessTokenKey),
    AsyncStorage.removeItem(refreshTokenKey),
    AsyncStorage.removeItem(userKey),
  ]);
};

const baseUrl = Config.BASE_URL;

const OPTS = {
  headers: {
    "Content-Type": "application/json"
  }
};

const getJsonResponse = (r) => {
  return ({
    headers: r.headers,
    ok: r.ok,
    redirected: r.redirected,
    status: r.status,
    statusText: r.statusText,
    type: r.type,
    url: r.url
  });
};

function urlEncode(obj) {
  const str = [];
  for(let p in obj) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  }
  return str.join("&");
}

export const fetchApi = ({ url, ...options }, token) => {
  console.log(options, token);

  if(!options) {
    options = {};
  }

  if(!options.headers) {
    options.headers = {
      "Content-Type": "application/json"
    };
  }

  if(_.isObject(options.body)) {
    if(_.startsWith(options.headers["Content-Type"], "application/json")) {
      options.body = JSON.stringify(options.body);
    }
    if(_.startsWith(options.headers["Content-Type"], "application/x-www-form-urlencoded")) {
      options.body = urlEncode(options.body);
    }
  }

  options.headers = new Headers({
    ...options.headers,
  });

  if(token) {
    options.headers.set('Authorization', 'Bearer ' + token);
  }

  return fetch(baseUrl + url, { ...OPTS, ...options })
    .then(response => {
      return response.json()
        .then(json => ({
          ...getJsonResponse(response),
          json
        }));
    });
};

export const refreshAccessToken = (refreshToken) => {
  return fetch(baseUrl + 'refresh', {
    method: 'GET',
    headers: new Headers({
      Authorization: 'Bearer ' + refreshToken
    })
  })
    .then(response => response.json().then(json => json.accessToken));
};