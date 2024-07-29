
const { ObjectId } = require('mongodb');
const { conectToDBTests } = require('../../helpers/helpers');
const { validateData } = require('../ratingController');

test('cria avaliação', async () => {
    const collection = await conectToDBTests('Ratings')
    const data = {
      rating: 3, 
      comment: "comentário"
  }
    validateData(data, collection);
    const rating = await collection.insertOne(data);
    expect(rating.acknowledged).toBeTruthy()
  })

  test('encontra avaliação por id', async () => {
    const collection = await conectToDBTests('Ratings')
      const ratings = await collection.find({}).toArray(function () {});
      const objectId = new ObjectId(ratings[0]._id);
      const rating = await collection.findOne({ _id: objectId });
    expect(rating.comment).toBe(ratings[0].comment);
  })

  test('atualiza avaliação por id', async () => {
    const collection = await conectToDBTests('Ratings')
      const ratings = await collection.find({}).toArray(function () {});
      const objectId = new ObjectId(ratings[0]._id);
      const body = {
        comment: Math.random(),
      }
      const rating = await collection.updateOne(
        { _id: objectId },
        { $set: body }
      );
    expect(rating.modifiedCount).toBe(1);
  })

  test('lista avaliações', async () => {
    const collection = await conectToDBTests('Ratings')
      const ratings = await collection.find({}).toArray(function () {});
      if(ratings) {
          expect(ratings.length).toBeGreaterThan(0);
      } else {
        expect(ratings.length).toBeNull()
      }
  })

  test('deleta avaliação por id', async () => {
    const collection = await conectToDBTests('Ratings')
      const ratings = await collection.find({}).toArray(function () {});
      const objectId = new ObjectId(ratings[0]._id);
      const rating = await collection.deleteOne({ _id: objectId });

      expect(rating.acknowledged).toBeTruthy()
  })