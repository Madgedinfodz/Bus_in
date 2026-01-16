import React from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
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
import { Bus, Users, Armchair, MapPin, QrCode } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

export default function BusTrackerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Fetch bus status with auto-refresh every 3 seconds
  const {
    data: busStatus,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["busStatus"],
    queryFn: async () => {
      const response = await fetch("/api/bus-status");
      if (!response.ok) {
        throw new Error("فشل في جلب بيانات الباص");
      }
      return response.json();
    },
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  if (!fontsLoaded) {
    return null;
  }

  const currentPassengers = busStatus?.current_passengers || 0;
  const availableSeats = busStatus?.available_seats || 50;
  const currentStation = busStatus?.current_station || "جاري التحميل...";
  const totalCapacity = busStatus?.total_capacity || 50;

  return (
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
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 28,
              color: "#1C1C1C",
            }}
          >
            متابعة الباص
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          {/* Current Station Card */}
          <View
            style={{
              backgroundColor: "#DCD0FF",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <MapPin size={24} color="#1C1C1C" />
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: "#1C1C1C",
                  marginLeft: 8,
                }}
              >
                المحطة الحالية
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 32,
                color: "#1C1C1C",
              }}
            >
              {currentStation}
            </Text>
          </View>

          {/* Passengers Info */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {/* Current Passengers */}
            <View
              style={{
                flex: 1,
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
                <Users size={20} color="#1C1C1C" />
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: "#1C1C1C",
                    marginLeft: 8,
                  }}
                >
                  الركاب الحاليين
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 40,
                  color: "#1C1C1C",
                }}
              >
                {currentPassengers}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: "#9E9E9E",
                }}
              >
                من {totalCapacity}
              </Text>
            </View>

            {/* Available Seats */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#C9F8D3",
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
                <Armchair size={20} color="#1C1C1C" />
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: "#1C1C1C",
                    marginLeft: 8,
                  }}
                >
                  المقاعد الفارغة
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 40,
                  color: "#1C1C1C",
                }}
              >
                {availableSeats}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: "#9E9E9E",
                }}
              >
                متاح
              </Text>
            </View>
          </View>

          {/* Capacity Bar */}
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
                color: "#1C1C1C",
                marginBottom: 12,
              }}
            >
              نسبة الإشغال
            </Text>
            <View
              style={{
                height: 12,
                backgroundColor: "#E5E5E5",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${(currentPassengers / totalCapacity) * 100}%`,
                  backgroundColor: "#9FAFFE",
                  borderRadius: 6,
                }}
              />
            </View>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 24,
                color: "#1C1C1C",
                marginTop: 12,
                textAlign: "center",
              }}
            >
              {Math.round((currentPassengers / totalCapacity) * 100)}%
            </Text>
          </View>

          {/* Driver Control Button */}
          <TouchableOpacity
            onPress={() => router.push("/driver-control")}
            style={{
              backgroundColor: "#2B2B2B",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Bus size={24} color="#FFFFFF" />
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: "#FFFFFF",
                marginLeft: 12,
              }}
            >
              لوحة تحكم السائق
            </Text>
          </TouchableOpacity>

          {/* My QR Code Button */}
          <TouchableOpacity
            onPress={() => router.push("/my-qr")}
            style={{
              backgroundColor: "#DCD0FF",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <QrCode size={24} color="#1C1C1C" />
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: "#1C1C1C",
                marginLeft: 12,
              }}
            >
              رمز QR الخاص بي
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
