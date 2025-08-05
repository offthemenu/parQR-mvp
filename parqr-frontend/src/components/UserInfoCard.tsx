import React from 'react';
import { View, Text } from 'react-native';
import { userInfoCardStyles } from '../styles/userInfoCardStyles';

interface UserInfoCardProps {
  label: string;
  value: string;
  isLast?: boolean;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ 
  label, 
  value, 
  isLast = false 
}) => {
  return (
    <View style={[userInfoCardStyles.infoRow, isLast && userInfoCardStyles.lastRow]}>
      <Text style={userInfoCardStyles.infoLabel}>{label}:</Text>
      <Text style={userInfoCardStyles.infoValue}>{value}</Text>
    </View>
  );
};