import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { qrCodeDisplayStyles } from '../styles/qrCodeDisplayStyles';

interface QRCodeDisplayProps {
  qrCodeId: string;
  size?: number;
  showId?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeId,
  size = 200,
  showId = true,
}) => {
  return (
    <View style={qrCodeDisplayStyles.container}>
      <QRCode
        value={qrCodeId}
        size={size}
        backgroundColor="white"
        color="black"
      />
      {showId && (
        <Text style={qrCodeDisplayStyles.qrIdText}>QR ID: {qrCodeId}</Text>
      )}
    </View>
  );
};