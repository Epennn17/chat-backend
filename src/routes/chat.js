import { Router } from "express";
import { askAI } from "../services/aiClient.js";

const router = Router();
const MAX_LEN = 2000;

router.post("/chat", async (req, res, next) => {
  try {
    const { teks } = req.body ?? {};

    if (typeof teks !== "string" || teks.trim().length === 0) {
      return res.status(400).json({ error: "Field 'teks' wajib diisi" });
    }
    if (teks.length > MAX_LEN) {
      return res.status(400).json({
        error: `Pesan melebihi ${MAX_LEN} karakter`,
      });
    }

    const hasil = await askAI(teks.trim());
    res.json(hasil);
  } catch (err) {
    next(err);
  }
});

export default router;
