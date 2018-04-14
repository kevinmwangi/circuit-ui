import { handleKeyDown, handleCarretPosition } from './RestrictedInputService';

describe('RestrictedInputService', () => {
  const baseEvent = {
    preventDefault: jest.fn(),
    target: {
      setSelectionRange: jest.fn()
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('filtering key events', () => {
    it('should only register enabled keys', () => {
      const userEnabledKeys = [];
      const keyEvent = { ...baseEvent, key: 'e' };
      handleKeyDown(userEnabledKeys)(keyEvent);
      expect(keyEvent.preventDefault).toHaveBeenCalled();
    });

    it('should register enabled keys', () => {
      const userEnabledKeys = ['e'];
      const keyEvent = { ...baseEvent, key: 'e' };
      handleKeyDown(userEnabledKeys)(keyEvent);
      expect(keyEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should register keys enabled by default', () => {
      const userEnabledKeys = [];
      const handler = handleKeyDown(userEnabledKeys);
      const defaultKeys = [
        'Tab',
        'Return',
        'Delete',
        'Backspace',
        'Meta',
        'Control',
        'Alt',
        'F5'
      ];

      defaultKeys.forEach(key => {
        const keyEvent = { ...baseEvent, key };
        handler(keyEvent);
        expect(keyEvent.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('fixing carret position', () => {
    it('should stick the carret to the right', () => {
      const handler = handleCarretPosition(() => {}, false);
      const event = {
        ...baseEvent,
        target: {
          ...baseEvent.target,
          value: 'foobar'
        }
      };
      const expectedArgs = [
        event.target.value.length,
        event.target.value.length
      ];
      handler(event);
      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        ...expectedArgs
      );
    });

    it('should stick the carret to the left', () => {
      const handler = handleCarretPosition(() => {}, true);
      const event = {
        ...baseEvent,
        target: {
          ...baseEvent.target,
          value: 'foobar'
        }
      };
      const expectedArgs = [0, 0];
      handler(event);
      expect(event.target.setSelectionRange).toHaveBeenLastCalledWith(
        ...expectedArgs
      );
    });

    it('should call the outer handler', () => {
      const outerHandler = jest.fn();
      const handler = handleCarretPosition(outerHandler, true);
      const event = {
        ...baseEvent,
        target: {
          ...baseEvent.target,
          value: 'foobar'
        }
      };
      handler(event);
      expect(outerHandler).toHaveBeenCalled();
    });
  });
});
