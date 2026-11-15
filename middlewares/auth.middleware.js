function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next();

  if (!authHeader.startsWith("Bearer"))
    return res.status(400).json({
      error: "Authorization header must start with bearer",
    });

  const [_, token] = authHeader.split(" ");
  return token;
}
