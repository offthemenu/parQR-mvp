
import React from "react";
import { View, Text } from "react-native";
import { notificationBadgeStyles } from "../../styles/home/notificationBadgeStyles";

interface NotificationBadgeProps {
    count: number;
    maxCount?: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
    count,
    maxCount = 99
}) => {
    if (count <= 0) {
        return null;
    }

    const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

    return(
        <View style={notificationBadgeStyles.container}>
            <Text style={notificationBadgeStyles.text}>
                {displayCount}
            </Text>
        </View>
    );
};