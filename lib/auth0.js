var dotenv = require('dotenv');
dotenv.config();

var ManagementClient = require('auth0').ManagementClient;
var auth0 = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    scope: 'read:users update:users create:users delete:users'
});

// This function expects an object in the following format:
// {
//     'email' : "sample@google.com",
//     'password' : "password123",
//     'firstName' : "John",
//     'lastName' : "Doe",
//     'role' : "User" or "Admin"
// }
//
// Example:
// var auth0 = require('./lib/auth0.js');
// var newUser = {
//     email: "someone@nowhere.com",
//     password: "passWord123",
//     firstName: "John",
//     lastName: "Doe",
//     role: "User"
// };
// auth0.addLogin(newUser)
// .then( (userId) => {
//     console.log(userId);
// })
// .catch((error) => {
//     console.log(error);
// });
module.exports.addLogin = function addLogin(data) {
    var user = {
        email: data.email,
        password: data.password,
        given_name: data.firstName,
        family_name: data.lastName,
        verify_email: false,
        connection: "Username-Password-Authentication"
    };
    return auth0.createUser(user).then( (userData) => {
        return userData.user_id;
    })
    .catch( (error) => {
        console.log(error);
        return null;
    });
}

// This function expects an object in the following format:
// {
//     "id": "auth0|5d2a463eba4a7e0d2be7de40"
// }
module.exports.deleteLogin = function deleteLogin(data) {
    auth0.deleteUser(data, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
    });
}

// To be implemented later
module.exports.updateLogin = function updateLogin(data) {

}