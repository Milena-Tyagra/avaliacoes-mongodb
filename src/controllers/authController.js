require("dotenv").config();

const messages = require("../helpers/messages");
const collection_name = "Users";
const {getColectionAndId, chechPassword, generateToken} = require("../helpers/helpers")

module.exports = {
  async login(req, res) {
    try {
      const { collection } = getColectionAndId(req, collection_name)
      const {password, username} = req.body
      const user = await collection.findOne({ username });

      if(!user) {
        throw new Error(messages.ERROR_INVALID_LOGIN_CREDENTIALS)
      }

      const rigthPassword = await chechPassword(user.password, password)

      if(!rigthPassword) {
        throw new Error(messages.ERROR_INVALID_LOGIN_CREDENTIALS)
      }

      const userWithToken = {
        ...user,
        token: generateToken({_id: user._id})
      }
     return res.status(200).send(userWithToken);
    } catch (error) {
      console.error(messages.ERROR_TO_FIND_REGISTERS, error);
      res.status(400).send(messages.ERROR_TO_FIND_REGISTERS + error.message);
    }
  },
};

