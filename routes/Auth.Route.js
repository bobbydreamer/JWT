const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const fs = require('fs');
const bcrypt = require('bcrypt');

const AuthController = require('../Controllers/Auth.Controller')

const {
    signAccessToken
    , signRefreshToken
    // , verifyRefreshToken,
  } = require('../helpers/jwt_helper')

// const AuthController = require('../Controllers/Auth.Controller')

//Functions
// Read file
const readFile = () => {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/users.json', 'utf8', (error, content) => {
        let data = {};
        if(error){
            data['content'] = {};
            data['error'] = error;
            reject(data);
        }        
        else{
            //If no data in file
            // console.log(Boolean(content));
            if(!content) content = {};
            
            data['content'] = content;
            data['error'] = "None";
            resolve(data);            
        }
      });
    })
};

const writeFile = (string) => {
    return new Promise((resolve, reject) => {
      fs.writeFile('./data/users.json', string.toString(), 'utf8', function(error) {
        if (error) {
            let data = {};
            data['error'] = error;
            reject(data);
        }
        else {
          console.log(`Updated File with '${string}'`);
          resolve(true);
        }
      });    
    });  
};

/*
const findData = (data, email, password) =>{
    return new Promise( async (resolve) => {

        let rd = data.hasOwnProperty(email) ? "FOUND" : "USER NOT FOUND";
        if(rd=="FOUND"){
            let hashedPassword = data[email];
            // console.log(password);
            // console.log(hashedPassword);
            let tf = await bcrypt.compare(password, hashedPassword);
            // console.log("tf = ",tf);
            if(tf) {
                // console.log('T')
                resolve("FOUND");
            }else{
                // console.log('F')
                resolve("PASSWORD NOT MATCH");
            }                    
        }
        resolve(rd);
    });
};
*/

const findUser = (data, email) =>{
    return new Promise( async (resolve) => {
        return resolve(data.hasOwnProperty(email) ? "FOUND" : "NOT FOUND");
    });
};

const validateUserPassword = (data, email, password) =>{
    return new Promise( async (resolve) => {

        let rd = data.hasOwnProperty(email) ? "FOUND" : "USER NOT FOUND";
        if(rd=="FOUND"){
            let hashedPassword = data[email];
            // console.log(password);
            // console.log(hashedPassword);
            let tf = await bcrypt.compare(password, hashedPassword);
            // console.log("tf = ",tf);
            if(tf) {
                // console.log('T')
                resolve("MATCHED");
            }else{
                // console.log('F')
                resolve("NOT MATCHED");
            }                    
        }
        resolve(rd);
    });
};


//Route
router.post('/register',async(req, res, next) =>{
    // console.log(req.body);
    // res.send('Register route');
    try{
        const {email, password} = req.body;
        if(!email || !password) throw createError.BadRequest()

        let data = await readFile();
        // console.log(data);
        //Just read the length of data in file to see if its empty or not
        if(Object.keys(data['content']).length > 0) 
            data = JSON.parse(data['content']);
        else data = data['content'];

        console.log(`Data=${JSON.stringify(data)}`);

        let temp = await findUser(data, email);
        // let temp = await findData(data, email, password);
        // console.log(temp);
        if(temp=="FOUND"){
            throw createError.Conflict(`${email} is already been registered`)
        }

        //Below is the "NOT FOUND" logic
        // data[email] = password; 

        //Encrypting Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        data[email] = hashedPassword;

        data = JSON.stringify(data)
        console.log(`Updated data=${data}`);
        temp = await writeFile(data);
        if(temp) console.log('Created user '+email);

        const accessToken = await signAccessToken(email);
        const refreshToken = await signRefreshToken(email)
        // res.status(200).send("Created user");
        res.status(200).send({ accessToken, refreshToken });

    }catch(error){
        console.log(`register-Catch : ${error}`);
        next(error);
    }
});

router.post('/login',async(req, res, next) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password) throw createError.BadRequest()

        let data = await readFile();
        // console.log(data);
        //Just read the length of data in file to see if its empty or not
        if(Object.keys(data['content']).length > 0) 
            data = JSON.parse(data['content']);
        else throw createError(400, "Please register");

        console.log(`All Data=${JSON.stringify(data)}`);

        let temp = await validateUserPassword(data, email, password);
        // console.log(temp);
        if(temp=="USER NOT FOUND"){
            throw createError.NotFound("Please register");
        }else if(temp=="NOT MATCHED"){
            // console.log(temp);
            throw createError.Unauthorized("username/password doesn't match");
            // res.status(400).send("Password doesn't match");
        }else if(temp=="MATCHED"){
            // console.log(temp);
            const accessToken = await signAccessToken(email)
            const refreshToken = await signRefreshToken(email)
      
            // res.status(200).send("A Successfully logged in");            
            res.status(200).send({ accessToken, refreshToken })
        }
    }catch(error){
        console.log(`login-Catch : ${error}`);
        next(error);
    }
});

// This /refresh-token is to be called from client when it gets a error message like 'jwt expired'
// From the client a request is sent with refreshToken

// router.post('/refresh-token',async(req, res, next) =>{
//     res.send('Refresh Token');
// });
//Testing using Controller folder
router.post('/refresh-token', AuthController.refreshToken)

router.delete('/logout',async(req, res, next) =>{
    res.status(204).send('Logging out');
});

module.exports = router