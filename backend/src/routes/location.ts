import { Router } from "express";
import { getLocationFromIP } from "../services/locationService.js";

const router = Router();

router.get("/location", async (req, res) => {
  try {
    const location = await getLocationFromIP();
    return res.json(location);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unable to resolve IP location";
    return res.status(500).json({ error: errorMessage });
  }
});

export default router;
