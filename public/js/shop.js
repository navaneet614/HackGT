/*jshint multistr: true*/

var items = [];
var prices = [0.99, 1.49, 1.69, 1.79, 1.99, 2.29, 2.39, 2.49, 2.59, 2.69, 2.79, 2.99, 3.19, 3.49, 3.69, 3.74, 3.79, 3.99];

$(document).ready(function () {


    firebase.firestore().collection('groceries').get()
        .then(function (querySnapshot) {
            if (querySnapshot.length === 0) {

            } else {
                querySnapshot.docs.forEach(function (doc) {
                    var data = doc.data();
                    let price = randomPrice();
                    items.push({
                        id: doc.id,
                        distance: data.distance,
                        imgLink: data.imgLink,
                        name: data.name,
                        nutritionScore: data.nutritionScore,
                        origin: data.origin,
                        price: price,
                        html: '<div class="col-md-6 col-lg-3">\
                                    <div class="product">\
                                        <a href="#" class="img-prod"><img class="img-fluid" src="'+ data.imgLink + '" alt="Product Image">\
                                            <div class="overlay"></div>\
                                            <span class="status">'+ data.origin + '</span>\
                                        </a>\
                                        <div class="text py-3 pb-4 px-3 text-center">\
                                            <h3><a href="#">'+ data.name + '</a></h3>\
                                            <div class="d-flex">\
                                                <div class="pricing">\
                                                    <p class="price"><span>NutriScore™: '+ data.nutritionScore + '/10</span></p>\
                                                </div>\
                                            </div>\
                                            <div class="d-flex">\
                                                <div class="pricing">\
                                                    <p class="price"><span>Emissions: '+ emissions(data) + ' lbs CO2</span></p>\
                                                </div>\
                                            </div>\
                                            <div class="d-flex">\
                                                <div class="pricing">\
                                                    <p class="price"><span>$'+ price + '</span></p>\
                                                </div>\
                                            </div>\
                                            <div class="bottom-area d-flex px-3">\
                                                <div class="m-auto d-flex">\
                                                    <a href="#" onClick="cart(\''+ doc.id + '\')" class="buy-now d-flex justify-content-center align-items-center mx-1">\
                                                        <span><i class="ion-ios-cart"></i></span>\
                                                    </a>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>'
                    })
                });
                $("#search").on('input', function () {
                    updateList();
                });
                updateList();
            }
        });

});

function updateList() {
    $("#items").empty();
    var search = $("#search").val().toUpperCase();
    if (search === "") {
        items.forEach(function (item) {
            $("#items").append(item.html);
        })
    } else {
        var newList = [];
        items.forEach(function (item) {
            if (item.name.toUpperCase().indexOf(search) > -1) {
                let start = item.name.toUpperCase().indexOf(search);
                let newItem = Object.assign({}, item);
                let newName = item.name.substring(0, start) + "<b>" + item.name.substring(start, start + search.length) + "</b>" + item.name.substring(start + search.length);
                newItem.html = '<div class="col-md-6 col-lg-3">\
                                    <div class="product">\
                                        <a href="#" class="img-prod"><img class="img-fluid" src="'+ item.imgLink + '" alt="Product Image">\
                                            <div class="overlay"></div>\
                                            <span class="status">'+ item.origin + '</span>\
                                        </a>\
                                        <div class="text py-3 pb-4 px-3 text-center">\
                                            <h3><a href="#">'+ newName + '</a></h3>\
                                            <div class="d-flex">\
                                                <div class="pricing">\
                                                    <p class="price"><span>NutriScore™: '+ item.nutritionScore + '/10</span></p>\
                                                </div>\
                                            </div>\
                                            <div class="d-flex">\
                                                <div class="pricing">\
                                                    <p class="price"><span>Emissions: '+ emissions(item) + ' lbs CO2</span></p>\
                                                </div>\
                                            </div>\
                                            <div class="d-flex">\
                                                <div class="pricing">\
                                                    <p class="price"><span>$'+ item.price + '</span></p>\
                                                </div>\
                                            </div>\
                                            <div class="bottom-area d-flex px-3">\
                                                <div class="m-auto d-flex">\
                                                    <a href="#" onClick="cart(\''+ item.id + '\')" class="buy-now d-flex justify-content-center align-items-center mx-1">\
                                                        <span><i class="ion-ios-cart"></i></span>\
                                                    </a>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>'
                newList.push(newItem);
                newList.sort(function (a, b) {
                    return a.name.toUpperCase().indexOf(search) - b.name.toUpperCase().indexOf(search);
                });
            }
        });
        newList.forEach(function (item) {
            $("#items").append(item.html);
        })
    }
}

function emissions(data) {
    if(data.origin==="US"){
        return Math.round(data.distance * 0.36);
    } else {
        return Math.round(data.distance * 53);
    }
}

function randomPrice() {

    return prices[Math.floor(Math.random() * prices.length)];

}

var fbuser;
var loggedin = false;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        fbuser = user;
        loggedin = true
    } else {
        //toggleLoader();
    }
});

function cart(id) {
    if (loggedin) {
        // console.log(id);
        firebase.firestore().collection("users").doc(fbuser.uid).update({
            cart: firebase.firestore.FieldValue.arrayUnion(id)
        }).then(function () {
            //toggleLoader();
            alert("Added to cart!");
            location.reload();
        }).catch(function (error) {
            //toggleLoader();
            window.alert("Could not update. Error: " + error);
            location.reload();
        });
    } else {
        window.location = "login.html";
    }
}

