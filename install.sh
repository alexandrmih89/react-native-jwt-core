#!/usr/bin/env bash


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd ${DIR}

if [ ! -d "./redux-saga-auth" ]; then
  git clone https://github.com/alvelig/redux-saga-auth.git
fi

if [ ! -d "./redux-saga-api-call-routines" ]; then
  git clone https://github.com/alvelig/redux-saga-api-call-routines.git
fi

cd ${DIR}/../..

cd src
echo "import './core';" > index.js

mkdir modules
cd modules
echo "const reducers = {};" > reducers.js
echo "export default reducers;" >> reducers.js
echo "const appSagas = [];" > sagas.js
echo "export default appSagas;" >> sagas.js

cd ${DIR}/../..

npm i -S lodash react-native-config react-navigation react-redux redux redux-actions redux-form redux-saga redux-saga-routines styled-components

npm i -D remote-redux-devtools

npm i npm-add-script
node_modules/npm-add-script/cmd.js -k ios -v "react-native run-ios --simulator='iPhone SE'" -f
node_modules/npm-add-script/cmd.js -k android -v "react-native run-android" -f
node_modules/npm-add-script/cmd.js -k bundle -v "react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/" -f

echo "BASE_URL=http://localhost:3000/api/v1/" > .env.development
echo "BASE_URL=http://localhost:3000/api/v1/" > .env.test
echo "BASE_URL=http://{PUT_YOUR_API_URL_HERE}:3000/api/v1/" > .env.production

react-native link