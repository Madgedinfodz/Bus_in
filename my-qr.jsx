import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ChevronLeft, User } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

export default function MyQRScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [submittedStudentId, setSubmittedStudentId] = useState(null);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Fetch student data
  const {
    data: student,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student", submittedStudentId],
    queryFn: async () => {
      if (!submittedStudentId) return null;

      const response = await fetch(
        `/api/students?student_id=${submittedStudentId}`,
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في جلب معلومات الطالب");
      }
      return response.json();
    },
    enabled: !!submittedStudentId,
  });

  const handleSubmit = () => {
    if (!studentId.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال رقم الطالب");
      return;
    }
    setSubmittedStudentId(studentId.trim());
  };

  if (!fontsLoaded) {
    return null;
  }

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
            رمز QR الخاص بي
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
          {!submittedStudentId ? (
            // Student ID Input
            <View>
              <View
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <User size={20} color="#1C1C1C" />
                  <Text
                    style={{
                      fontFamily: "Inter_500Medium",
                      fontSize: 16,
                      color: "#1C1C1C",
                      marginLeft: 8,
                    }}
                  >
                    رقم الطالب
                  </Text>
                </View>

                <TextInput
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="أدخل رقم الطالب (مثال: STU001)"
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
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: "#2B2B2B",
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 16,
                      color: "#FFFFFF",
                    }}
                  >
                    عرض رمز QR
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: "#DCD0FF",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 16,
                    color: "#1C1C1C",
                    textAlign: "center",
                  }}
                >
                  💡 للحصول على رقم الطالب، تواصل مع إدارة الجامعة
                </Text>
              </View>
            </View>
          ) : isLoading ? (
            // Loading
            <View
              style={{
                backgroundColor: "#F4F4F4",
                borderRadius: 16,
                padding: 40,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 18,
                  color: "#1C1C1C",
                }}
              >
                جاري التحميل...
              </Text>
            </View>
          ) : error ? (
            // Error
            <View>
              <View
                style={{
                  backgroundColor: "#FFE5E5",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 18,
                    color: "#1C1C1C",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  ⚠️ خطأ
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                    color: "#1C1C1C",
                    textAlign: "center",
                  }}
                >
                  {error.message}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSubmittedStudentId(null);
                  setStudentId("");
                }}
                style={{
                  backgroundColor: "#2B2B2B",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  المحاولة مرة أخرى
                </Text>
              </TouchableOpacity>
            </View>
          ) : student ? (
            // QR Code Display
            <View>
              {/* Student Info */}
              <View
                style={{
                  backgroundColor: "#DCD0FF",
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
                    marginBottom: 8,
                  }}
                >
                  الاسم
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 28,
                    color: "#1C1C1C",
                    marginBottom: 16,
                  }}
                >
                  {student.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 16,
                    color: "#9E9E9E",
                    marginBottom: 8,
                  }}
                >
                  رقم الطالب
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 20,
                    color: "#1C1C1C",
                  }}
                >
                  {student.student_id}
                </Text>
              </View>

              {/* Status */}
              <View
                style={{
                  backgroundColor: student.is_in_bus ? "#C9F8D3" : "#F4F4F4",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 20,
                    color: "#1C1C1C",
                    textAlign: "center",
                  }}
                >
                  {student.is_in_bus ? "🚌 داخل الباص" : "📍 خارج الباص"}
                </Text>
              </View>

              {/* QR Code */}
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 32,
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "#E5E5E5",
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 20,
                    color: "#1C1C1C",
                    marginBottom: 24,
                    textAlign: "center",
                  }}
                >
                  امسح هذا الرمز عند الدخول/الخروج
                </Text>
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: 20,
                    borderRadius: 12,
                  }}
                >
                  <Image
                    source={{
                      uri: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(student.qr_code)}`,
                    }}
                    style={{ width: 220, height: 220 }}
                    contentFit="contain"
                  />
                </View>
              </View>

              {/* Change Student Button */}
              <TouchableOpacity
                onPress={() => {
                  setSubmittedStudentId(null);
                  setStudentId("");
                }}
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 16,
                    color: "#1C1C1C",
                  }}
                >
                  تغيير الطالب
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
