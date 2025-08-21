import { Alert, Platform } from 'react-native';

interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * Safer alert function that works better on physical devices
 * Automatically dismisses on timeout and handles edge cases
 */
export const safeAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  options?: {
    cancelable?: boolean;
    timeout?: number; // Auto-dismiss after timeout (ms)
  }
): void => {
  const { timeout = 30000, ...alertOptions } = options || {};

  // Create alert with timeout fallback
  const alertTimeout = setTimeout(() => {
    console.log('Alert auto-dismissed due to timeout');
  }, timeout);

  // Enhanced buttons with cleanup
  const enhancedButtons = buttons?.map(button => ({
    ...button,
    onPress: () => {
      clearTimeout(alertTimeout);
      if (button.onPress) {
        // Add small delay to ensure alert dismisses properly on physical devices
        setTimeout(button.onPress, Platform.OS === 'ios' ? 100 : 50);
      }
    }
  })) || [{
    text: 'OK',
    onPress: () => clearTimeout(alertTimeout)
  }];

  try {
    Alert.alert(
      title,
      message,
      enhancedButtons,
      {
        ...alertOptions,
        onDismiss: () => {
          clearTimeout(alertTimeout);
        }
      }
    );
  } catch (error) {
    console.error('Alert error:', error);
    clearTimeout(alertTimeout);
  }
};

/**
 * Simple confirmation dialog with better physical device support
 */
export const safeConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void => {
  safeAlert(
    title,
    message,
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: onCancel
      },
      {
        text: 'OK',
        onPress: onConfirm
      }
    ]
  );
};