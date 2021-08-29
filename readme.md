# JWT Learning Notes

### Start
```sh
npm start
```

### VS Code Development Shortcuts 

* Press `Ctrl+Alt+R` - View output from REST Client in VSCode 
* Press `Shift+Alt+F` - Prettify to view JSON

### Access token & Refresh Token

Rerun only when you think your tokens are comprimised. 
```
D:\BigData\14.Nodejs\16.JWT\helpers>node generate-token.js
┌─────────┬────────────────────────────────────────────────────────────────────┐
│ (index) │                               Values                               │
├─────────┼────────────────────────────────────────────────────────────────────┤
│  key1   │ 'b6a83205e31fe6546d7cf2dae4ca8a679414ee1487c6ba9ae2286de0427a9c7b' │
│  key2   │ '4885e8fdcb183ae40819e940dfb5651b3781190f018ead5e01d85afa11a5c6fd' │
└─────────┴────────────────────────────────────────────────────────────────────┘
```
Update the tokens accordingly in .env file. 

### Testing execution flow

Check the REST.http file which contains all the testing codes which can be tested from VSCode using REST client. 

1. Open a empty Notepad 

1. First try to go directly to `http://localhost:3000/` route, the one that doesn't have the authorization - You will get an error `Unauthorized`

1. Click the Register route. You will get back accessToken and Refresh Token. Copy them both to notepad and recopy only the accessToken from NotePad or REST Client output windows in VSCode

1. Update accessToken in the `http://localhost:3000/` with Authorization and try SEND REQUEST. You should do all this in 15 seconds otherwise JWT will be expired. To increase the expiry timing update `jwt_helper.js` It should work. 

1. Wait for 10 seconds and Try again. You should get `jwt expired`

1. Now copy the refresh token from Notepad (or) try running the login route. It should return the refreshToken, copy it and wait for few seconds. JWT should expire. 

1. Paste the refresh token in the body of the Refresh Token route `http://localhost:3000/auth/refresh-token` and SEND REQUEST, it should generate a new accessToken. 


### Overall learnings from this JWT exercise
* JWT
* Controller  

  All the functionalities shouldn't be in the route folder. It should be in the Controller folder. 
* bcrypt 
* NodeJS Error Handling
* REST Client in VSCode