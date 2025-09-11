import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NotificationBadge } from "./NotificationBadge";
import { parkOutRequestsSectionStyles } from "../../styles/home/parkOutRequestsSectionStyles"; 

interface ParkOutRequestsSectionProps {
    unreadCount: number;
    onPress: () => void;
}

export const ParkOutRequestsSection: React.FC<ParkOutRequestsSectionProps> = ({
    unreadCount,
    onPress
}) => {
    return (
        <View style={parkOutRequestsSectionStyles.container}>
            <TouchableOpacity style={parkOutRequestsSectionStyles.header} onPress={onPress}>
                <Text style={parkOutRequestsSectionStyles.title}>Park Out Requests</Text>
                {unreadCount > 0 && (
                    <NotificationBadge count={unreadCount} color="#007AFF" />
                )}
            </TouchableOpacity>

            {/* Simple preview - will be enhanced later */}
            <Text style={parkOutRequestsSectionStyles.previewText}>
                {unreadCount > 0 ? `${unreadCount} new requests` : 'No new requests'}
            </Text>
        </View>
    )
}