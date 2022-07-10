import { getRequestSettings } from "./settings.js";

$(function () {
    // Initialize variables
    const BACKEND_HOST = "http://localhost:8080";
    const $window = $(window);
    const $loginForm = $(".login-form");
    const $registerForm = $(".register-form");
    const $username = $(".usernameInput");
    const $password = $(".passwordInput");
    const $confirmPassword = $(".confirmPasswordInput");

    // Submit login form
    $loginForm.on("submit", function (event) {
        event.preventDefault();
        if (checkInputs()) {
            userLogin();
        }
    });
    // Submit register form
    $registerForm.on("submit", function (event) {
        event.preventDefault();
        if (checkInputs()) {
            userRegister();
        }
    });

    // Request to server for user login
    const userLogin = () => {
        let loginRoute = "/api/user/login";
        let userInput = getUserInput();
        const settings = getRequestSettings({
            route: loginRoute,
            data: userInput,
            method: "POST",
        });
        $.ajax(settings)
            .done(function (res) {
                setSuccessFor($username);
                setSuccessFor($password, "Login Successfully.");
                setTimeout(() => {
                    $window.attr("location", BACKEND_HOST + "/chat.html");
                }, "500");
                console.log(res);
                const userData = res;
                const userDataJSON = JSON.stringify(userData);
                localStorage.setItem("userData", userDataJSON);
            })
            .fail(function (res) {
                if (res.status == 401) {
                    setErrorFor($username, res.responseJSON.error);
                    setErrorFor($password, res.responseJSON.error);
                }
            });
    };

    // Request to server for new user registration
    function userRegister() {
        let registerRoute = "/api/user/register";
        let userInput = getUserInput();
        const settings = getRequestSettings({
            route: registerRoute,
            data: userInput,
            method: "POST",
        });
        $.ajax(settings)
            .done(function (res) {
                setSuccessFor($username);
                setSuccessFor($password);
                setSuccessFor($confirmPassword, "Register Successfully.");
                setTimeout(() => {
                    $(window).attr("location", BACKEND_HOST);
                }, "500");
            })
            .fail(function (res) {
                if (res.status == 400) {
                    setErrorFor($username);
                    setErrorFor($password);
                    setErrorFor($confirmPassword, res.responseJSON.error);
                }
            });
    }
    // Get user input from form
    function getUserInput() {
        let usernameInput = $username.val().trim();
        let passwordInput = $password.val().trim();
        let userInput;
        if (usernameInput && passwordInput) {
            userInput = {
                username: usernameInput,
                password: passwordInput,
            };
        }
        return userInput;
    }

    // Check user input
    function checkInputs() {
        const usernameVal = $username.val().trim();
        const passwordVal = $password.val().trim();

        if (!usernameVal || !passwordVal) {
            setErrorFor($username);
            setErrorFor($password, "Username or passwords can not be blank.");
            return false;
        }

        if ($confirmPassword.val()) {
            const confirmPassword = $confirmPassword.val().trim();
            if (confirmPassword === "") {
                setErrorFor($password, "Confirm passwords can not be blank.");
                return false;
            } else if (confirmPassword != passwordVal) {
                setErrorFor($confirmPassword, "Passwords does not match.");
                return false;
            }
        }
        return true;
    }

    // Input box alert.
    function setErrorFor(input, message = "") {
        const formControl = input.parent();
        const small = formControl.find("small");
        formControl.addClass("form-control error");
        small.text(message);
    }
    function setSuccessFor(input, message = "") {
        const formControl = input.parent();
        formControl.removeClass("error");
        formControl.addClass("form-control success");
        const small = formControl.find("small");
        small.text(message);
    }
});
