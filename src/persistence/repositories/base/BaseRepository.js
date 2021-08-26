export class BaseRepository {

  constructor(collection) {
    this._collection = collection;
  }

  async create(item) {
    const result = await this._collection.insertOne(item);

    return !!result.result.ok;
  }

  async update(id, item) {
    const result = await this._collection.updateOne({_id: id}, {$set: item});
    //console.log(result)
    return !!result.modifiedCount;
  }

  async delete(id) {
    const result = await this._collection.deleteOne({_id: id})
    return !!result.deletedCount;
  }

  async find() {
    const itemsFound = await this._collection.find({})
    return itemsFound;
  }

  async findOne(id) {
    const itemFound = await this._collection.findOne({_id: id})
    return itemFound;
  }
}