import { StyleSheet } from 'react-native';

export const countryPickerStyles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  loadingIndicator: {
    marginVertical: 40,
  },
});