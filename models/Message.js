import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
