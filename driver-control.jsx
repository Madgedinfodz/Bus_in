import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Vibration,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  ChevronLeft,
  UserPlus,
  UserMinus,
  MapPin,
  QrCode,
  UserPlus as UserPlusRegister,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

export default function DriverControlScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [stationInput, setStationInput] = useState("");

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Fetch bus status
  const { data: busStatus, isLoading } = useQuery({
    queryKey: ["busStatus"],
    queryFn: async () => {
      const response = await fetch("/api/bus-status");
      if (!response.ok) {
        throw new Error("فشل في جلب بيانات الباص");
      }
      return response.json();
    },
    refetchInterval: 3000,
  });

  // Add passenger mutation
  const addPassengerMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/bus-status/add-passenger", {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في إضافة الراكب");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["busStatus"]);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Vibration.vibrate(50);
      }
    },
    onError: (error) => {
      Alert.alert("خطأ", error.message);
    },
  });

  // Remove passenger mutation
  const removePassengerMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/bus-status/remove-passenger", {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في إزالة الراكب");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["busStatus"]);
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Vibration.vibrate(50);
      }
    },
    onError: (error) => {
      Alert.alert("خطأ", error.message);
    },
  });

  // Update station mutation
  const updateStationMutation = useMutation({
    mutationFn: async (station) => {
      const response = await fetch("/api/bus-status/update-station", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ station }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في تحديث المحطة");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["busStatus"]);
      setStationInput("");
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Vibration.vibrate(50);
      }
      Alert.alert("تم", "تم تحديث المحطة بنجاح");
    },
    onError: (error) => {
      Alert.alert("خطأ", error.message);
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  const currentPassengers = busStatus?.current_passengers || 0;
  const availableSeats = busStatus?.available_seats || 50;
  const currentStation = busStatus?.current_station || "جاري التحميل...";
  const totalCapacity = busStatus?.total_capacity || 50;

  const handleUpdateStation = () => {
    if (!stationInput.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال اسم المحطة");
      return;
    }
    updateStationMutation.mutate(stationInput.trim());
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <StatusBar style="dark" />

        {/* Header */}
        <View
          style={{
            paddingTop: insets.top,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#E5E5E5",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <ChevronLeft size={24} color="#1C1C1C" />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 28,
                color: "#1C1C1C",
                flex: 1,
              }}
            >
              لوحة تحكم السائق
            </Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
            {/* Current Status */}
            <View
              style={{
                backgroundColor: "#F4F4F4",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: "#9E9E9E",
                  marginBottom: 12,
                }}
              >
                الحالة الحالية
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 24,
                  color: "#1C1C1C",
                  marginBottom: 16,
                }}
              >
                {currentStation}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: "#9E9E9E",
                    }}
                  >
                    الركاب الحاليين
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 32,
                      color: "#1C1C1C",
                    }}
                  >
                    {currentPassengers}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: "#9E9E9E",
                    }}
                  >
                    المقاعد الفارغة
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 32,
                      color: "#1C1C1C",
                    }}
                  >
                    {availableSeats}
                  </Text>
                </View>
              </View>
            </View>

            {/* QR Scanner Button */}
            <TouchableOpacity
              onPress={() => router.push("/qr-scanner")}
              style={{
                backgroundColor: "#9FAFFE",
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <QrCode size={28} color="#1C1C1C" />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 20,
                  color: "#1C1C1C",
                  marginLeft: 12,
                }}
              >
                مسح رمز QR للطالب
              </Text>
            </TouchableOpacity>

            {/* Passenger Control */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 20,
                  color: "#1C1C1C",
                  marginBottom: 16,
                }}
              >
                التحكم في الركاب
              </Text>

              <View style={{ flexDirection: "row", gap: 12 }}>
                {/* Add Passenger */}
                <TouchableOpacity
                  onPress={() => addPassengerMutation.mutate()}
                  disabled={
                    addPassengerMutation.isPending ||
                    currentPassengers >= totalCapacity
                  }
                  style={{
                    flex: 1,
                    backgroundColor:
                      currentPassengers >= totalCapacity
                        ? "#E5E5E5"
                        : "#C9F8D3",
                    borderRadius: 16,
                    padding: 24,
                    alignItems: "center",
                    opacity:
                      addPassengerMutation.isPending ||
                      currentPassengers >= totalCapacity
                        ? 0.5
                        : 1,
                  }}
                >
                  <UserPlus size={32} color="#1C1C1C" />
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 18,
                      color: "#1C1C1C",
                      marginTop: 12,
                      textAlign: "center",
                    }}
                  >
                    دخل راكب
                  </Text>
                </TouchableOpacity>

                {/* Remove Passenger */}
                <TouchableOpacity
                  onPress={() => removePassengerMutation.mutate()}
                  disabled={
                    removePassengerMutation.isPending || currentPassengers <= 0
                  }
                  style={{
                    flex: 1,
                    backgroundColor:
                      currentPassengers <= 0 ? "#E5E5E5" : "#DCD0FF",
                    borderRadius: 16,
                    padding: 24,
                    alignItems: "center",
                    opacity:
                      removePassengerMutation.isPending ||
                      currentPassengers <= 0
                        ? 0.5
                        : 1,
                  }}
                >
                  <UserMinus size={32} color="#1C1C1C" />
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 18,
                      color: "#1C1C1C",
                      marginTop: 12,
                      textAlign: "center",
                    }}
                  >
                    خرج راكب
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Update Station */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 20,
                  color: "#1C1C1C",
                  marginBottom: 16,
                }}
              >
                تحديث المحطة
              </Text>

              <View
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <MapPin size={20} color="#1C1C1C" />
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 16,
                      color: "#1C1C1C",
                      marginLeft: 8,
                    }}
                  >
                    اسم المحطة الجديدة
                  </Text>
                </View>

                <TextInput
                  value={stationInput}
                  onChangeText={setStationInput}
                  placeholder="أدخل اسم المحطة"
                  placeholderTextColor="#9E9E9E"
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                    color: "#1C1C1C",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    marginBottom: 16,
                    textAlign: "right",
                  }}
                />

                <TouchableOpacity
                  onPress={handleUpdateStation}
                  disabled={updateStationMutation.isPending}
                  style={{
                    backgroundColor: "#2B2B2B",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                    opacity: updateStationMutation.isPending ? 0.5 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 16,
                      color: "#FFFFFF",
                    }}
                  >
                    {updateStationMutation.isPending
                      ? "جاري التحديث..."
                      : "تحديث المحطة"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register New Student Button */}
            <TouchableOpacity
              onPress={() => router.push("/register-student")}
              style={{
                backgroundColor: "#C9F8D3",
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <UserPlusRegister size={24} color="#1C1C1C" />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: "#1C1C1C",
                  marginLeft: 12,
                }}
              >
                تسجيل طالب جديد
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
