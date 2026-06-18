import { Router } from "express";
import { runAgent } from "../agent.js";
import { validateChatRequest } from "../services/chatService.js";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const chatRequest = validateChatRequest(req.body);
    const result = await runAgent(chatRequest.message, chatRequest.conversationHistory);
    return res.json({ message: result.content });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return res.status(400).json({ error: errorMessage });
  }
});

export default router;
