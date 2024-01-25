import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Success } from 'src/common/responses/general.response';
import { AddBookDto } from './dto/add-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PublisherResponse } from 'src/common/responses/publisher.response';
import { CategoryResponse } from 'src/common/responses/category.response';
import { AvaliableBookResponse } from 'src/common/responses/avaliable-books.response';
import { RemovedBookResponse } from 'src/common/responses/removed-book-response';
import { EnrolledUserResponse } from 'src/common/responses/enrolled-user.response';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * @method getEnrolledUsers
   * This method fetches all the enrolled users and their borrowed books
   */
  @Get('/enrolled-users')
  @ApiResponse({
    type: EnrolledUserResponse,
  })
  async getEnrolledUsers() {
    return Success('Showing enrolled users', {
      users: await this.adminService.getEnrolledUsers(),
    });
  }

  /**
   * @method addBook
   * This method adds a new book to the database
   */
  @Put('/add-book')
  @ApiBody({
    type: AddBookDto,
    description: 'Add a book to the inventory input',
  })
  @ApiResponse({
    type: AvaliableBookResponse,
  })
  async addBook(@Body() book: AddBookDto) {
    return Success('Book created successfully', {
      book: await this.adminService.addBook(book),
    });
  }

  /**
   * @method updateBook
   * This method updates a book information
   */
  @Post('/book/:bookId')
  @ApiParam({
    type: String,
    name: 'bookId',
    example: '65b18316d633f6e4f11ad05c',
  })
  @ApiResponse({
    type: AvaliableBookResponse,
  })
  async updateBook(
    @Param('bookId') bookId: string,
    @Body() book: UpdateBookDto,
  ) {
    return Success('Book updated', {
      book: await this.adminService.updateBookById(bookId, book),
    });
  }

  /**
   * @method getAllBooks
   * This method fetches all books including avaliability status and the expected return day
   */
  @Get('/books')
  @ApiResponse({
    type: AvaliableBookResponse,
  })
  async getAllBooks() {
    return Success('Showing all books', {
      books: await this.adminService.getAllBooks(),
    });
  }

  /**
   * @method getAllCategories
   * This method fetches all book categories
   */
  @Get('/categories')
  @ApiResponse({
    type: CategoryResponse,
  })
  async getAllCategories() {
    const categories = await this.adminService.getAllCategories();
    return Success('Showing all categories', { categories });
  }

  /**
   * @method getAllPublishers
   * This method fetches all book publishers
   */
  @Get('/publishers')
  @ApiResponse({
    type: PublisherResponse,
  })
  async getAllPublishers() {
    const publishers = await this.adminService.getAllPublishers();
    return Success('Showing all publishers', { publishers });
  }

  /**
   * @method getSingleBook
   * @param bookId
   * This method fetches a single book information including avaliability status and the expected return day
   */
  @Get('/book/:bookId')
  @ApiParam({
    type: String,
    name: 'bookId',
    example: '65b18316d633f6e4f11ad05c',
  })
  @ApiResponse({
    type: AvaliableBookResponse,
  })
  async getSingleBook(@Param('bookId') bookId: string) {
    const book = await this.adminService.getBookById(bookId);
    return Success('Showing book information', { book });
  }

  /**
   * @method removeBook
   * @param bookId
   * This method removes a book if not borrowed
   */
  @Delete('/remove-book/:bookId')
  @ApiParam({
    type: String,
    name: 'bookId',
    example: '65b18316d633f6e4f11ad05c',
  })
  @ApiResponse({
    type: RemovedBookResponse,
  })
  async removeBook(@Param('bookId') bookId: string) {
    return Success('Book removed successfully', {
      book: await this.adminService.removeBookById(bookId),
    });
  }
}
