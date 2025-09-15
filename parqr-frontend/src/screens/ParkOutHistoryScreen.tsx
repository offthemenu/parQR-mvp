import React, { useState, useEffect} from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from '@react-navigation/native';
import { MoveRequestService } from "../services/moveRequestService";
import { parkOutHistoryStyles } from "../styles/parkOutHistoryStyles";
import { formatLocalTime } from "../utils/timeUtils";
import { MoveRequest, RootStackParamList } from "../types";

type ParkOutHistoryRouteProp = RouteProp<RootStackParamList, 'ParkOutHistory'>;

interface ParkOutHistoryScreenProps {
    navigation: any;
}

export const ParkOutHistoryScreen: React.FC<ParkOutHistoryScreenProps> = ({ navigation }) => {
    const route = useRoute<ParkOutHistoryRouteProp>();
    const { userCode } = route.params;

    const [moveRequests, setMoveRequests] = useState<MoveRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

    const fetchMoveRequests = async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);
            
            // Use the existing service method that gets all requests for current user
            const requests = await MoveRequestService.getAllMoveRequests(userCode);
            setMoveRequests(requests)
        } catch (error) {
            console.error(`Error fetching move requests for ${userCode}:`, error);
            Alert.alert('Error', "Failed to load park-out history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchMoveRequests(false);
        setIsRefreshing(false);
    };

    const handleMarkAsRead = async (requestId: number) => {
        try {
            await MoveRequestService.markAsRead(requestId);
            await fetchMoveRequests(false); // Refresh list
        } catch (error) {
            Alert.alert("Error", "Failed to mark request as read")
        }
    };

    const getFilteredReqeusts = () => {
        switch (filter) {
            case 'unread':
                return moveRequests.filter(req => !req.is_read);
            case 'read':
                return moveRequests.filter(req => req.is_read);
            default:
                return moveRequests;
        }
    };

    // Load requests when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            fetchMoveRequests();
        }, [userCode])
    );

    const renderFilterButton = (filterType: typeof filter, label: string) => (
        <TouchableOpacity
            style={[
                parkOutHistoryStyles.filterButton,
                filter === filterType && parkOutHistoryStyles.filterButtonActive
            ]}
            onPress={() => setFilter(filterType)}
        >
            <Text style={[
                parkOutHistoryStyles.filterButtonText,
                filter === filterType && parkOutHistoryStyles.filterButtonTextActive
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderMoveRequest = ({ item }: { item: MoveRequest}) => (
        <View style={[
            parkOutHistoryStyles.requestCard,
            !item.is_read && parkOutHistoryStyles.unreadCard
        ]}>
            <View style={parkOutHistoryStyles.requestHeader}>
                <Text style={parkOutHistoryStyles.licenseplate}>
                    {item.license_plate}
                </Text>
                <Text style={parkOutHistoryStyles.timestamp}>
                    {formatLocalTime(item.created_at)}
                </Text>
            </View>

            {item.requester_info && (
                <Text style={parkOutHistoryStyles.requesterInfo}>
                    From: {item.requester_info}
                </Text>
            )}

            <Text style={parkOutHistoryStyles.message}>
                Someone has requested you to move your car.
            </Text>

            {!item.is_read && (
                <TouchableOpacity
                    style={parkOutHistoryStyles.markReadButton}
                    onPress={() => handleMarkAsRead(item.id)}
                >
                    <Text style={parkOutHistoryStyles.markReadText}>Mark as Read</Text>
                </TouchableOpacity>
            )}

            {!item.is_read && (
                <View style={parkOutHistoryStyles.unreadIndicator} />
            )}
        </View>
    );

    if (isLoading) {
        return (
            <View style={parkOutHistoryStyles.centerContainer}>
                <Text>Loading park-out history...</Text>
            </View>
        );
    }

    const filteredRequests = getFilteredReqeusts();

    return (
        <View style={parkOutHistoryStyles.container}>
            {/* Filter Buttons */}
            <View style={parkOutHistoryStyles.filterContainer}>
                {renderFilterButton('all', 'All')}
                {renderFilterButton('unread', 'Unread')}
                {renderFilterButton('read', 'Read')}
            </View>

            {/* Requests List */}
            <FlatList
                data={filteredRequests}
                renderItem={renderMoveRequest}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
                ListEmptyComponent={
                    <View style={parkOutHistoryStyles.emptyContainer}>
                        <Text style={parkOutHistoryStyles.emptyText}>
                            No park-out requests yet
                        </Text>
                        <Text style={parkOutHistoryStyles.emptySubtext}>
                            When someone scans your QR code and requests you to move your car, it will appear here
                        </Text>
                    </View>
                }
                contentContainerStyle={
                    filteredRequests.length === 0 ? parkOutHistoryStyles.emptyList : undefined
                }
            />
        </View>
    );
};