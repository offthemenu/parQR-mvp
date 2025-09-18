import { StyleSheet } from 'react-native';

export const registeredCarPanelStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  manageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  carInfo: {
    gap: 4,
  },
  carBrand: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  carModel: {
    fontSize: 16,
    color: '#3A3A3C',
    marginBottom: 8,
  },
  carId: {
    fontSize: 12,
    color: '#8E8E93',
  },
});