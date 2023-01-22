import { createEntropy } from '../index.js';

describe('entropy', () => {
  describe('pipeline.events', () => {
    const onParseError = jest.fn();
    const onSlotRender = jest.fn();
    const onRender = jest.fn();
    const onFallbackRender = jest.fn();
    const onFallbackMiss = jest.fn();

    const entropy = createEntropy({
      onParseError,
      onSlotRender,
      onRender,
      onFallbackRender,
      onFallbackMiss,
    });
    const testDataValid = { userId: 1 };
    const validUserIds = [1, 2, 3];

    const testDataInvalid = { userId: 4 };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call `onSlotRender` and `onRender` callbacks when there are no parsing errors', () => {
      entropy(testDataValid)
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

      expect(onSlotRender).toHaveBeenCalledTimes(1);
      expect(onSlotRender).toHaveBeenCalledWith('User 1');
      expect(onRender).toHaveBeenCalledTimes(1);
      expect(onRender).toHaveBeenCalledWith({ username: 'User 1' });
    });

    it('should call `onParseError` and `onFallbackMiss` callbacks when there are parsing errors', () => {
      entropy(testDataInvalid)
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

      expect(onParseError).toHaveBeenCalledTimes(1);
      expect(onParseError).toHaveBeenCalledWith({
        message: 'User not found',
      });
      expect(onFallbackMiss).toHaveBeenCalledTimes(1);
      expect(onFallbackMiss).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });

    it('should call `onParseError` and `onFallbackRender` callbacks when there are parsing errors and a fallback renderer is provided', () => {
      entropy(testDataInvalid)
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

      expect(onParseError).toHaveBeenCalledTimes(1);
      expect(onParseError).toHaveBeenCalledWith({
        message: 'User not found',
      });
      expect(onFallbackRender).toHaveBeenCalledTimes(1);
      expect(onFallbackRender).toHaveBeenCalledWith('Error: User not found', {
        message: 'User not found',
      });
    });
  });
});
