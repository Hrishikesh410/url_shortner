import express from "express";
import { shortenPostRequestBodySchema } from "../validation/request.validation.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { createShortenUrl } from "../services/url.service.js";
import db from "../db/index.js";
import { urlsTable } from "../models/url.model.js";
import { and, eq } from "drizzle-orm";
import { error } from "node:console";

const router = express.Router();

router.post("/shorten", ensureAuthenticated, async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { url, code } = validationResult.data;

  const result = await createShortenUrl(code, url, req.user?.id);

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetUrl: result.targetUrl,
  });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)));

  return res.status(200).json({ deleted: true });
});

router.get("/codes", ensureAuthenticated, async (req, res) => {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.id, req.user.id));
  return res.json({ codes });
});

router.get("/:shortCode", async (req, res) => {
  const code = req.params.shortCode;
  const [result] = await db
    .select({
      targetUrl: urlsTable.targetUrl,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res.status(404).json({
      error: "Invalid URL",
    });
  }

  return res.redirect(result.targetUrl);
});

export default router;
