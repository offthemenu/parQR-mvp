import { StyleSheet } from "react-native";

export const carManagementStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#3A3A3C',
    },
    carCard: {
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
    activeCarCard: {
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    carInfo: {
        marginBottom: 16,
    },
    carBrand: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    carModel: {
        fontSize: 16,
        color: '#3A3A3C',
        marginBottom: 8,
    },
    licensePlate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
        backgroundColor: '#F2F2F7',
        padding: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    activeBadge: {
        backgroundColor: '#30D158',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    activeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    carActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#007AFF',
    },
    editButton: {
        backgroundColor: '#FF9500',
    },
    removeButton: {
        backgroundColor: '#FF3B30',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    addCarButton: {
        backgroundColor: '#30D158',
        marginHorizontal: 20,
        marginVertical: 16,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    addCarButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
})