import express from "express";
import { signupPostRequestBodySchema } from "../validation/request.validation.js";
import { getHashedPasswordWithSalt } from "../utils/hash.js";
import { createUser, getUserByEmail } from "../services/user.service.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
    });
  }

  const { firstname, lastname, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser)
    return res
      .status(400)
      .json({ error: `User with email ${email} already exists` });

  const { salt, hashedPassword } = getHashedPasswordWithSalt(password);

  const user = await createUser(
    email,
    firstname,
    lastname,
    hashedPassword,
    salt,
  );

  return res.status(201).json({ data: { userId: user } });
});

export default router;
