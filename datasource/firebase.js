const { initializeApp } = require('firebase/app');
const {getDatabase} = require('firebase/database')

initializeApp({
    apiKey: "api-key",
    authDomain: "#projectId#.firebaseapp.com",
    databaseURL: "#url#",
    projectId: "#projectId#",
    storageBucket: "#projectId#.appspot.com",
})
module.exports.frdb = getDatabase()