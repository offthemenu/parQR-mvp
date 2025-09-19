import { StyleSheet } from "react-native";

export const editCarStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    form: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    updateButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    updateButtonDisabled: {
        opacity: 0.6,
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    cancelButtonText: {
        color: '#3A3A3C',
        fontSize: 16,
        fontWeight: '500',
    },
});