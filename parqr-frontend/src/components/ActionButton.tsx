import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { actionButtonStyles } from '../styles/actionButtonStyles';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return actionButtonStyles.secondaryButton;
      case 'danger':
        return actionButtonStyles.dangerButton;
      default:
        return actionButtonStyles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return actionButtonStyles.secondaryButtonText;
      case 'danger':
        return actionButtonStyles.dangerButtonText;
      default:
        return actionButtonStyles.primaryButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && actionButtonStyles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        getTextStyle(),
        disabled && actionButtonStyles.disabledButtonText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};