import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

function mockContext(headerValue?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        header: (name: string) =>
          name === 'x-api-key' ? headerValue : undefined,
      }),
    }),
  } as unknown as ExecutionContext;
}

describe('ApiKeyGuard', () => {
  const guard = new ApiKeyGuard();

  afterEach(() => {
    delete process.env.META_SYNC_API_KEY;
  });

  it('should throw if META_SYNC_API_KEY is not configured', () => {
    expect(() => guard.canActivate(mockContext('anything'))).toThrow(
      /META_SYNC_API_KEY non configurato/,
    );
  });

  it('should reject a request with a wrong key', () => {
    process.env.META_SYNC_API_KEY = 'secret-123';
    expect(() => guard.canActivate(mockContext('wrong-key'))).toThrow(
      UnauthorizedException,
    );
  });

  it('should reject a request with no key at all', () => {
    process.env.META_SYNC_API_KEY = 'secret-123';
    expect(() => guard.canActivate(mockContext(undefined))).toThrow(
      UnauthorizedException,
    );
  });

  it('should allow a request with the matching key', () => {
    process.env.META_SYNC_API_KEY = 'secret-123';
    expect(guard.canActivate(mockContext('secret-123'))).toBe(true);
  });
});
