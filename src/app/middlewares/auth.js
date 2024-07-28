const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // const token = req.cookies["myToken"];
  const token = req.headers["authorization"].split(" ")[1];
  const secretKey = process.env.SECRET_KEY || "jwt-test";

  if (!token) return res.status(401).send("Unauthorized");

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
}

function authAdmin(req, res, next){
    if (req.user){
        if(req.user.role === 'Manage'){
          next()
        }
        else{
            return res.status(403).send('Not Permission');
        }
    }
    else{
        return res.status(401).send("Unauthorized");
    }
}

module.exports = { verifyToken, authAdmin  };
