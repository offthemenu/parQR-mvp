import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CarService } from "../services/carService";
import { UserService } from "../services/userService";
import { useFeatureGating } from "../hooks/useFeatureGating";
import { CarOwnerResponse } from "../types";
import { carManagementStyles } from "../styles/carManagementStyles";

interface CarManagementScreenProps {
    navigation: any;
}

export const CarManagementScreen: React.FC<CarManagementScreenProps> = ({ navigation }) => {
    const [cars, setCars] = useState<CarOwnerResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeCar, setActiveCar] = useState<CarOwnerResponse | null>(null);
    const [userTier, setUserTier] = useState<string>('basic');
    
    const { canAddCars } = useFeatureGating(userTier);

    const fetchUserCars = async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);

            // Get user profile for tier information
            const userProfile = await UserService.getUserProfile();
            setUserTier(userProfile.user_tier);
            
            // Get user profile with cars
            const userCars = await CarService.getUserCars();
            setCars(userCars);

            // Set active car (first car for now, could be enhanced with active car selection - likely premium feature)
            if (userCars.length > 0) {
                setActiveCar(userCars[0]);
            }
        } catch (error) {
            console.error("Error fetching cars:", error)
            Alert.alert("Error", "Failed to load your cars");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchUserCars(false);
        setIsRefreshing(false);
    };

    const handleAddCar = () => {
        navigation.navigate("CarRegistration");
    };

    const handleEditCar = (car: CarOwnerResponse) => {
        navigation.navigate("EditCar", {
            carData: car
        });
    };

    const handleRemoveCar = (car: CarOwnerResponse) => {
        if (cars.length === 1) {
            Alert.alert(
                "Cannot Remove",
                "You must have at least one registered car.",
                [{ text: "OK" }]
            );
            return;
        }

        Alert.alert(
            "Remove Car",
            `Remove ${car.car_brand} ${car.car_model} from your account?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await CarService.removeCar(car.id);
                            await fetchUserCars(false);
                            Alert.alert("Success", "Car removed successfulyy")
                        } catch (error) {
                            Alert.alert("Erorr", "Failed to remove car")
                        }
                    }
                }
            ]
        );
    };

    const handleSetActiveCar = (car: CarOwnerResponse) => {
        setActiveCar(car);
        Alert.alert("Success", `${car.car_brand} ${car.car_model} is now your active car`);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserCars();
        }, [])
    );

    const renderCarItem = ({ item }: { item: CarOwnerResponse }) => (
        <View style={[
            carManagementStyles.carCard,
            activeCar?.id === item.id && carManagementStyles.activeCarCard
        ]}>
            <View style={carManagementStyles.carInfo}>
                <Text style={carManagementStyles.carBrand}>{item.car_brand}</Text>
                <Text style={carManagementStyles.carModel}>{item.car_model}</Text>
                <Text style={carManagementStyles.licensePlate}>
                    {item.license_plate}
                </Text>

                {activeCar?.id === item.id && (
                    <View style={carManagementStyles.activeBadge}>
                        <Text style={carManagementStyles.activeText}>Active Car</Text>
                    </View>
                )}
            </View>

            <View style={carManagementStyles.carActions}>
                {activeCar?.id !== item.id && cars.length > 1 && (
                    <TouchableOpacity
                        style={carManagementStyles.actionButton}
                        onPress={() => handleSetActiveCar(item)}
                    >
                        <Text style={carManagementStyles.actionButtonText}>Set Active</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[carManagementStyles.actionButton, carManagementStyles.editButton]}
                    onPress={() => handleEditCar(item)}
                >
                    <Text style={carManagementStyles.actionButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[carManagementStyles.actionButton, carManagementStyles.removeButton]}
                    onPress={() => handleRemoveCar(item)}
                >
                    <Text style={carManagementStyles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View style={carManagementStyles.centerContainer}>
                <Text>Loading your cars...</Text>
            </View>
        );
    }

    return (
        <View style={carManagementStyles.container}>
            <FlatList
                data={cars}
                renderItem={renderCarItem}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
                ListHeaderComponent={
                    <View style={carManagementStyles.header}>
                        <Text style={carManagementStyles.headerTitle}>Your Cars</Text>
                        <Text style={carManagementStyles.headerSubtitle}>
                            Manage your registered vehicles
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    canAddCars ? (
                        <TouchableOpacity
                            style={carManagementStyles.addCarButton}
                            onPress={handleAddCar}
                        >
                            <Text style={carManagementStyles.addCarButtonText}>+ Add New Car</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={carManagementStyles.premiumPrompt}>
                            <Text style={carManagementStyles.premiumText}>
                                Upgrade to Premium to add multiple cars
                            </Text>
                        </View>
                    )
                }
            />
        </View>
    );
};