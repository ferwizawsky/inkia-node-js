const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const tokenValid = "1h";
const refreshTokenValid = "7d";

// Retrieve all Tutorials from the database.
exports.register = async (req, res) => {
  try {
    const { username, password, name } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      username: username,
      password: hashedPassword,
      roleId: 0,
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
    console.log(error);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  delete user.dataValues.password;
  delete user.dataValues.createdAt;
  delete user.dataValues.updatedAt;
  const token = jwt.sign(
    { status: "auth", ...user.dataValues },
    process.env.APP_KEY,
    {
      expiresIn: tokenValid,
    }
  );
  const refreshToken = jwt.sign(
    { status: "refresh", ...user.dataValues },
    process.env.APP_KEY,
    {
      expiresIn: refreshTokenValid,
    }
  );
  res.json({ refreshToken, token, user: user.dataValues });
};

exports.profile = async (req, res) => {
  const refreshToken = req.header("Authorization").replace("Bearer ", "");
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }
  jwt.verify(refreshToken, process.env.APP_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    if (decodedToken?.status == "auth") res.json({ user: decodedToken });
  });
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const token = req.body.token;
  if (!refreshToken || !token) {
    return res.status(401).json({ message: "Refresh token is required" });
  }
  jwt.verify(refreshToken, process.env.APP_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token / token" });
    }
  });
  jwt.verify(refreshToken, process.env.APP_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token / token" });
    }
    let user = { ...decodedToken };
    delete user.status;
    delete user.iat;
    delete user.exp;
    const tokens = jwt.sign({ status: "auth", ...user }, process.env.APP_KEY, {
      expiresIn: tokenValid,
    });
    const refreshTokens = jwt.sign(
      { status: "refresh", ...user },
      process.env.APP_KEY,
      {
        expiresIn: refreshTokenValid,
      }
    );
    res.json({ tokens, refreshTokens });
  });
};
