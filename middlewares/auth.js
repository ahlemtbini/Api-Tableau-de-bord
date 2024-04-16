const express = require("express");

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log(req.body)
  try {
    const token = req.body.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "a'NrkZi22NIo.QZnxa!a?", {
      algorithm: "HS256",
    });
    console.log(decodedToken)
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "User is non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "requete non authentifié !" });
  }
};