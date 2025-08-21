import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';

interface UserActionModalProps {
  visible: boolean;
  userCode: string;
  onClose: () => void;
  onViewProfile: () => void;
  onSendMessage: () => void;
  onRequestCarMove: () => void;
  onScanAgain: () => void;
}

export const UserActionModal: React.FC<UserActionModalProps> = ({
  visible,
  userCode,
  onClose,
  onViewProfile,
  onSendMessage,
  onRequestCarMove,
  onScanAgain
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>User Found!</Text>
          <Text style={styles.subtitle}>
            Found {userCode}. What would you like to do?
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={onViewProfile}>
              <Text style={styles.actionButtonText}>👤 View Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={onSendMessage}>
              <Text style={styles.actionButtonText}>💬 Send Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={onRequestCarMove}>
              <Text style={styles.actionButtonText}>🚗 Request Car Move</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.scanAgainButton} onPress={onScanAgain}>
              <Text style={styles.scanAgainButtonText}>📷 Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: width - 40,
    maxWidth: 320,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scanAgainButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  scanAgainButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});