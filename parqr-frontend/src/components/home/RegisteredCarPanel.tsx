import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CarResponse } from "../../types";
import { registeredCarPanelStyles } from "../../styles/home/registeredCarPanelStyles";

interface RegisteredCarPanelProps {
    car: CarResponse;
    onManageCars?: () => void;
}

export const RegisteredCarPanel: React.FC<RegisteredCarPanelProps> = ({
    car,
    onManageCars
}) => {
    return(
        <View style={registeredCarPanelStyles.container}>
            <View style={registeredCarPanelStyles.header}>
                <Text style={registeredCarPanelStyles.title}>Your Car</Text>
                {onManageCars && (
                    <TouchableOpacity
                        style={registeredCarPanelStyles.manageButton}
                        onPress={onManageCars}
                    >
                        <Text style={registeredCarPanelStyles.manageButtonText}>Manage</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={registeredCarPanelStyles.carInfo}>
                <Text style={registeredCarPanelStyles.carBrand}>{car.car_brand}</Text>
                <Text style={registeredCarPanelStyles.carModel}>{car.car_model}</Text>
                {/* Note: license_plate not available in CarResponse for privacy */}
                <Text style={registeredCarPanelStyles.carId}>Car ID: #{car.id}</Text>
            </View>
        </View>
    );
};
