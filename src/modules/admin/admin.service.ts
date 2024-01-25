import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Books, BooksDocument } from 'src/common/models/books.model';
import { Category, CategoryDocument } from 'src/common/models/category.model';
import {
  Inventory,
  InventoryDocument,
} from 'src/common/models/inventory.model';
import {
  PublisherDocument,
  Publishers,
} from 'src/common/models/publisher.model';
import { UserDocument, Users } from 'src/common/models/users.model';
import { AddBookDto } from './dto/add-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class AdminService {
  private logger = new Logger('AdminSerice');
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Publishers.name)
    private readonly publisherModel: Model<PublisherDocument>,
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
   * @method getAllCategories
   * @returns
   * @throws
   */
  async getAllCategories() {
    const categories = { data: [] };
    try {
      categories.data = await this.categoryModel.find({
        isDeleted: false,
      });
    } catch (e) {
      this.logger.debug(e.message);
    }
    return categories;
  }

  /**
   * @method getAllPublishers
   * @returns
   * @throws
   */
  async getAllPublishers() {
    const publishers = { data: [] };
    try {
      publishers.data = await this.publisherModel.find({ isDeleted: false });
    } catch (e) {
      this.logger.debug(e.message);
    }

    return publishers.data;
  }

  /**
   * @method findPublisherById
   * @param publisherId
   * @returns
   * @throws
   */
  async findPublisherById(publisherId: string) {
    try {
      const publisher = await this.publisherModel.findOne({
        _id: new ObjectId(publisherId),
        isDeleted: false,
      });

      if (!publisher)
        throw new BadRequestException('Publisher does not exists.');

      return publisher;
    } catch (e) {
      this.logger.debug(e.message);
    }

    return false;
  }

  /**
   * @member findCategoryById
   * @param categoryId
   * @returns
   * @throws
   */
  async findCategoryById(categoryId: string) {
    try {
      const category = await this.categoryModel.findOne({
        _id: new ObjectId(categoryId),
        isDeleted: false,
      });

      if (!category) throw new BadRequestException('Category does not exists.');

      return category;
    } catch (e) {
      this.logger.debug(e.message);
    }

    return false;
  }

  /**
   * @member getAllBooks
   * @returns
   * @throws
   */
  async getAllBooks() {
    try {
      const books = await this.bookModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .populate(['category', 'publisher'])
        .lean();

      return books;
    } catch (e) {
      this.logger.debug(e.message);
      return [];
    }
  }

  /**
   * @member getEnrolledUsers
   * @returns
   * @throws
   */
  async getEnrolledUsers() {
    try {
      const users = await this.userModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .lean();
      return await Promise.all(
        users.map(async (user) => {
          const data: any = { ...user, books: [] };
          const booksUserBorrowed = await this.inventoryModel
            .find({ user: user._id, recovered: false })
            .populate(['book']);
          if (booksUserBorrowed.length > 0) {
            booksUserBorrowed.forEach((book) => {
              data.books.push(book);
            });
          }
          return data;
        }),
      );
    } catch (e) {
      this.logger.debug(e.message);
      return [];
    }
  }

  /**
   * @member getBookById
   * @param bookId
   * @returns
   * @throws
   */
  async getBookById(bookId: string) {
    try {
      const book = await this.bookModel
        .findOne({
          _id: new ObjectId(bookId),
          isDeleted: false,
        })
        .populate(['publisher', 'category']);
      return book;
    } catch (e) {
      this.logger.debug(e.message);
    }

    return false;
  }

  /**
   * @member removeBookById
   * @param bookId
   * @returns
   * @throws
   */
  async removeBookById(bookId: string) {
    const book = await this.getBookById(bookId);
    if (book) {
      book.isDeleted = true;

      // check if book has been borrowed
      if (book.borrowed)
        throw new BadRequestException(
          'This book has been borrowed and cannot be deleted at this time.',
        );

      // delete
      await book.save();
      this.logger.log('Book deleted using .save()');
      return book;
    }

    return false;
  }

  /**
   * @method addBook
   * @param book
   * @returns
   * @throws
   */
  async addBook(book: AddBookDto) {
    const category = await this.categoryModel.findOne({
      _id: new ObjectId(book.categoryId),
      isDeleted: false,
    });

    if (!category) throw new BadRequestException('Category does not exists');

    const publisher = await this.publisherModel.findOne({
      _id: new ObjectId(book.publisherId),
      isDeleted: false,
    });

    if (!publisher) throw new BadRequestException('Publisher does not exists');

    // check if similar record already exists
    const bookPublished = await this.bookModel.findOne({
      category: category.id,
      publisher: publisher.id,
      bookName: book.bookName,
      isDeleted: false,
    });

    if (bookPublished)
      throw new BadRequestException('A similar book has been uploaded.');

    // create record
    const createBook = await this.bookModel.create({
      category: category.id,
      publisher: publisher.id,
      bookName: book.bookName,
      description: book.description,
    });

    return await createBook.populate(['category', 'publisher']);
  }

  /**
   * @method updateBookById
   * @param bookId
   * @param data
   * @throws
   * @returns
   */
  async updateBookById(bookId: string, data: UpdateBookDto) {
    const book = await this.bookModel.findOne({
      _id: new ObjectId(bookId),
      isDeleted: false,
    });

    if (!book) throw new BadRequestException('Book does not exists.');

    // check category
    if (data.categoryId) {
      const category = await this.categoryModel.findOne({
        _id: data.categoryId,
        isDeleted: false,
      });

      if (!category) throw new BadRequestException('Category does not exists');

      book.category = category.id;
    }

    // check publisher
    if (data.publisherId) {
      const publisher = await this.publisherModel.findOne({
        _id: data.publisherId,
        isDeleted: false,
      });

      if (!publisher)
        throw new BadRequestException('Publisher does not exists');

      book.publisher = publisher.id;
    }

    book.bookName = data.bookName ?? book.bookName;
    book.description = data.description ?? book.description;
    await book.save();

    return await this.getBookById(book.id);
  }
}
