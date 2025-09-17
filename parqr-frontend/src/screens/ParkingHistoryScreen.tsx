import React, { useState, useEffect } from "react";
import { 
    View,
    Text,
    FlatList,
    RefreshControl,
    TouchableOpacity
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ParkingService } from "../services/parkingService";
import { ParkingSession } from "../types";
import { parkingHistoryStyles } from "../styles/parkingHistoryStyles";
import { formatLocalTime, calculateParkingDuration } from "../utils/timeUtils";

interface ParkingHistoryScreenProps {
    navigation: any;
}

export const ParkingHistoryScreen: React.FC<ParkingHistoryScreenProps> = ({ navigation }) => {
    const [parkingSessions, setParkingSessions] = useState<ParkingSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filter, setFilter] = useState<"all" | "completed" | "active">("all");

    const fetchParkingSessions = async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);

            const sessions = await ParkingService.getParkingHistory();
            setParkingSessions(sessions);
        } catch (error) {
            console.error("Error fetching parking history:", error);
            setParkingSessions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchParkingSessions(false);
        setIsRefreshing(false);
    };

    const getFilteredSessions = () => {
        switch (filter) {
            case 'completed':
                return parkingSessions.filter(session => session.end_time);
            case 'active':
                return parkingSessions.filter(session => !session.end_time);
            default:
                return parkingSessions;
        }
    };

    // Loading sessions only when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            fetchParkingSessions();
        }, [])
    );

    const renderFilterButton = (filterType: typeof filter, label: string) => (
        <TouchableOpacity
            style={[
                parkingHistoryStyles.filterButton,
                filter === filterType && parkingHistoryStyles.filterButtonActive
            ]}
            onPress={() => setFilter(filterType)}
        >
            <Text style={[
                parkingHistoryStyles.filterButtonText,
                filter === filterType && parkingHistoryStyles.filterButtonTextActive
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderParkingSession = ({ item }: { item: ParkingSession }) => (
        <View style={parkingHistoryStyles.sessionCard}>
            <View style={parkingHistoryStyles.sessionHeader}>
                <Text style={parkingHistoryStyles.startTime}>
                    {formatLocalTime(item.start_time)}
                </Text>
                {item.end_time ? (
                    <View style={parkingHistoryStyles.completedBadge}>
                        <Text style={parkingHistoryStyles.completedText}>Completed</Text>
                    </View>
                ) : (
                    <View style={parkingHistoryStyles.activeBadge}>
                        <Text style={parkingHistoryStyles.activeText}>Active</Text>
                    </View>
                )}
            </View>

            {item.end_time && (
                <Text style={parkingHistoryStyles.duration}>
                    Duration: {calculateParkingDuration(item.start_time, item.end_time)}
                </Text>
            )}

            {item.note_location && (
                <Text style={parkingHistoryStyles.location}>
                    📍 {item.note_location}
                </Text>
            )}

            <Text style={parkingHistoryStyles.sessionId}>
                Session #{item.id}
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={parkingHistoryStyles.centerContainer}>
                <Text>Loading Parking History...</Text>
            </View>
        );
    }

    const filteredSessions = getFilteredSessions();
    
    return (
        <View style={parkingHistoryStyles.container}>
            {/* Filter Buttons */}
            <View style={parkingHistoryStyles.filterContainer}>
                {renderFilterButton('all', 'All')}
                {renderFilterButton('completed', 'Completed')}
                {renderFilterButton('active', 'Active')}
            </View>

            {/* Sessions List */}
            <FlatList
                data={filteredSessions}
                renderItem={renderParkingSession}
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
                    <View style={parkingHistoryStyles.emptyContainer}>
                        <Text style={parkingHistoryStyles.emptyText}>
                            No parking sessions yet
                        </Text>
                        <Text style={parkingHistoryStyles.emptySubtext}>
                            Start a parking session from the home screen to build your parking history
                        </Text>
                    </View>
                }
                contentContainerStyle={
                    filteredSessions.length === 0 ? parkingHistoryStyles.emptyList : undefined
                }
            />
        </View>
    );
};