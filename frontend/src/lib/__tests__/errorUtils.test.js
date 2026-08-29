import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '../errorUtils';

describe('errorUtils - getErrorMessage', () => {
  it('should return default message for null or undefined error', () => {
    expect(getErrorMessage(null)).toBe(
      'An unexpected error occurred. Please try again.',
    );
    expect(getErrorMessage(undefined)).toBe(
      'An unexpected error occurred. Please try again.',
    );
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
  });

  it('should return string errors directly', () => {
    expect(getErrorMessage('Invalid email format')).toBe('Invalid email format');
    expect(getErrorMessage('   ')).toBe(
      'An unexpected error occurred. Please try again.',
    );
  });

  it('should parse Axios error responses (error.response.data.message)', () => {
    const axiosError = {
      response: {
        data: {
          message: 'User already exists',
        },
        status: 400,
      },
    };
    expect(getErrorMessage(axiosError)).toBe('User already exists');
  });

  it('should parse Axios error responses where data is a string', () => {
    const axiosError = {
      response: {
        data: 'Internal Server Error',
        status: 500,
      },
    };
    expect(getErrorMessage(axiosError)).toBe('Internal Server Error');
  });

  it('should parse RTK Query error structures (error.data.message)', () => {
    const rtkError = {
      status: 404,
      data: {
        message: 'Product not found',
      },
    };
    expect(getErrorMessage(rtkError)).toBe('Product not found');
  });

  it('should parse RTK Query error structures with error.error string', () => {
    const rtkError = {
      status: 'FETCH_ERROR',
      error: 'Network request failed',
    };
    expect(getErrorMessage(rtkError)).toBe('Network request failed');
  });

  it('should parse standard JavaScript Error objects', () => {
    const jsError = new Error('Syntax error in parsing');
    expect(getErrorMessage(jsError)).toBe('Syntax error in parsing');
  });

  it('should return custom default message when error structure is unknown', () => {
    const strangeError = { code: 12345 };
    expect(getErrorMessage(strangeError, 'Failed to fetch items')).toBe(
      'Failed to fetch items',
    );
  });
});
