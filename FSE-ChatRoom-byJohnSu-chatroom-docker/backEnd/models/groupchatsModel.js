/**
 * groupChats: All group chats in the chatroom.
 * 1. users: a list contains all senders.
 * 2. latestMessage
 */

const mongoose = require("mongoose");

const groupChatsModel = mongoose.Schema(
    {
        // Record all users current in the chat room
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        // keep track of messages
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            },
        ],
    },
    {
        timestamps: true,
    }
);
export default groupChats = mongoose.model("groupChats", groupChatsModel);
