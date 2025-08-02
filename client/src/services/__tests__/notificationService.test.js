import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import notificationService from '../notificationService';

// Mock pour socket.io-client
jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    connected: true,
    id: 'test-socket-id'
  }));
});

describe('NotificationService', () => {
  let mockSocket;

  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      connected: true,
      id: 'test-socket-id'
    };
  });

  describe('connect', () => {
    test('should connect to socket with correct parameters', () => {
      const userId = 'test-user-id';
      const token = 'test-token';

      notificationService.connect(userId, token);

      expect(notificationService.userId).toBe(userId);
      expect(notificationService.token).toBe(token);
      expect(notificationService.isConnected).toBe(true);
    });

    test('should not reconnect if already connected', () => {
      notificationService.isConnected = true;
      const originalSocket = notificationService.socket;

      notificationService.connect('test-user', 'test-token');

      expect(notificationService.socket).toBe(originalSocket);
    });
  });

  describe('authenticate', () => {
    test('should emit authenticate event with user data', () => {
      notificationService.socket = mockSocket;
      notificationService.userId = 'test-user';
      notificationService.token = 'test-token';

      notificationService.authenticate();

      expect(mockSocket.emit).toHaveBeenCalledWith('authenticate', {
        userId: 'test-user',
        token: 'test-token'
      });
    });
  });

  describe('markAsRead', () => {
    test('should emit mark-read event', () => {
      notificationService.socket = mockSocket;
      notificationService.isConnected = true;

      notificationService.markAsRead('notification-id');

      expect(mockSocket.emit).toHaveBeenCalledWith('mark-read', 'notification-id');
    });

    test('should not emit if not connected', () => {
      notificationService.socket = mockSocket;
      notificationService.isConnected = false;

      notificationService.markAsRead('notification-id');

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    test('should disconnect socket and reset state', () => {
      notificationService.socket = mockSocket;
      notificationService.isConnected = true;
      notificationService.userId = 'test-user';
      notificationService.token = 'test-token';
      notificationService.notifications = [{ id: 1 }];
      notificationService.unreadCount = 5;

      notificationService.disconnect();

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(notificationService.socket).toBeNull();
      expect(notificationService.isConnected).toBe(false);
      expect(notificationService.userId).toBeNull();
      expect(notificationService.token).toBeNull();
      expect(notificationService.notifications).toEqual([]);
      expect(notificationService.unreadCount).toBe(0);
    });
  });

  describe('event system', () => {
    test('should register event listeners', () => {
      const callback = jest.fn();
      const eventName = 'test-event';

      notificationService.on(eventName, callback);

      expect(notificationService.listeners.has(eventName)).toBe(true);
      expect(notificationService.listeners.get(eventName)).toContain(callback);
    });

    test('should emit events to registered listeners', () => {
      const callback = jest.fn();
      const eventName = 'test-event';
      const eventData = { test: 'data' };

      notificationService.on(eventName, callback);
      notificationService.emit(eventName, eventData);

      expect(callback).toHaveBeenCalledWith(eventData);
    });

    test('should remove event listeners', () => {
      const callback = jest.fn();
      const eventName = 'test-event';

      notificationService.on(eventName, callback);
      notificationService.off(eventName, callback);

      expect(notificationService.listeners.get(eventName)).not.toContain(callback);
    });
  });

  describe('permission handling', () => {
    test('should request notification permission', async () => {
      const mockRequestPermission = jest.fn().mockResolvedValue('granted');
      global.Notification = {
        requestPermission: mockRequestPermission
      };

      const result = await notificationService.requestPermission();

      expect(mockRequestPermission).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('should check notification permission', () => {
      global.Notification = {
        permission: 'granted'
      };

      const result = notificationService.checkPermission();

      expect(result).toBe('granted');
    });

    test('should return denied when Notification not available', () => {
      delete global.Notification;

      const result = notificationService.checkPermission();

      expect(result).toBe('denied');
    });
  });
}); 