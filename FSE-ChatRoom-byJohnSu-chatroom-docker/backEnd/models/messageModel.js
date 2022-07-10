/**
 * Message: Single message data schema.
 * 1. sender: Refer to certain ObjectId in User document.
 * 2. username: The username of sender.
 * 3. message: The content of message.
 * 4. timestamps: Record the createAt and  updateAt timestamps.
 */
import mongoose from "mongoose";

const messageModel = mongoose.Schema(
    {
        // The sender of this message
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        username: {
            type: String,
            trim: true,
            require: true,
        },
        message: {
            type: String,
            trim: true,
            require: true,
        },
    },
    // The create time of the message
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageModel);
export default Message;
