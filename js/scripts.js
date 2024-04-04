$(document).ready(function() {
    "use strict";

    // CAROUSEL BANNER
    $(".carousel-sliders").owlCarousel({
        animateOut: 'fadeOut',
        animateIn: 'flipInX',
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        nav: true,
        dots: false,
        navContainer: '.banner .custom-nav',
        items: 1,
    });

    // CAROUSEL TESTIMONIALS
    $(".carousel-testimonials").owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        items: 1
    });

    // Toggle menu on scroll
    window.onscroll = function() {
        toggleMenu();
    };

    var navbar = document.getElementById("navbar");
    var sticky = navbar.offsetTop + navbar.offsetHeight;

    function toggleMenu() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("fixed");
        } else {
            navbar.classList.remove("fixed");
        }
    }

    // Initialize Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyAmjXcECcuxqZJJdOaWik8cwNXpsX8JKJw",
        authDomain: "kkc-builders.firebaseapp.com",
        projectId: "kkc-builders",
        storageBucket: "kkc-builders.appspot.com",
        messagingSenderId: "1009995906329",
        appId: "1:1009995906329:web:a00b98bb84ff99db4dd988",
	measurementId: "G-98FL0Q31S2"
    };
    firebase.initializeApp(firebaseConfig);

    // Signup function
    function signUpWithEmailPassword(email, password) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed up successfully
                var user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                // Handle errors
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorMessage);
            });
    }

    // Sign up button click event
    $("#signup-btn").click(function() {
        var email = $("#email").val();
        var password = $("#password").val();
        signUpWithEmailPassword(email, password);
    });

    // Firebase authentication state change listener
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log("User is signed in");
        } else {
            // User is signed out
            console.log("User is signed out");
        }
    });
});
