import { nanoid } from "nanoid";
import db from "../db/index.js";
import { urlsTable } from "../models/index.js";

export const createShortenUrl = async (code, url, id) => {
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode: code ?? nanoid(6),
      targetUrl: url,
      userId: id,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetUrl: urlsTable.targetUrl,
    });

  return result;
};
