import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CarService } from "../services/carService";
import { CarOwnerResponse, RootStackParamList, KOREAN_CAR_BRANDS } from "../types";
import { editCarStyles } from "../styles/editCarStyles";

type EditCarRouteProp = RouteProp<RootStackParamList, "EditCar">;
type EditCarNavigationProp = StackNavigationProp<RootStackParamList, "EditCar">;

export const EditCarScreen: React.FC = () => {
    const route = useRoute<EditCarRouteProp>();
    const navigation = useNavigation<EditCarNavigationProp>();
    const { carData } = route.params;

    const [licensePlate, setLicensePlate] = useState(carData.license_plate);
    const [carBrand, setCarBrand] = useState(carData.car_brand);
    const [carModel, setCarModel] = useState(carData.car_model);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdateCar = async () => {
        if (!licensePlate.trim() || !carBrand.trim() || !carModel.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await CarService.updateCar(carData.id, {
                license_plate: licensePlate.trim(),
                car_brand: carBrand.trim(),
                car_model: carModel.trim()
            });

            Alert.alert("Success", "Car updated successfully", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error: any) {
            Alert.alert("Eeeek!!", error.message || "Failed to update car");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={editCarStyles.container}>
            <View style={editCarStyles.form}>
                <Text style={editCarStyles.title}>Edit Car Details</Text>

                <View style={editCarStyles.inputGroup}>
                    <Text style={editCarStyles.label}>License Plate</Text>
                    <TextInput
                        style={editCarStyles.input}
                        value={licensePlate}
                        onChangeText={setLicensePlate}
                        placeholder="Enter license plate"
                        autoCapitalize="characters"
                    />
                </View>

                <View style={editCarStyles.inputGroup}>
                    <Text style={editCarStyles.label}>Car Brand</Text>
                    <TextInput
                        style={editCarStyles.input}
                        value={carBrand}
                        onChangeText={setCarBrand}
                        placeholder="Enter car brand"
                    />
                </View>

                <View style={editCarStyles.inputGroup}>
                    <Text style={editCarStyles.label}>Car Model</Text>
                    <TextInput
                        style={editCarStyles.input}
                        value={carModel}
                        onChangeText={setCarModel}
                        placeholder="Enter car model"
                    />
                </View>

                <TouchableOpacity
                    style={[
                        editCarStyles.updateButton,
                        isSubmitting && editCarStyles.updateButtonDisabled
                    ]}
                    onPress={handleUpdateCar}
                    disabled={isSubmitting}
                >
                    <Text style={editCarStyles.updateButtonText}>
                        {isSubmitting ? 'Updating...' : 'Update Car'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={editCarStyles.cancelButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={editCarStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};