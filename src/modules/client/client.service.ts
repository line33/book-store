import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Books, BooksDocument } from 'src/common/models/books.model';
import {
  Inventory,
  InventoryDocument,
} from 'src/common/models/inventory.model';
import { UserDocument, Users } from 'src/common/models/users.model';
import { EnrollUserDto } from './dto/enroll-user.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ObjectId } from 'mongodb';
import { FilterOptionsDto } from './dto/filter-options.dto';

@Injectable()
export class ClientService {
  private logger = new Logger('ClientService');

  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
    @InjectModel(Books.name)
    private readonly bookModel: Model<BooksDocument>,
  ) {
    // blank
  }

  /**
   * @method enrollUser
   * @param data
   * @returns
   * @throws
   */
  async enrollUser(data: EnrollUserDto) {
    // check if name exists
    const checkUser = await this.userModel.findOne({
      email: data.email,
      isDeleted: false,
    });

    if (checkUser)
      throw new BadRequestException('User exists and cannot be enrolled');

    // add user
    const user = await this.userModel.create({
      name: data.name,
      email: data.email,
      dateEnrolled: Date.now(),
    });

    if (!user) throw new BadRequestException('User cannot be enrolled.');

    return user;
  }

  /**
   * @method borrowBook
   * @param data
   * @returns
   * @throws
   */
  async borrowBook(data: BorrowBookDto) {
    const user = await this.userModel.findOne({
      _id: new ObjectId(data.userId),
      isDeleted: false,
    });

    if (!user)
      throw new BadRequestException(
        'This user does not exists and cannot proceed.',
      );

    const book = await this.bookModel
      .findOne({
        _id: new ObjectId(data.bookId),
        isDeleted: false,
      })
      .populate(['publisher', 'category']);

    if (!book)
      throw new BadRequestException(
        'This book does not exists and cannot be borrowed.',
      );

    // check if book is borrowed
    if (book.borrowed)
      throw new BadRequestException(
        'Cannot borrow this book at this time. Already in use by another user.',
      );

    // add to inventory
    await this.inventoryModel.create({
      book: book.id,
      user: user.id,
      duration: data.duration,
      dateCollected: Date.now(),
    });

    // update book
    book.borrowed = true;
    await book.save();

    return book;
  }

  /**
   * @method getAvaliableBooks
   * @param filter
   * @returns
   * @throws
   */
  async getAvaliableBooks(filter: FilterOptionsDto) {
    const condition: any = { isDeleted: false, borrowed: false };

    try {
      if (filter.category) {
        condition.category = new ObjectId(filter.category);
      }

      if (filter.publisher) {
        condition.publisher = new ObjectId(filter.publisher);
      }

      const books = await this.bookModel
        .find(condition)
        .populate(['publisher', 'category'])
        .sort({ createdAt: -1 })
        .lean();

      return books;
    } catch (e) {
      this.logger.debug(e.message);
    }

    return [];
  }
}
