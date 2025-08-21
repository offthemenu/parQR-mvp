import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const scanAreaSize = width * 0.7;

export const qrScannerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scanArea: {
    height: scanAreaSize,
    flexDirection: 'row',
  },
  scanFrame: {
    width: scanAreaSize,
    height: scanAreaSize,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scanAgainButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});