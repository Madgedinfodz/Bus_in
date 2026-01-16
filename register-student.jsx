import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
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
import { ChevronLeft, UserPlus, User, Hash } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

export default function RegisterStudentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Register student mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          student_id: studentId.trim(),
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "فشل في تسجيل الطالب");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["students"]);
      Alert.alert(
        "تم التسجيل بنجاح! ✅",
        `تم تسجيل الطالب ${data.name}\nرقم الطالب: ${data.student_id}\n\nيمكن للطالب الآن استخدام رقمه للحصول على رمز QR`,
        [
          {
            text: "حسناً",
            onPress: () => {
              setName("");
              setStudentId("");
            },
          },
        ],
      );
    },
    onError: (error) => {
      Alert.alert("خطأ", error.message);
    },
  });

  const handleRegister = () => {
    if (!name.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال اسم الطالب");
      return;
    }
    if (!studentId.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال رقم الطالب");
      return;
    }
    registerMutation.mutate();
  };

  if (!fontsLoaded) {
    return null;
  }

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
              تسجيل طالب جديد
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
            {/* Info Card */}
            <View
              style={{
                backgroundColor: "#C9F8D3",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: "#1C1C1C",
                  marginBottom: 8,
                }}
              >
                💡 ملاحظة للإدارة
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  color: "#1C1C1C",
                  lineHeight: 24,
                }}
              >
                بعد تسجيل الطالب، سيحصل على رمز QR فريد يمكنه استخدامه عند
                الدخول/الخروج من الباص
              </Text>
            </View>

            {/* Form */}
            <View
              style={{
                backgroundColor: "#F4F4F4",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
              }}
            >
              {/* Student Name */}
              <View style={{ marginBottom: 20 }}>
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
                    اسم الطالب
                  </Text>
                </View>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="أدخل الاسم الكامل"
                  placeholderTextColor="#9E9E9E"
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                    color: "#1C1C1C",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    textAlign: "right",
                  }}
                />
              </View>

              {/* Student ID */}
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Hash size={20} color="#1C1C1C" />
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
                  placeholder="مثال: STU001"
                  placeholderTextColor="#9E9E9E"
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                    color: "#1C1C1C",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    textAlign: "right",
                  }}
                />
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={registerMutation.isPending}
              style={{
                backgroundColor: "#2B2B2B",
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                opacity: registerMutation.isPending ? 0.5 : 1,
              }}
            >
              <UserPlus size={24} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 18,
                  color: "#FFFFFF",
                  marginLeft: 12,
                }}
              >
                {registerMutation.isPending
                  ? "جاري التسجيل..."
                  : "تسجيل الطالب"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
