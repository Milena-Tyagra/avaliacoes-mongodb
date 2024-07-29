require("dotenv").config();

const messages = require("../helpers/messages");
const collection_name = "Ratings";
const {getColectionAndId, checkIsEmpty} = require("../helpers/helpers")

module.exports = {
  async listRating(req, res) {
    try {
      const { collection } = getColectionAndId(req, collection_name)
      const ratings = await collection.find({}).toArray(function() {
    });
     return res.status(200).send(ratings);
    } catch (error) {
      console.error(messages.ERROR_TO_FIND_REGISTERS, error);
      res.status(400).send(messages.ERROR_TO_FIND_REGISTERS + error.message);
    }
  },
  async findRating(req, res) {
    try {
      const { objectId, collection } = getColectionAndId(req, collection_name)
      const rating = await collection.findOne({ _id: objectId });

      if(!rating) {
        return res.status(404).send(messages.RATING_NOT_FOUND);
      }

      return res.status(200).send(rating);
    } catch (error) {
      console.error(messages.ERROR_TO_FIND_REGISTER, error);
      res.status(400).send(messages.ERROR_TO_FIND_REGISTER + error.message);
    }
  },
  async createRating(req, res) {
    try {
      const { collection } = getColectionAndId(req, collection_name)

      const data = {...req.body, userId: req.userId};
      validateData(data)
      const rating = await collection.insertOne(data);

      res.status(200).send(rating);
    } catch (error) {
      console.error(messages.ERROR_TO_CREATE_REGISTER, error);
      res.status(400).send(messages.ERROR_TO_CREATE_REGISTER + error.message);
    }
  },
  async updateRating(req, res) {
    try {
      const { objectId, collection } = getColectionAndId(req, collection_name)
      const body = req.body

      const existent_rating = await collection.findOne({ _id: objectId });

      if(!existent_rating) {
        return res.status(404).send(messages.RATING_NOT_FOUND);
      }

      const rating = await collection.updateOne(
        { _id: objectId },
        { $set: body }
      );

      return res.status(200).send(rating);
    } catch (error) {
      console.error(messages.ERROR_TO_UPDATE_REGISTER, error);
      res.status(400).send(messages.ERROR_TO_UPDATE_REGISTER + error.message);
    }
  },
  async deleteRating(req, res) {
    try {
      const { objectId, collection } = getColectionAndId(req, collection_name)
      const existent_rating = await collection.findOne({ _id: objectId });

      if(!existent_rating) {
        return res.status(404).send(messages.RATING_NOT_FOUND);
      }
      const rating = await collection.deleteOne(
        { _id: objectId }
      );

      return res.status(200).send(rating);
    } catch (error) {
      console.error(messages.ERROR_TO_UPDATE_REGISTER, error);
      res.status(400).send(messages.ERROR_TO_UPDATE_REGISTER + error.message);
    }
  },
  validateData(data) {
    try {
      const { rating, comment } = data
  
    if(checkIsEmpty(rating)) {
      throw new Error(messages.ERROR_COMMENT_IS_REQUIRED);
    }
  
    if(checkIsEmpty(comment)) {
      throw new Error(messages.ERROR_RATING_IS_REQUIRED);
    }
  
    const rating_number = parseInt(rating)
    const max_rating = 5
    const min_rating = 1
  
    if(isNaN(rating_number) || rating_number > max_rating || rating_number < min_rating) {
      throw new Error(messages.ERROR_INVALID_RATING);
    }
    } catch(error) {
      throw new Error(error.message)
    }
    
  }
};

function validateData(data) {
  try {
    const { rating, comment } = data

  if(checkIsEmpty(rating)) {
    throw new Error(messages.ERROR_COMMENT_IS_REQUIRED);
  }

  if(checkIsEmpty(comment)) {
    throw new Error(messages.ERROR_RATING_IS_REQUIRED);
  }

  const rating_number = parseInt(rating)
  const max_rating = 5
  const min_rating = 1

  if(isNaN(rating_number) || rating_number > max_rating || rating_number < min_rating) {
    throw new Error(messages.ERROR_INVALID_RATING);
  }
  } catch(error) {
    throw new Error(error.message)
  }
  
}

