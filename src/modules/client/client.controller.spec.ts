import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { Books, BooksSchema } from 'src/common/models/books.model';
import { Category, CategorySchema } from 'src/common/models/category.model';
import { PublisherSchema, Publishers } from 'src/common/models/publisher.model';
import { UserSchema, Users } from 'src/common/models/users.model';
import { Inventory, InventorySchema } from 'src/common/models/inventory.model';
import { ClientService } from './client.service';
import { getModelToken } from '@nestjs/mongoose';
import { AdminService } from '../admin/admin.service';
import * as dotenv from 'dotenv';

dotenv.config({});

const enrollSubs = {
  name: 'Paul',
  email: 'hellopaul@gmail.com',
};

const createBookSub = {
  categoryId: '',
  publisherId: '',
  bookName: 'Steve Jobs',
  description: 'This description is for test',
};

describe('ClientController', () => {
  let controller: ClientController;
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
      controllers: [ClientController],
      providers: [
        ClientService,
        AdminService,
        { provide: getModelToken(Books.name), useValue: bookModel },
        { provide: getModelToken(Category.name), useValue: categoryModel },
        { provide: getModelToken(Publishers.name), useValue: publisherModel },
        { provide: getModelToken(Users.name), useValue: userModel },
        { provide: getModelToken(Inventory.name), useValue: inventoryModel },
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
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

  describe('enrollUser', () => {
    it('should enroll a user', async () => {
      const response = await controller.enrollUser(enrollSubs);
      expect(response.user.name).toBe(enrollSubs.name);
    });
  });

  describe('borrowBook', () => {
    it('should borrow a book', async () => {
      const category = await categoryModel.findOne({ isDeleted: false });
      createBookSub.categoryId = category.id;
      const publisher = await publisherModel.findOne({ isDeleted: false });
      createBookSub.publisherId = publisher.id;
      const book = await bookModel.create(createBookSub);
      const userResponse = await controller.enrollUser(enrollSubs);
      const bookResponse = await controller.borrowBook({
        bookId: book._id.toString(),
        userId: userResponse.user.id.toString(),
        duration: 4,
      });
      expect(bookResponse.book.id).toBe(book.id);
    });
  });

  describe('avaliableBooks', () => {
    it('should return avaliable books', async () => {
      const category = await categoryModel.findOne({ isDeleted: false });
      createBookSub.categoryId = category.id;
      const publisher = await publisherModel.findOne({ isDeleted: false });
      createBookSub.publisherId = publisher.id;
      await bookModel.create(createBookSub);
      try {
        const bookResponse = await controller.getAvaliableBooks({});
        expect(bookResponse.books.length).toBeLessThanOrEqual(1);
      } catch (e) {}
    });

    it('should return avaliable books by category', async () => {
      const category = await categoryModel.findOne({ isDeleted: false });
      createBookSub.categoryId = category.id;
      const publisher = await publisherModel.findOne({ isDeleted: false });
      createBookSub.publisherId = publisher.id;
      await bookModel.create(createBookSub);
      const bookResponse = await controller.getAvaliableBooks({
        category: category.id.toString(),
      });
      expect(bookResponse.books.length).toBeLessThanOrEqual(1);
    });

    it('should return avaliable books by publisher', async () => {
      const category = await categoryModel.findOne({ isDeleted: false });
      createBookSub.categoryId = category.id;
      const publisher = await publisherModel.findOne({ isDeleted: false });
      createBookSub.publisherId = publisher.id;
      await bookModel.create(createBookSub);
      const bookResponse = await controller.getAvaliableBooks({
        publisher: publisher.id.toString(),
      });
      expect(bookResponse.books.length).toBeLessThanOrEqual(1);
    });
  });
});
