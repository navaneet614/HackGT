const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();

exports.createUser = functions.auth.user().onCreate((user, context) => {
    documentRef = firestore.collection('users').doc(user.uid);
    console.log("creating user: " + JSON.stringify(user));
    return documentRef.create({email: "", name: "", nutriscore: 0, milesscore: 0});
});

exports.deleteUser = functions.auth.user().onDelete((user, context) => {
    console.log("deleting user: " + JSON.stringify(user));
    return firestore.collection('users').doc(user.uid).delete();
});
