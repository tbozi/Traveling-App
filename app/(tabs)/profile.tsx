import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../../context/AuthConText";

type ProfileMenuItemProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  onPress: () => void;
  isLogout?: boolean;
};

const ProfileMenuItem = ({ icon, title, onPress, isLogout = false }: ProfileMenuItemProps) => (
  <Pressable style={styles.menuItem} onPress={onPress}>
    <Feather name={icon} size={22} color={isLogout ? '#E53935' : '#333'} />
    <Text style={[styles.menuTitle, isLogout && styles.logoutText]}>{title}</Text>
    {!isLogout && (
      <Feather name="chevron-right" size={22} color="#888" />
    )}
  </Pressable>
);

const ProfileScreen = () => {
  const router = useRouter();
  const { userEmail } = useAuth(); // ✅ lấy email từ context

  const [userData, setUserData] = useState<{ fullname: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    console.log("Đang đăng xuất và điều hướng về (auth)/login...");
    router.replace("/(auth)/login");
  };

  // 🔹 Lấy thông tin user từ API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://68ff4999e02b16d1753d49db.mockapi.io/users");
        const users = await res.json();
        const currentUser = users.find((u: any) => u.email === userEmail);

        if (currentUser) {
          setUserData({
            fullname: currentUser.fullname || "Không có tên",
            email: currentUser.email || "",
          });
        } else {
          Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng!");
        }
      } catch (error) {
        console.error("Fetch user error:", error);
        Alert.alert("Lỗi mạng", "Không thể tải dữ liệu người dùng.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchUser();
  }, [userEmail]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header thông tin user */}
        <View style={styles.profileHeader}>
          <Image
            style={styles.avatar}
            source={{ uri: 'https://placehold.co/100x100/007AFF/FFFFFF?text=User' }}
          />
          <Text style={styles.name}>{userData?.fullname}</Text>
          <Text style={styles.email}>{userData?.email}</Text>

          <Pressable style={styles.editButton} onPress={() => router.push('/profile/edit')}>
            <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
          </Pressable>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <ProfileMenuItem icon="settings" title="Cài đặt" onPress={() => console.log('Tới Cài đặt')} />
          <ProfileMenuItem icon="bell" title="Thông báo" onPress={() => router.push('/notifications')} />
          <ProfileMenuItem icon="credit-card" title="Thanh toán" onPress={() => console.log('Tới Thanh toán')} />
          <ProfileMenuItem icon="help-circle" title="Trung tâm hỗ trợ" onPress={() => console.log('Tới Hỗ trợ')} />
        </View>

        {/* Đăng xuất */}
        <View style={styles.logoutContainer}>
          <ProfileMenuItem icon="log-out" title="Đăng xuất" onPress={handleLogout} isLogout />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f8',
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 10,
    marginTop: 15,
    overflow: 'hidden',
  },
  logoutText: {
    color: '#E53935',
    fontWeight: '600',
  },
});

export default ProfileScreen;
