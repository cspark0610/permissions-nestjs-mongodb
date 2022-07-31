import { Document, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findOne(filterQuery: FilterQuery<T>, path?: string | string[]) {
    if (path) {
      const res = await this.model
        .findOne(filterQuery, { __v: 0 })
        .populate(path)
        .exec();
      return res;
    }
    return this.model.findOne(filterQuery);
  }

  async findById(id: string, path?: string | string[]) {
    if (path) {
      const res = await this.model
        .findById(id, {
          __v: 0,
        })
        .populate(path)
        .exec();
      return res;
    }
    return this.model.findById(id, { __v: 0 });
  }

  async find(
    filterQuery: FilterQuery<T>,
    path?: string | string[],
  ): Promise<T[] | null> {
    if (path) {
      const res = await this.model
        .find(filterQuery, { __v: 0 })
        .populate(path)
        .exec();
      return res;
    }
    return this.model.find(filterQuery, { __v: 0 });
  }

  async create(createModelData: Omit<T, '_id'>): Promise<T> {
    // const model = new this.model(createModelData);
    // return await model.save();

    const createdDocument = new this.model({
      ...createModelData,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as T;
  }

  async update(updateModelData: { [P in keyof T]: any }) {
    return this.model.updateOne(updateModelData, { __v: 0 });
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T> = {},
    updateModelData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filterQuery, updateModelData, {
      new: true,
      lean: true,
      __v: 0,
    });
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filterQuery, { __v: 0 });
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.model.deleteMany(filterQuery, { __v: 0 });
    return deleteResult.deletedCount >= 1;
  }
}
