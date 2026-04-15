import express from "express";
import { protectroute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/", protectroute, getUsersForSidebar);
// also expose a /users alias so clients requesting /api/messages/users don't hit the dynamic :id route
messageRouter.get("/users", protectroute, getUsersForSidebar);
messageRouter.get("/:id", protectroute, getMessages);
messageRouter.put("mark/:id", protectroute, markMessageAsSeen);
messageRouter.post("/send/:id", protectroute, sendMessage)

export default messageRouter;