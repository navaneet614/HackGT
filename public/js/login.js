'use strict';

$(document).ready(function () {
	// $("#signup").css("display", "none !important");
	// console.log("here");
	// $(".modal").modal();
});

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		// User is signed in.
		if (justSignedUp) {
			fillDoc(user);
		} else {
			window.location.href = "/index.html";
		}
	} else {
		//toggleLoader();
	}
});

var userEmail, userPass, name;

function login() {
	userEmail = document.getElementById("email").value;
	userPass = document.getElementById("password").value;

	if (userEmail === "" || userPass === "") {
		alert("Please fill all of the fields before submitting.");
	} else {
		
		firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			
			////toggleLoader();
			alert("Error : " + errorMessage);
			

		});
	}
}

function signUp() {
	name = document.getElementById("name").value;
	userEmail = document.getElementById("email").value;
	userPass = document.getElementById("password").value;


	createUser();
}

var justSignedUp = false;

function createUser() {
	firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
		.catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode == 'auth/weak-password') {
				alert('The password is too weak.');
			} else {
				alert(errorMessage);
			}
			console.log(error);
			//toggleLoader();
		}).then(function (userCredentials) {
			justSignedUp = true;
		});
}

function fillDoc(user) {
	if (user == null) {

		setTimeout(function () { //waiting for createUser firebase function to run and create doc
			fillDoc(user);
		}, 500);

	} else {
		firebase.firestore().collection("users").doc(user.uid).get().then(function (doc) {
			if (doc.exists) {
				firebase.firestore().collection("users").doc(user.uid).update({
					email: userEmail,
					name: name,
				}).then(function () {
					//toggleLoader();
					window.location.href = "/index.html";
				}).catch(function (error) {
					//toggleLoader();
					window.alert("Could not update. Error: " + error);
					location.reload();
				});
			} else {
				console.log("No such document!");
				setTimeout(function () {
					fillDoc(user);
				}, 500);
			}
		}).catch(function (error) {
			console.log("Error getting document:", error);
		});
	}
}

function forgotPassword() {
	//toggleLoader();
	firebase.auth().sendPasswordResetEmail(document.getElementById("forgotpassemail").value).then(function () {
		M.toast({
			html: "Email has been sent."
		});
		document.getElementById("forgotpassemail").value = "";
	}).catch(function (error) {
		M.toast({
			html: "There is no account associated with that email."
		});
		console.log("Error getting document:", error);
	});
	//toggleLoader();
}

// function showLogin() {
// 	$("#login").show();
// 	$("#signup").hide();
// }

// function showSignUp() {
// 	$("#login").hide();
// 	$("#signup").show();
// }