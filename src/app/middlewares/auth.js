const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // const token = req.cookies["myToken"];
  const authInfo = req.headers["authorization"];
  if (authInfo) {
    const token = authInfo.split(" ")[1];

    const secretKey = process.env.SECRET_KEY || "jwt-test";

    if (!token) return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");

    try {
      const payload = jwt.verify(token, secretKey);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send({ message: "Invalid Token" });
    }
  }
  else {
    return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send({ message: "Invalid Token" });
  }
}

function authAdmin(req, res, next) {
  if (req.user) {
    if (req.user.role === 'Manage') {
      next()
    }
    else {
      return res.status(StatusCodes.FORBIDDEN).send('Not Permission');
    }
  }
  else {
    return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
  }
}



module.exports = { verifyToken, authAdmin };
