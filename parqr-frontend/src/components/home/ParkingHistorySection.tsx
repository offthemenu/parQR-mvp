import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ParkingService } from "../../services/parkingService";
import { ParkingSession } from "../../types";
import { parkingHistorySectionStyles } from "../../styles/home/parkingHistorySectionStyles";
import { formatLocalTime, calculateParkingDuration } from "../../utils/timeUtils";

interface ParkingHistorySectionProps {
    userCode: string;
    onPress: () => void;
    refreshTrigger?: number;
}

export const ParkingHistorySection: React.FC<ParkingHistorySectionProps> = ({
    userCode,
    onPress,
    refreshTrigger
}) => {
    const [recentSessions, setRecentSessions] = useState<ParkingSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRecentSessions = async () => {
        if (!userCode) return;

        try {
            const sessions = await ParkingService.getParkingHistoryPreview();
            setRecentSessions(sessions);
        } catch (error) {
            console.error("Error fetching parking history:", error);
            setRecentSessions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentSessions();
    }, [userCode, refreshTrigger]);

    if (isLoading) {
        return (
            <View style={parkingHistorySectionStyles.container}>
                <View style={parkingHistorySectionStyles.header}>
                    <Text style={parkingHistorySectionStyles.title}>Recent Parking</Text>
                </View>
                <Text style={parkingHistorySectionStyles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (recentSessions.length === 0) {
        return (
            <TouchableOpacity
                style={parkingHistorySectionStyles.container}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View style={parkingHistorySectionStyles.header}>
                    <Text style={parkingHistorySectionStyles.title}>Recent Parking</Text>
                    <Text style={parkingHistorySectionStyles.arrow}>›</Text>
                </View>
                <Text style={parkingHistorySectionStyles.emptyText}>
                    Your parking sessions will appear here
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={parkingHistorySectionStyles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={parkingHistorySectionStyles.header}>
                <Text style={parkingHistorySectionStyles.title}>Recent Parking</Text>
                <Text style={parkingHistorySectionStyles.arrow}>›</Text>
            </View>

            {recentSessions.map((session, index) => (
                <View key={session.id} style={parkingHistorySectionStyles.sessionItem}>
                    <View style={parkingHistorySectionStyles.sessionHeader}>
                        <Text style={parkingHistorySectionStyles.sessionDate}>
                            {formatLocalTime(session.start_time)}
                        </Text>
                        {session.end_time && (
                            <Text style={parkingHistorySectionStyles.duration}>
                                {calculateParkingDuration(session.start_time, session.end_time)}
                            </Text>
                        )}
                    </View>

                    {session.note_location && (
                        <Text style={parkingHistorySectionStyles.location}>
                            📍 {session.note_location}
                        </Text>
                    )}

                    {!session.end_time && (
                        <Text style={parkingHistorySectionStyles.activeSession}>
                            • Active session
                        </Text>
                    )}
                </View>
            ))}

            {recentSessions.length >= 3 && (
                <Text style={parkingHistorySectionStyles.viewMoreText}>
                    View all parking history
                </Text>
            )}
        </TouchableOpacity>
    );
}