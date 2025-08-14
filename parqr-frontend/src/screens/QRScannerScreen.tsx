import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { UserService } from '../services/userService';
import { qrScannerStyles } from '../styles/qrScannerStyles';

type QRScannerNavigationProp = StackNavigationProp<RootStackParamList, 'QRScanner'>;

export const QRScannerScreen: React.FC = () => {
  const navigation = useNavigation<QRScannerNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extractUserCodeFromQR = (data: string): string | null => {
    try {
      // Handle different QR code formats
      if (data.startsWith('https://parqr.app/profile/')) {
        // Production deep link format
        return data.split('/profile/')[1];
      } else if (data.startsWith('exp://') && data.includes('/--/profile/')) {
        // Development expo URL format: exp://192.168.1.39:19006/--/profile/USERCODE
        return data.split('/--/profile/')[1];
      } else if (data.startsWith('parqr://profile/')) {
        // Custom scheme format
        return data.split('/profile/')[1];
      } else if (data.startsWith('QR_')) {
        // Direct QR code ID format - need to look up user
        return null; // Will need to implement QR ID lookup
      } else if (data.length === 8 && /^[A-Z0-9]+$/.test(data)) {
        // Direct user code format
        return data;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    if (scanned || isLoading) return;
    
    setScanned(true);
    setIsLoading(true);

    try {
      console.log('QR Code scanned:', data);
      
      const userCode = extractUserCodeFromQR(data);
      
      if (!userCode) {
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not a valid parQR user code.',
          [
            { 
              text: 'Scan Again', 
              onPress: () => {
                setScanned(false);
                setIsLoading(false);
              }
            },
            { 
              text: 'Cancel', 
              onPress: () => navigation.goBack(),
              style: 'cancel'
            }
          ]
        );
        return;
      }

      // Look up user by user code
      const userData = await UserService.lookupUser(userCode);
      
      Alert.alert(
        'User Found!',
        `Found ${userData.user_code}. What would you like to do?`,
        [
          {
            text: 'View Profile',
            onPress: () => {
              navigation.navigate('PublicProfile', { 
                userCode: userData.user_code,
                userData: userData 
              });
            }
          },
          {
            text: 'Send Message',
            onPress: () => {
              navigation.navigate('Chat', { 
                recipientUserCode: userData.user_code,
                recipientDisplayName: userData.user_code
              });
            }
          },
          {
            text: 'Request Car Move',
            onPress: () => {
              navigation.navigate('Chat', {
                recipientUserCode: userData.user_code,
                recipientDisplayName: userData.user_code,
                sendMoveCarRequest: true
              });
            }
          },
          {
            text: 'Scan Again',
            style: 'cancel',
            onPress: () => {
              setScanned(false);
              setIsLoading(false);
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('QR scan error:', error);
      
      let errorMessage = 'Failed to find user. Please try again.';
      if (error.response?.status === 404) {
        errorMessage = 'This user could not be found. They may not be registered with parQR.';
      }

      Alert.alert(
        'User Not Found',
        errorMessage,
        [
          { 
            text: 'Scan Again', 
            onPress: () => {
              setScanned(false);
              setIsLoading(false);
            }
          },
          { 
            text: 'Cancel', 
            onPress: () => navigation.goBack(),
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={qrScannerStyles.container}>
        <Text style={qrScannerStyles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={qrScannerStyles.container}>
        <Text style={qrScannerStyles.message}>No access to camera</Text>
        <TouchableOpacity 
          style={qrScannerStyles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={qrScannerStyles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={qrScannerStyles.container}>
      <CameraView
        style={qrScannerStyles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      
      {/* Overlay positioned absolutely on top of camera */}
      <View style={qrScannerStyles.overlay}>
        <View style={qrScannerStyles.topOverlay}>
          <Text style={qrScannerStyles.instructions}>
            Scan a parQR code to view user profile
          </Text>
        </View>
        
        <View style={qrScannerStyles.scanArea}>
          <View style={qrScannerStyles.scanFrame} />
        </View>
        
        <View style={qrScannerStyles.bottomOverlay}>
          <TouchableOpacity 
            style={qrScannerStyles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={qrScannerStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          {scanned && (
            <TouchableOpacity
              style={qrScannerStyles.scanAgainButton}
              onPress={() => {
                setScanned(false);
                setIsLoading(false);
              }}
              disabled={isLoading}
            >
              <Text style={qrScannerStyles.scanAgainButtonText}>
                {isLoading ? 'Loading...' : 'Scan Again'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};