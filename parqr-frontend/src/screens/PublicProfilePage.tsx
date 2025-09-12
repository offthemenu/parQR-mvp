import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MoveRequestService } from "../services/moveRequestService";
import { useFeatureGating } from "../hooks/useFeatureGating";
import { publicProfileStyles } from "../styles/publicProfileStyles";

interface PublicProfileData {
    user_code: string;
    active_car: {
        brand: string;
        model: string;
    };
    parking_status: string;
    public_message: string | null;
}

export const PublicProfilePage: React.FC = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { scannedUserCode } = route.params;

    const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
    const [licensePlate, setLicensePlate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Get current user from context/storage 
    const userTier = 'free' // Placeholder - eventually to be retrieved from auth
    const { canSendMessages } = useFeatureGating(userTier);

    useEffect(() => {
        fetchProfileData();
    }, [scannedUserCode]);

    const fetchProfileData = async () => {
        try {
            const response = await fetch(`/api/v01/public_profile/${scannedUserCode}`);
            const data = await response.json();
            setProfileData(data);

        } catch (error) {
            console.error('Failed to fetch profile:', error);
            Alert.alert("Error", "Failed to load user profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestParkOut = async () => {
        try {
            await MoveRequestService.createRequest(scannedUserCode, licensePlate);
            Alert.alert('Success', "Parkout Request Sent!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to Send Request");
        }
    };

    const handleSendMessage = () => {
        // Navigate to chat or show premium upgrade
        Alert.alert("Premium Feature", "Messaging requires premium subscription");
    }

    if (isLoading || !profileData) {
        return (
            <View style={publicProfileStyles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={publicProfileStyles.container}>
            {/* ID Card Header */}
            <View style={publicProfileStyles.header}>
                <Text style={publicProfileStyles.userCode}>{profileData.user_code}</Text>
                <Text style={publicProfileStyles.carInfo}>
                    {profileData.active_car.brand} {profileData.active_car.model}
                </Text>
                <Text style={publicProfileStyles.parkingStatus}>{profileData.parking_status}</Text>
                {profileData.public_message && (
                    <Text style={publicProfileStyles.publicMessage}>{profileData.public_message}</Text>
                )}
            </View>

            {/* Request Section */}
            <View style={publicProfileStyles.requestSection}>
                <Text style={publicProfileStyles.instruction}>
                    Enter License Plate number to Request ParkOut
                </Text>
                <TextInput
                    style={publicProfileStyles.licensePlateInput}
                    value={licensePlate}
                    onChangeText={setLicensePlate}
                    placeholder="Enter license plate"
                />

                <View style={publicProfileStyles.actions}>
                    <TouchableOpacity
                        style={[
                            publicProfileStyles.button,
                            licensePlate.length <= 7 && publicProfileStyles.buttonDisabled
                        ]}
                        onPress={handleRequestParkOut}
                        disabled={licensePlate.length <= 7}
                    >
                        <Text style={publicProfileStyles.buttonText}>Park Out</Text>
                    </TouchableOpacity>

                    {canSendMessages && (
                        <TouchableOpacity
                            style={[
                                publicProfileStyles.button,
                                publicProfileStyles.messageButton,
                                licensePlate.length <= 7 && publicProfileStyles.buttonDisabled
                            ]}
                            onPress={handleSendMessage}
                            disabled={licensePlate.length <= 7}
                        >
                            <Text style={publicProfileStyles.buttonText}>Send Message</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};