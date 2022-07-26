import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T> {
    return this.model
      .findOne(filterQuery, {
        __v: 0,
        ...projection,
      })
      .exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model
      .findById(id, {
        __v: 0,
      })
      .exec();
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.model
      .find(filterQuery, {
        __v: 0,
      })
      .exec();
  }

  async create(createModelData: unknown): Promise<T> {
    const model = new this.model(createModelData, { __v: 0 });
    return model.save();
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateModelData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filterQuery, updateModelData, {
      new: true,
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
