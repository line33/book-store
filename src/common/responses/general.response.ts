import { HttpStatus } from '@nestjs/common';

export function Success(message: string, other: any = {}) {
  return Object.assign(
    {
      status: 'success',
      message: message,
      statusCode: HttpStatus.OK,
    },
    other,
  );
}

export function Failed(message: string, other: any = {}) {
  return Object.assign(
    {
      status: 'error',
      message: message,
      statusCode: HttpStatus.NOT_FOUND,
    },
    other,
  );
}
