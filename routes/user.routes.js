import express from "express";
import db from "../db/index.js";
import { userTable } from "../models/user.model.js";
import { signupPostRequestBodySchema } from "../validation/request.validation.js";
import { getHashedPasswordWithSalt } from "../utils/hash.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  const validationResult =
    await signupPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
      return res.status(400).json({
        error: validationResult.error.format()
      })
    }

    const {firstname, lastname,email, password} = validationResult.data

 

  if (exitingUser)
    return res
      .status(400)
      .json({ error: `User with emai ${email} already exists` });

  const {salt, hashedPassword} = getHashedPasswordWithSalt(password)

  const user = await db
    .insert(userTable)
    .values({
      email,
      firstname,
      lastname,
      password: hashedPassword,
      salt: salt
    })
    .returning({ id: userTable.id });

  return res.status(201).json({ data: { userId: user } });
});

export default router;
