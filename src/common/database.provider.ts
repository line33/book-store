import { Books, BooksSchema } from './models/books.model';
import { Category, CategorySchema } from './models/category.model';
import { Inventory, InventorySchema } from './models/inventory.model';
import { PublisherSchema, Publishers } from './models/publisher.model';
import { UserSchema, Users } from './models/users.model';

export const DatabaseProviders = [
  {
    schema: CategorySchema,
    name: Category.name,
  },
  {
    schema: PublisherSchema,
    name: Publishers.name,
  },
  {
    schema: UserSchema,
    name: Users.name,
  },
  {
    schema: InventorySchema,
    name: Inventory.name,
  },
  {
    schema: BooksSchema,
    name: Books.name,
  },
];
