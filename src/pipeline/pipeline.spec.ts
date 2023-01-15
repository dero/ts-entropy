import { createEntropy } from '../index.js';

describe('entropy', () => {
  describe('pipeline', () => {
    const entropy = createEntropy();
    const validUserIds = [1, 2, 3];

    const testDataValid = { userId: 1 };
    const testDataInvalid = { userId: 4 };

    it('should return rendered items by default', () => {
      const renderedData = entropy(testDataValid)
        .assign(
          'username',
          rawData => ({
            success: true,
            data: {
              userId: rawData.userId,
            },
          }),
          ({ userId }) => `User ${userId}`
        )
        .render();

      const expectedData = {
        username: 'User 1',
      };

      expect(renderedData).toStrictEqual(expectedData);
    });

    it('should use a custom renderer when provided', () => {
      const renderedData = entropy(testDataValid)
        .assign(
          'username',
          rawData => ({
            success: true,
            data: {
              userId: rawData.userId,
            },
          }),
          ({ userId }) => `User ${userId}`
        )
        .render(({ username }) => `Username: ${username}`);

      const expectedData = 'Username: User 1';

      expect(renderedData).toStrictEqual(expectedData);
    });

    it('should use a fallback renderer on parse error', () => {
      const renderedData = entropy(testDataInvalid)
        .assign(
          'username',
          rawData =>
            validUserIds.includes(rawData.userId)
              ? {
                  success: true,
                  data: {
                    userId: rawData.userId,
                  },
                }
              : {
                  success: false,
                  error: {
                    message: 'User not found',
                  },
                },
          ({ userId }) => `User ${userId}`,
          e => `Error: ${e.message}`
        )
        .render();

      const expectedData = {
        username: 'Error: User not found',
      };

      expect(renderedData).toStrictEqual(expectedData);
    });

    it('should return `undefined` on parse error when no fallback renderer is provided', () => {
      const renderedData = entropy(testDataInvalid)
        .assign(
          'username',
          rawData =>
            validUserIds.includes(rawData.userId)
              ? {
                  success: true,
                  data: {
                    userId: rawData.userId,
                  },
                }
              : {
                  success: false,
                  error: {
                    message: 'User not found',
                  },
                },
          ({ userId }) => `User ${userId}`
        )
        .render();

      const expectedData = {
        username: undefined,
      };

      expect(renderedData).toStrictEqual(expectedData);
    });
  });
});
