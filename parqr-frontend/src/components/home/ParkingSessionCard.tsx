import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import { ParkingService } from "../../services/parkingService";
import { parkingSessionCardStyles } from "../../styles/home/parkingSessionCardStyles";
import { ParkingSession } from "../../types";
import { calculateParkingDuration, formatTimeForCountry } from "../../utils/timeUtils";

interface ParkingSessionCardProps {
    session: ParkingSession;
    onSessionEnded: () => void;
    userCountryISO: string;
}

export const ParkingSessionCard: React.FC<ParkingSessionCardProps> = ({
    session,
    onSessionEnded,
    userCountryISO
}) => {
    const [currentDuration, setCurrentDuration] = useState('');
    const [isEnding, setIsEnding] = useState(false);

    // Update duration every minute
    useEffect(() => {
        const updateDuration = () => {
            const duration = calculateParkingDuration(session.start_time);
            setCurrentDuration(duration);
        };

        // Initial update
        updateDuration();

        // Updating every minute
        const interval = setInterval(updateDuration, 60000);

        return () => clearInterval(interval);
    }, [session.start_time]);

    const handleEndSession = () => {
        Alert.alert(
            "End Parking Session",
            "Are you sure you want to end this parking session?",
            [
                { text: "Cancel", style: 'cancel' },
                {
                    text: "End Session",
                    style: 'destructive',
                    onPress: async () => {
                        setIsEnding(true);

                        try {
                            const result = await ParkingService.endParkingSession(session.id);

                            if (result) {
                                Alert.alert(
                                    "Session Ended",
                                    `Parking session ended after ${currentDuration}`,
                                    [{ text: "OK", onPress: onSessionEnded }]
                                );
                            } else {
                                Alert.alert("Error", result || "Failed to end session");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Unable to end session. Please try again.");
                        } finally {
                            setIsEnding(false);
                        }
                    }
                }
            ]
        );
    };

    const formatStartTime = (startTime: string) => {
        return formatTimeForCountry(startTime, userCountryISO);
    };

    return (
        <View style={parkingSessionCardStyles.container}>
            <View style={parkingSessionCardStyles.header}>
                <View style={parkingSessionCardStyles.statusIndicator} />
                <Text style={parkingSessionCardStyles.title}>Active Parking Session</Text>
            </View>

            <View style={parkingSessionCardStyles.content}>
                <View style={parkingSessionCardStyles.infoRow}>
                    <Text style={parkingSessionCardStyles.label}>Duration:</Text>
                    <Text style={parkingSessionCardStyles.duration}>{currentDuration}</Text>
                </View>

                <View style={parkingSessionCardStyles.infoRow}>
                    <Text style={parkingSessionCardStyles.label}>Started:</Text>
                    <Text style={parkingSessionCardStyles.value}>
                        {formatStartTime(session.start_time)}
                    </Text>
                </View>

                {session.note_location && (
                    <View style={parkingSessionCardStyles.infoRow}>
                        <Text style={parkingSessionCardStyles.label}>Location:</Text>
                        <Text style={parkingSessionCardStyles.value} numberOfLines={2}>
                            {session.note_location}
                        </Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={[
                    parkingSessionCardStyles.endButton,
                    isEnding && parkingSessionCardStyles.endButtonDisabled
                ]}
                onPress={handleEndSession}
                disabled={isEnding}
            >
                <Text style={[
                    parkingSessionCardStyles.endButtonText,
                    isEnding && parkingSessionCardStyles.endButtonTextDisabled
                ]}>
                    {isEnding ? 'Ending...' : 'End Session'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};