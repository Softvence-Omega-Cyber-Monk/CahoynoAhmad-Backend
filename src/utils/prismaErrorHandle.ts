import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorMessage = 'An unexpected database error occurred.';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.code) {
      case 'P1000':
        errorMessage = 'Authentication failed against the database.';
        statusCode = HttpStatus.UNAUTHORIZED;
        break;
      case 'P1001':
        errorMessage = 'Cannot reach the database server.';
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        break;
      case 'P1002':
        errorMessage = 'The database connection pool is exhausted.';
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        break;
      case 'P1003':
        errorMessage = 'The database does not exist.';
        statusCode = HttpStatus.NOT_FOUND;
        break;
      case 'P1008':
        errorMessage = 'Database query timed out.';
        statusCode = HttpStatus.REQUEST_TIMEOUT;
        break;
      case 'P1014':
        errorMessage = 'The underlying table for a model does not exist.';
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
      case 'P1016':
        errorMessage = 'Incorrect number of parameters for a raw query.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P1017':
        errorMessage = 'The database connection was closed by the server.';
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
      
      // P2xxx: Data-related errors
      case 'P2000':
        errorMessage = 'Provided value for a column is too long.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2001':
        errorMessage = 'Record not found for a unique query.';
        statusCode = HttpStatus.NOT_FOUND;
        break;
      case 'P2002':
        const field = (exception.meta?.target as string[])?.join(', ');
        errorMessage = `Duplicate value for unique field(s): ${field}.`;
        statusCode = HttpStatus.CONFLICT;
        break;
      case 'P2003':
        errorMessage = `Cannot perform this action due to an invalid foreign key.`;
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2004':
        errorMessage = 'A constraint failed on the database.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2005':
      case 'P2006':
        errorMessage = `An invalid value was provided for a field.`;
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2007':
        errorMessage = 'A validation error occurred.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2008':
        errorMessage = 'Invalid query input.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2009':
        errorMessage = 'The provided query is invalid.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2010':
        errorMessage = 'A raw query failed.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2011':
        errorMessage = 'A required field cannot be null.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2012':
        errorMessage = 'A required field is missing. Please check your input.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2014':
        errorMessage = 'The change you are trying to make is not possible due to a required relationship.';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      case 'P2015':
        errorMessage = `A record related to this request was not found.`;
        statusCode = HttpStatus.NOT_FOUND;
        break;
      case 'P2025':
        errorMessage = `The requested record was not found.`;
        statusCode = HttpStatus.NOT_FOUND;
        break;

      // Fallback for other errors
      default:
        console.error('Unhandled Prisma error:', exception.message);
        errorMessage = `An unexpected database error occurred.`;
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message: errorMessage,
      error: 'Database Error',
    });
  }
}
