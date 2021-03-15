## Running the project

### Prerequisites

- Yarn (`brew install yarn`)
- Cocoapods (`brew install cocoapods`)
- jq (`brew install jq`) (optional)
- Xcode (from the App Store)

```sh
# clone the project
git clone git@github.com:SwiftCTRL/sdk-expo-example.git
cd sdk-expo-example

# install JavaScript and native dependencies
yarn install
npx pod-install # (replaces `pod install` in React Native)

# launch the iOS simulator
# native code needs to be rebuilt after modifications, so you will need to re-run this on changes.
yarn ios
```

> **Troubleshooting tip:** if you encounter `SDK "iphoneos" cannot be located`, it might be a sign that your Xcode was installed from the command line. You can fix this by running: `sudo xcode-select --switch /Applications/Xcode.app`.

## Dependencies

Other than the basic React Native scaffolding and the SDK, this project uses two libraries:

- [qrcode](https://www.npmjs.com/package/qrcode): to convert the byte array to an SVG (400k+ weekly downloads)
- [react-native-svg](https://www.npmjs.com/package/react-native-svg): to display the SVG (300k+ weekly downloads)

## Getting a `userToken`

To get the project running, you will first need to set the `userToken` in `App.tsx`.

To obtain a `userToken`:

```sh
# 1) get a system refresh token
REFRESH_JWT=$(curl -D /dev/stderr https://api.sandbox.swiftctrl.com/auth/system-access-token \
  -H 'Content-type: application/json' --data-binary @- << EOF | jq -r .refresh_token
{
  "license": "<add_your_licence>",
  "secret": "<add_your_secret>"
}
EOF
)

printf "Refresh JWT:\n%s\n" $REFRESH_JWT
```

```sh
# 2) you can now use the refresh token to obtain a user token
USER_JWT=$(curl -D /dev/stderr https://api.sandbox.swiftctrl.com/auth/user-access-token \
  -H 'Content-type: application/json' \
  -H "Authorization: Bearer ${REFRESH_JWT}" \
--data-binary @- << EOF | jq -r .
{
  "client_user_id": "<add_a_valid_user_email>"
}
EOF
)

printf "User JWT:\n%s\n" $USER_JWT
```

## Debugging

Once your project is running, press `CMD` + `D` in the emulator, and enable "Debug mode".

This should open up a new Chrome tab for the debugger (if it doesn't open: http://localhost:8081/debugger-ui/).

You can now open the Chrome Console and see the JavaScript **and** Native logs.
