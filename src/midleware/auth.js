const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken')
const { getColectionAndId } = require("../helpers/helpers");
const messages = require("../helpers/messages");

require("dotenv").config();
const collection_name = "Users"

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({error: messages.ERROR_NO_TOKEN})
  }

  const separated_token = token.split(" ");
  const formated_token = separated_token[1];

  jwt.verify(
    formated_token,
    process.env.AUTH_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(401).send({error: messages.ERROR_INVALID_TOKEN})
      }

      let user;

      try {
        const { collection } = getColectionAndId(
          req,
          collection_name
        );
        const objectId = new ObjectId(decoded._id);
        user = await collection.findOne({ _id: objectId });
      } catch (error) {
        return res.status(401).send({error: messages.ERROR_INVALID_TOKEN})
      }

      req.user = user
      req.userId = user._id

      return next()
    }
  );
};
