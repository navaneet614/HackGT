/*jshint multistr: true*/

var items = [];
var prices = [0.99, 1.49, 1.69, 1.79, 1.99, 2.29, 2.39, 2.49, 2.59, 2.69, 2.79, 2.99, 3.19, 3.49, 3.69, 3.74, 3.79, 3.99];
var total = 0, ntotal=0, mtotal=0;
var fbuser;

$(document).ready(function () {

});

function emissions(data) {
    if (data.origin === "US") {
        return Math.round(data.distance * 0.36);
    } else {
        return Math.round(data.distance * 53);
    }
}

function randomPrice() {

    return prices[Math.floor(Math.random() * prices.length)];

}


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        fbuser = user;
        firebase.firestore().collection('users').doc(user.uid).get().then(function (doc) {
            if (doc.exists) {
                if(doc.data().cart == null) {
                    window.location = "shop.html";
                } else {
                    var length = doc.data().cart.length;
                }
                doc.data().cart.forEach(function (id) {
                    firebase.firestore().collection('groceries').doc(id).get().then(function (doc) {
                        var data = doc.data();
                        let price = randomPrice();
                        total+=price;
                        ntotal+=doc.data().nutritionScore;
                        mtotal+=emissions(data);
                        item = {
                            id: doc.id,
                            distance: data.distance,
                            imgLink: data.imgLink,
                            name: data.name,
                            nutritionScore: data.nutritionScore,
                            origin: data.origin,
                            price: price,
                            html: '<tr class="text-center">\
                                        <td class="product-remove"><a href="#" onclick="remove(\''+ doc.id + '\')"><span class="ion-ios-close"></span></a></td>\
                                        <td class="image-prod"><div class="img" style="background-image:url('+ data.imgLink + ');"></div></td>\
                                        <td class="product-name">\
                                            <h3>'+ data.name + '</h3>\
                                            <!-- <p>Far far away, behind the word mountains, far from the countries</p> -->\
                                        </td>\
                                        <td class="price">$'+ randomPrice() + '</td>\
                                        <td class="quantity">NutriScore™: '+ data.nutritionScore + '/10</td>\
                                        <td class="total">Emissions: '+ emissions(data) + ' lbs CO2</td>\
                                    </tr><!-- END TR-->'
                        };
                        items.push(item);
                        $("#table").append(item.html);
                        if(items.length === length){
                            total = Math.ceil(total * 100) / 100;
                            $("#subtotal").text("$"+total);
                            total = Math.ceil((total+3) * 100) / 100;
                            $("#total").text("$"+total);
                        }
                    }).catch(function (error) {
                        console.log("Error getting document:", error);
                    });
                });
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

function remove(id) {
    firebase.firestore().collection("users").doc(fbuser.uid).update({
        cart: firebase.firestore.FieldValue.arrayRemove(id)
    }).then(function () {
        //toggleLoader();
        location.reload();
    }).catch(function (error) {
        //toggleLoader();
        window.alert("Could not update. Error: " + error);
        location.reload();
    });
}

function checkout() {
    var nscore = 0;
    firebase.firestore().collection("users").doc(fbuser.uid).get().then(function (doc) {
        if(doc.exists){
            nscore = doc.data().nutriscore;
        } else {
            console.log("doesnt exist");
        }

    }).then(function () {
        var newscore = 0;
        ntotal/=items.length;
        if(nscore==0){
            newscore = ntotal;
        } else {
            newscore = (nscore + ntotal)/2;
        }
        firebase.firestore().collection("users").doc(fbuser.uid).update({
            nutriscore: newscore,
            milesscore: firebase.firestore.FieldValue.increment(mtotal),
            cart: firebase.firestore.FieldValue.delete()
        }).then(function () {
            //toggleLoader();
            window.location = "account.html";
        }).catch(function (error) {
            //toggleLoader();
            window.alert("Could not update. Error: " + error);
            location.reload();
        });

    }).catch(function(error) {

    });


    
}

