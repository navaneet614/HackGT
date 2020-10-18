/*jshint multistr: true*/


$(document).ready(function () {

});




firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        firebase.firestore().collection('users').doc(user.uid).get().then(function (doc) {
            if (doc.exists) {
                $("#miles").text("Total Carbon Foodprint™: "+doc.data().milesscore+" lbs CO2");
                $("#nutri").text("Nutrition Score: "+doc.data().nutriscore+"/10");
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

    } else {
        window.location = "index.html"
    }
});
