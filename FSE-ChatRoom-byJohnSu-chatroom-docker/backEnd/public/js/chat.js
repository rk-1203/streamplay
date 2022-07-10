import { getRequestSettings } from "./settings.js";

$(function () {
    // Initialize variables
    const BACKEND_HOST = "http://localhost:8080";
    const $window = $(window);
    const $chatInputForm = $(".chat-input-form");
    const $logOutButton = $(".chat-header-form");
    const $userMessageInput = $(".user-input-textarea");

    // Initialize User while landing.
    const userDataJSON = localStorage.getItem("userData");
    const userData = JSON.parse(userDataJSON);

    // Verify User and establish connection
    const userAuth = () => {
        const authRoute = "/api/user/verify";
        const settings = getRequestSettings({
            route: authRoute,
            user: userData,
            method: "POST",
        });
        $.ajax(settings)
            .done(function (res) {
                // Login Success.
            })
            .fail(function (res) {
                $window.attr("location", BACKEND_HOST + "/invalid.html");
            });
    };

    userAuth();
    const socket = io();
    socket.emit("login", userData.user.username);

    // Chat room page
    $chatInputForm.on("submit", function (event) {
        event.preventDefault();
        let userMsg = $userMessageInput.val().trim();
        socket.emit("new message", userMsg);
        $userMessageInput.val("");
    });

    // User Logout
    $logOutButton.on("submit", function (event) {
        event.preventDefault();
        // Verify User and establish connection
        const logoutRoute = "/api/user/logout";
        const settings = getRequestSettings({
            route: logoutRoute,
            user: userData,
            method: "POST",
        });
        $.ajax(settings)
            .done(function (res) {
                console.log("Logout Success.");
            })
            .fail(function (res) {
                console.log("Logout Failure.");
            });
        socket.disconnect();
        $window.attr("location", BACKEND_HOST);
    });

    // Client receive events
    socket.on("new message", (data) => {
        console.log(data);
        console.log(`Client receive ${data.username} : ${data.message}`);
        addNewMessage(data);
    });

    // Fetch all messages
    socket.on("fetch all messages", (data) => {
        if (data.length != 0) {
            data.forEach((message) => {
                console.log(message);
                addNewMessage(message);
            });
        }
    });

    // Add message to screen and scroll to the bottom
    const addNewMessage = (data) => {
        data.creatTime = new Date(data.createdAt).toLocaleString();
        const $username = $('<span class="text-bold">').text(data.username);
        const $timeSpan = $("<span>").text(data.creatTime);
        const $userInfoDiv = $('<div class="user-info">').append(
            $username,
            $timeSpan
        );
        const $messageContent = $('<div class="message-content">').text(
            data.message
        );
        const $message = $('<li class="message">').append(
            $userInfoDiv,
            $messageContent
        );
        const $messagesContainer = $(".messages-container");
        $messagesContainer.append($message);
        $messagesContainer[0].scrollTop = $messagesContainer[0].scrollHeight;
    };
});
