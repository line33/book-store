import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterOptionsDto } from './dto/filter-options.dto';
import { AdminService } from '../admin/admin.service';
import { Success } from 'src/common/responses/general.response';
import { EnrollUserDto } from './dto/enroll-user.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { EnrollUserResponse } from 'src/common/responses/enroll-user.response';
import { BorrowBookResponse } from 'src/common/responses/borrow-book.response';
import { AvaliableBookResponse } from 'src/common/responses/avaliable-books.response';
import { CategoryResponse } from 'src/common/responses/category.response';
import { PublisherResponse } from 'src/common/responses/publisher.response';

@Controller('client')
@ApiTags('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly adminService: AdminService,
  ) {}

  /**
   * @method enrollUser
   * This endpoint enrolls a user
   */
  @Put('/enroll-user')
  @ApiBody({
    type: EnrollUserDto,
    description: 'Enroll user input',
  })
  @ApiResponse({
    type: EnrollUserResponse,
  })
  async enrollUser(@Body() data: EnrollUserDto) {
    const user = await this.clientService.enrollUser(data);
    return Success('User enrolled successfully', {
      user,
    });
  }

  /**
   * @method borrowBook
   * This endpoint will allow a user borrow book by specifying the duration in days.
   */
  @Put('/borrow-book')
  @ApiBody({
    type: BorrowBookDto,
    description: 'Borrow a book from inventory input',
  })
  @ApiResponse({
    type: BorrowBookResponse,
  })
  async borrowBook(@Body() data: BorrowBookDto) {
    const book = await this.clientService.borrowBook(data);
    return Success('Book borrowed successfully', { book });
  }

  /**
   * @method getAvaliableBooks
   * @param filter
   * This endpoint will list all avaliable books and also allow for filter by publishers or categories
   */
  @Get('/avaliable-books')
  @ApiQuery({
    type: String,
    name: 'category',
    example: '65b18289d633f6e4f11ad056',
  })
  @ApiQuery({
    type: String,
    name: 'publisher',
    example: '65b18316d633f6e4f11ad05c',
  })
  @ApiResponse({
    type: AvaliableBookResponse,
  })
  async getAvaliableBooks(@Query() filter: FilterOptionsDto) {
    const books = await this.clientService.getAvaliableBooks(filter);
    return Success('Showing avaliable books', { books });
  }

  /**
   * @method getSingleBook
   * @param bookId
   * This endpoint fetches a single book by an ID
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
    return Success('Showing book information', {
      book: await this.adminService.getBookById(bookId),
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
}
