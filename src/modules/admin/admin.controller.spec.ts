import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { Books, BooksSchema } from 'src/common/models/books.model';
import { Category, CategorySchema } from 'src/common/models/category.model';
import { PublisherSchema, Publishers } from 'src/common/models/publisher.model';
import { UserSchema, Users } from 'src/common/models/users.model';
import { Inventory, InventorySchema } from 'src/common/models/inventory.model';
import { getModelToken } from '@nestjs/mongoose';
import { AdminService } from '../admin/admin.service';
import * as dotenv from 'dotenv';
import { AdminController } from './admin.controller';

dotenv.config({});

const createBookSub = {
  categoryId: '',
  publisherId: '',
  bookName: 'Steve Jobs',
  description: 'This description is for test',
};

describe('AdminController', () => {
  let controller: AdminController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let bookModel: Model<Books>;
  let categoryModel: Model<Category>;
  let publisherModel: Model<Publishers>;
  let userModel: Model<Users>;
  let inventoryModel: Model<Inventory>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    mongoConnection = (await connect(process.env.MONGODB_URL)).connection;
    bookModel = mongoConnection.model(Books.name, BooksSchema);
    categoryModel = mongoConnection.model(Category.name, CategorySchema);
    publisherModel = mongoConnection.model(Publishers.name, PublisherSchema);
    userModel = mongoConnection.model(Users.name, UserSchema);
    inventoryModel = mongoConnection.model(Inventory.name, InventorySchema);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        AdminService,
        { provide: getModelToken(Books.name), useValue: bookModel },
        { provide: getModelToken(Category.name), useValue: categoryModel },
        { provide: getModelToken(Publishers.name), useValue: publisherModel },
        { provide: getModelToken(Users.name), useValue: userModel },
        { provide: getModelToken(Inventory.name), useValue: inventoryModel },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      if (key != 'categories' && key != 'publishers')
        await collection.deleteMany({});
    }
  });

  describe('addBook', () => {
    it('should successfully add a book', async () => {
      const category = await categoryModel.findOne({ isDeleted: false });
      createBookSub.categoryId = category.id.toString();
      const publisher = await publisherModel.findOne({ isDeleted: false });
      createBookSub.publisherId = publisher.id.toString();
      const response = await controller.addBook(createBookSub);
      expect(response.book.bookName).toBe(createBookSub.bookName);
    });
  });

  describe('removeBook', () => {
    it('should successfully remove a book', async () => {
      const category = await categoryModel.findOne({ isDeleted: false });
      createBookSub.categoryId = category.id;
      const publisher = await publisherModel.findOne({ isDeleted: false });
      createBookSub.publisherId = publisher.id;
      const book = await bookModel.create(createBookSub);
      const response = await controller.removeBook(book.id.toString());
      expect(response.book.bookName).toBe(createBookSub.bookName);
    });
  });

  describe('books', () => {
    it('should return all books', async () => {
      const category = await categoryModel.findOne({ isDeleted: false });
      createBookSub.categoryId = category.id;
      const publisher = await publisherModel.findOne({ isDeleted: false });
      createBookSub.publisherId = publisher.id;
      await bookModel.create(createBookSub);
      const bookResponse = await controller.getAllBooks();
      expect(bookResponse.books[0].bookName).toBe(createBookSub.bookName);
    });

    it('should return a single book', async () => {
      const category = await categoryModel.findOne({ isDeleted: false });
      createBookSub.categoryId = category.id;
      const publisher = await publisherModel.findOne({ isDeleted: false });
      createBookSub.publisherId = publisher.id;
      const book = await bookModel.create(createBookSub);
      const bookResponse = await controller.getSingleBook(book.id.toString());
      expect(bookResponse.book.bookName).toBe(book.bookName);
    });
  });
});
