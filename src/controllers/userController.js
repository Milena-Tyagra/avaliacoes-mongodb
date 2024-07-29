require("dotenv").config();
const bcrypt = require('bcryptjs')

const messages = require("../helpers/messages");
const collection_name = "Users";
const { getColectionAndId, checkIsEmpty } = require("../helpers/helpers");

module.exports = {
  async listUser(req, res) {
    try {
      const { collection } = getColectionAndId(req, collection_name);
      const users = await collection.find({}).toArray(function () {});
      return res.status(200).send(users);
    } catch (error) {
      console.error(messages.ERROR_TO_FIND_REGISTERS, error);
      res.status(400).send(messages.ERROR_TO_FIND_REGISTERS + error.message);
    }
  },
  async findUser(req, res) {
    try {
      const { objectId, collection } = getColectionAndId(req, collection_name);
      const user = await collection.findOne({ _id: objectId });

      if(!user) {
        return res.status(404).send(messages.USER_NOT_FOUND);
      }

      return res.status(200).send(user);
    } catch (error) {
      console.error(messages.ERROR_TO_FIND_REGISTER, error);
      res.status(400).send(messages.ERROR_TO_FIND_REGISTER + error.message);
    }
  },
  async createUser(req, res) {
    try {
      const { collection } = getColectionAndId(req, collection_name);
      const hash = await bcrypt.hash(req.body.password, 10)
      const data = {
        ...req.body,
        password: hash
      };
      await validateData(data, collection);
      const user = await collection.insertOne(data);

      res.status(200).send(user);
    } catch (error) {
      console.error(messages.ERROR_TO_CREATE_REGISTER, error);
      res.status(400).send(messages.ERROR_TO_CREATE_REGISTER + error.message);
    }
  },
  async updateUser(req, res) {
    try {
      const { objectId, collection } = getColectionAndId(req, collection_name);
      const body = req.body

      const existent_user = await collection.findOne({ _id: objectId });

      if(!existent_user) {
        return res.status(404).send(messages.USER_NOT_FOUND);
      }
      const user = await collection.updateOne(
        { _id: objectId },
        { $set: body }
      );

      return res.status(200).send(user);
    } catch (error) {
      console.error(messages.ERROR_TO_UPDATE_REGISTER, error);
      res.status(400).send(messages.ERROR_TO_UPDATE_REGISTER + error.message);
    }
  },
  async deleteUser(req, res) {
    try {
      const { objectId, collection } = getColectionAndId(req, collection_name);
      const existent_user = await collection.findOne({ _id: objectId });

      if(!existent_user) {
        return res.status(404).send(messages.USER_NOT_FOUND);
      }
      const user = await collection.deleteOne({ _id: objectId });

      return res.status(200).send(user);
    } catch (error) {
      console.error(messages.ERROR_TO_UPDATE_REGISTER, error);
      res.status(400).send(messages.ERROR_TO_UPDATE_REGISTER + error.message);
    }
  },
  async validateData(data, collection) {
    try {
      const { username, password } = data;
  
      const user = await collection.findOne({ username });
  
      if(user) {
        throw new Error(messages.ERROR_USERNAME_ALREADY_EXISTS);
      }
  
      if (checkIsEmpty(username)) {
        throw new Error(messages.ERROR_NAME_IS_REQUIRED);
      }
  
      if (checkIsEmpty(password)) {
        throw new Error(messages.ERROR_PASSWORD_IS_REQUIRED);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

async function validateData(data, collection) {
  try {
    const { username, password } = data;

    const user = await collection.findOne({ username });

    if(user) {
      throw new Error(messages.ERROR_USERNAME_ALREADY_EXISTS);
    }

    if (checkIsEmpty(username)) {
      throw new Error(messages.ERROR_NAME_IS_REQUIRED);
    }

    if (checkIsEmpty(password)) {
      throw new Error(messages.ERROR_PASSWORD_IS_REQUIRED);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
