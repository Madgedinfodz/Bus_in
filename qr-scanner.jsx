import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Vibration } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ChevronLeft, QrCode, CheckCircle, XCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function QRScannerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastScanResult, setLastScanResult] = useState(null);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Scan QR mutation
  const scanMutation = useMutation({
    mutationFn: async (qrCode) => {
      const response = await fetch("/api/students/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qr_code: qrCode }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في معالجة رمز QR");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["busStatus"]);
      Vibration.vibrate(100);
      setLastScanResult(data);

      const actionText = data.action === "check_in" ? "دخل" : "خرج";
      Alert.alert(
        "تم بنجاح",
        `${data.student_name} ${actionText} ${data.action === "check_in" ? "إلى" : "من"} الباص\nالمحطة: ${data.station}`,
        [
          {
            text: "حسناً",
            onPress: () => {
              setScanned(false);
              setLastScanResult(null);
            },
          },
        ],
      );
    },
    onError: (error) => {
      Vibration.vibrate([100, 50, 100]);
      Alert.alert("خطأ", error.message, [
        {
          text: "حسناً",
          onPress: () => {
            setScanned(false);
            setLastScanResult(null);
          },
        },
      ]);
    },
  });

  const handleBarcodeScanned = ({ data }) => {
    if (scanned || scanMutation.isPending) return;

    setScanned(true);
    scanMutation.mutate(data);
  };

  if (!fontsLoaded) {
    return null;
  }

  if (!permission) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <StatusBar style="dark" />
      </View>
    );
  }

  if (!permission.granted) {
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
              مسح رمز QR
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <QrCode size={80} color="#9E9E9E" />
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 20,
              color: "#1C1C1C",
              marginTop: 24,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            نحتاج إلى إذن الكاميرا
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              color: "#9E9E9E",
              marginBottom: 32,
              textAlign: "center",
            }}
          >
            للسماح بمسح رموز QR الخاصة بالطلاب
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={{
              backgroundColor: "#2B2B2B",
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 32,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              منح الإذن
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 10,
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
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 24,
              color: "#FFFFFF",
              flex: 1,
            }}
          >
            مسح رمز QR
          </Text>
        </View>
      </View>

      {/* Camera */}
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        {/* Scanning Frame */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 250,
              height: 250,
              borderWidth: 3,
              borderColor: "#FFFFFF",
              borderRadius: 20,
              backgroundColor: "transparent",
            }}
          />
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 18,
              color: "#FFFFFF",
              marginTop: 24,
              textAlign: "center",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            ضع رمز QR داخل الإطار
          </Text>
        </View>
      </CameraView>

      {/* Bottom Info */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 20,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            سيتم تسجيل الدخول/الخروج تلقائياً
          </Text>
        </View>
      </View>
    </View>
  );
}
