import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import { AppException } from '../exceptions/appException';
import { HttpStatus } from '@nestjs/common';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findOne(filterQuery: FilterQuery<T>, path?: string | string[]) {
    if (path) {
      const res = await this.model
        .findOne(filterQuery, { __v: 0 })
        .populate(path)
        .exec();
      if (!res) {
        throw new AppException({
          error: 'No se encontró el registro',
          errorCode: 'NOT_FOUND',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
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
      if (!res) {
        throw new AppException({
          error: 'No se encontró el registro',
          errorCode: 'NOT_FOUND',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
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
      if (!res) {
        throw new Error('No se encontró el registro');
      }
      return res;
    }
    return this.model.find(filterQuery, { __v: 0 });
  }

  async create(createModelData: unknown): Promise<T> {
    const model = new this.model(createModelData);
    return await model.save();
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T> = {},
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
