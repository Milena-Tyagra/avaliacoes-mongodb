
const { ObjectId } = require('mongodb');
const { conectToDBTests } = require('../../helpers/helpers');
const { validateData } = require('../userController');

test('cria usuário', async () => {
    const collection = await conectToDBTests('Users')
    const data = {
        username: Math.random(),
        password: 123
    }
    await validateData(data, collection);
    const user = await collection.insertOne(data);
    expect(user.acknowledged).toBeTruthy()
  })

  test('encontra usuário por id', async () => {
    const collection = await conectToDBTests('Users')
      const users = await collection.find({}).toArray(function () {});
      const objectId = new ObjectId(users[0]._id);
      const user = await collection.findOne({ _id: objectId });
    expect(user.username).toBe(users[0].username);
  })

  test('atualiza usuário por id', async () => {
    const collection = await conectToDBTests('Users')
      const users = await collection.find({}).toArray(function () {});
      const objectId = new ObjectId(users[0]._id);
      const body = {
        username: Math.random(),
      }
      const user = await collection.updateOne(
        { _id: objectId },
        { $set: body }
      );
    expect(user.modifiedCount).toBe(1);
  })

  test('lista usuarios', async () => {
    const collection = await conectToDBTests('Users')
      const users = await collection.find({}).toArray(function () {});
      if(users) {
          expect(users.length).toBeGreaterThan(0);
      } else {
        expect(users.length).toBeNull()
      }
  })

  test('deleta usuário por id', async () => {
    const collection = await conectToDBTests('Users')
      const users = await collection.find({}).toArray(function () {});
      const objectId = new ObjectId(users[0]._id);
      const user = await collection.deleteOne({ _id: objectId });

      expect(user.acknowledged).toBeTruthy()
  })