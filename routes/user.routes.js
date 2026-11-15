import express from "express";
import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
} from "../validation/request.validation.js";
import { getHashedPasswordWithSalt } from "../utils/hash.js";
import { createUser, getUserByEmail } from "../services/user.service.js";
import { createToken } from "../utils/token.js";
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

router.post("/login", async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
    });
  }

  const { email, password } = validationResult.data;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({
      error: `User with this email ${email} does not exists`,
    });
  }
  const { hashedPassword } = getHashedPasswordWithSalt(password, user.salt);
  if (user.password !== hashedPassword) {
    return res.status(400).json({
      error: "Invalid Password",
    });
  }

  const token = await createToken({ id: user.id });
  return res.json({
    token,
  });
});
export default router;
