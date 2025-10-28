import { Feather } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditProfileScreen = () => {
  const router = useRouter();

  // State (trạng thái) để lưu trữ thông tin form
  // Trong ứng dụng thật, bạn sẽ lấy giá trị này từ API hoặc state quản lý user
  const [name, setName] = useState('Tên Của Bạn');
  const [email, setEmail] = useState('your.email@example.com');
  const [phone, setPhone] = useState('090xxxxxxx');
  const [avatarUri, setAvatarUri] = useState('https://placehold.co/100x100/007AFF/FFFFFF?text=User');

  const handleSaveChanges = () => {
    // --- Logic để lưu data (gọi API, cập nhật state...) ---
    console.log('Đã lưu các thay đổi:', { name, email, phone });
    
    // Sau khi lưu, tự động quay lại màn hình trước đó
    router.back();
  };

  const handleChoosePhoto = () => {
    // --- Logic để mở thư viện ảnh (dùng ImagePicker) ---
    console.log('Mở thư viện ảnh...');
    // Ví dụ set ảnh mới (tạm thời)
    setAvatarUri('https://placehold.co/100x100/4CAF50/FFFFFF?text=New');
  };

  return (
    // Chúng ta dùng `edges` để safe area chỉ áp dụng cho đáy, 
    // vì header của Stack Navigator đã xử lý phần trên rồi.
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Sử dụng Stack.Screen để tùy chỉnh header.
        Expo Router sẽ tự động thêm nút "Back" (Quay lại)
      */}
      <Stack.Screen 
        options={{ 
          title: 'Chỉnh sửa hồ sơ',
          headerTitleAlign: 'center',
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 1. Phần Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: avatarUri }}
          />
          <TouchableOpacity style={styles.changeAvatarButton} onPress={handleChoosePhoto}>
            <Feather name="camera" size={16} color="#fff" />
            <Text style={styles.changeAvatarText}>Thay đổi</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Phần Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Họ và Tên</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập họ và tên"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false} // Thường email không cho đổi
            style={[styles.input, styles.inputDisabled]} // Style khác
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
        </View>

        {/* 3. Nút Lưu */}
        <Pressable style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  // Avatar
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 5,
    right: '30%', // Căn giữa tương đối
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  changeAvatarText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  // Form
  formContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f4f4f8',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee'
  },
  inputDisabled: {
    backgroundColor: '#f9f9f9',
    color: '#aaa',
  },
  // Button
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
