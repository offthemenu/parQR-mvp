import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { quickActionCardStyles } from '../styles/quickActionCardStyles';

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  onPress,
}) => {
  return (
    <TouchableOpacity style={quickActionCardStyles.actionCard} onPress={onPress}>
      <Text style={quickActionCardStyles.actionTitle}>{title}</Text>
      <Text style={quickActionCardStyles.actionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};