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

### Error codes

There are 3 types of error codes 
* TokenExpiredError
  - Has only one message - 'jwt expired'
* JsonWebTokenError
  - This has multiple messages and giving out these messages as error might be a security hole. So we will just mention it as 'Unauthorized'
    + 'jwt malformed'
    + 'jwt signature is required'
    + 'invalid signature'
    + 'jwt audience invalid. expected: [OPTIONS AUDIENCE]'
    + 'jwt issuer invalid. expected: [OPTIONS ISSUER]'
    + 'jwt id invalid. expected: [OPTIONS JWT ID]'
    + 'jwt subject invalid. expected: [OPTIONS SUBJECT]'
* NotBeforeError
  - Has only one message - 'jwt not active'

  ### Controller
  All the functionalities shouldn't be in the route folder. It should be in the Controller folder. 