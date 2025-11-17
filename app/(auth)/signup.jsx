// import { Image } from "expo-image";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import styles from "../../styles/Signup.styles";
// import { Ionicons } from "@expo/vector-icons";
// import COLORS from "../../constants/colors";
// import { useState } from "react";
// import { Link } from "expo-router";
// import SafeScreen from "../../components/SafeScreen";
// import { Picker } from "@react-native-picker/picker";
// import * as ImagePicker from "expo-image-picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { auth } from "../../Repositories/auth";

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     name: "",
//     lastName: "",
//     email: "",
//     password: "",
//     cnicNo: "",
//     dob: "",
//     gender: "",
//     phone: "",
//     profileImage: null,
//     cnicFront: "",
//     cnicBack: "",
//   });
//   const [showDOBPicker, setShowDOBPicker] = useState(false);
//   const [dobDate, setDobDate] = useState(formData.dob ? new Date(formData.dob) : new Date());
//   console.log("formData==>", formData);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (key, value) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       alert("Permission to access media library is required!");
//       return;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: false,
//       aspect: [1, 1],
//       quality: 1,
//     });
//     if (!result.canceled) {
//       handleChange("profileImage", result.assets[0].uri);
//     }
//   };
  
//  const handleSignup = async () => {
//     setIsLoading(true);

//     try {
//       const data = new FormData();

//       // TEXT FIELDS
//       data.append("firstname", formData.name);
//       data.append("lastname", formData.lastName);
//       data.append("email", formData.email);
//       data.append("password", formData.password);
//       data.append("cnic_no", formData.cnicNo);
//       data.append("date_of_birth", formData.dob);
//       data.append("gender", formData.gender);
//       data.append("phone", formData.phone);

//       // FILE FIELDS
//       if (formData.profileImage) {
//         data.append("profile_image", {
//           uri: formData.profileImage,
//           name: "profile.jpg",
//           type: "image/jpeg",
//         });
//       }
//       if (formData.cnicFront) {
//         data.append("cnic_front", {
//           uri: formData.cnicFront,
//           name: "cnic_front.jpg",
//           type: "image/jpeg",
//         });
//       }
//       if (formData.cnicBack) {
//         data.append("cnic_back", {
//           uri: formData.cnicBack,
//           name: "cnic_back.jpg",
//           type: "image/jpeg",
//         });
//       }

//       const res = await auth.signUp(data);
//       console.log("Signup Success:", res.data);

//     } catch (error) {
//       console.log("Signup Error:", error);
//     }

//     setTimeout(() => setIsLoading(false), 1000);
//   };


//   return (
//     <SafeScreen>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           <View style={styles.container}>
//             <View style={styles.card}>
//               {/* HEADER */}
//               <View style={styles.header}>
//                 <Text style={styles.title}>Crime Report🧾</Text>
//                 <Text style={styles.subtitle}>Share your favorite reads</Text>
//               </View>

//               <View style={styles.formContainer}>
//                 {/* Profile Image */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Profile Image</Text>
//                   <TouchableOpacity
//                     style={styles.imagePickerContainer}
//                     onPress={pickImage}
//                   >
//                     {formData.profileImage ? (
//                       <Image
//                         source={{ uri: formData.profileImage }}
//                         style={styles.profileImage}
//                       />
//                     ) : (
//                       <Ionicons
//                         name="camera-outline"
//                         size={40}
//                         color={COLORS.placeholderText}
//                         style={styles.cameraIcon}
//                       />
//                     )}
//                   </TouchableOpacity>
//                   <Text style={styles.imagePickerText}>
//                     {formData.profileImage
//                       ? "Tap to change image"
//                       : "Tap to upload image"}
//                   </Text>
//                 </View>

//                 {/* Name */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Name</Text>
//                   <View style={styles.inputContainer}>
//                     <Ionicons
//                       name="person-outline"
//                       size={20}
//                       color={COLORS.primary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter Your Name"
//                       placeholderTextColor={COLORS.placeholderText}
//                       value={formData.name}
//                       onChangeText={(value) => handleChange("name", value)}
//                     />
//                   </View>
//                 </View>

//                 {/* Last Name */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Last Name</Text>
//                   <View style={styles.inputContainer}>
//                     <Ionicons
//                       name="person-outline"
//                       size={20}
//                       color={COLORS.primary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter Your Last Name"
//                       placeholderTextColor={COLORS.placeholderText}
//                       value={formData.lastName}
//                       onChangeText={(value) => handleChange("lastName", value)}
//                     />
//                   </View>
//                 </View>

//                 {/* Email */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Email</Text>
//                   <View style={styles.inputContainer}>
//                     <Ionicons
//                       name="mail-outline"
//                       size={20}
//                       color={COLORS.primary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter Your Email"
//                       placeholderTextColor={COLORS.placeholderText}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                       value={formData.email}
//                       onChangeText={(value) => handleChange("email", value)}
//                     />
//                   </View>
//                 </View>

//                 {/* Password */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Password</Text>
//                   <View style={styles.inputContainer}>
//                     <Ionicons
//                       name="lock-closed-outline"
//                       size={20}
//                       color={COLORS.primary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter Your Password"
//                       placeholderTextColor={COLORS.placeholderText}
//                       secureTextEntry
//                       value={formData.password}
//                       onChangeText={(value) => handleChange("password", value)}
//                     />
//                   </View>
//                 </View>

//                 {/* CNIC No */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>CNIC No</Text>
//                   <View style={styles.inputContainer}>
//                     <Ionicons
//                       name="card-outline"
//                       size={20}
//                       color={COLORS.primary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter Your CNIC Number"
//                       placeholderTextColor={COLORS.placeholderText}
//                       keyboardType="numeric"
//                       value={formData.cnicNo}
//                       onChangeText={(value) => handleChange("cnicNo", value)}
//                     />
//                   </View>
//                 </View>

//                 {/* DOB */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Date of Birth</Text>

//                   <TouchableOpacity onPress={() => setShowDOBPicker(true)}>
//                     <View style={styles.inputContainer}>
//                       <Ionicons
//                         name="calendar-outline"
//                         size={20}
//                         color={COLORS.primary}
//                         style={styles.inputIcon}
//                       />
//                       <Text
//                         style={[
//                           styles.input,
//                           {
//                             color: formData.dob
//                               ? "#000"
//                               : COLORS.placeholderText,
//                           },
//                         ]}
//                       >
//                         {formData.dob
//                           ? formData.dob
//                           : "Enter Your Date of Birth"}
//                       </Text>
//                     </View>
//                   </TouchableOpacity>

//                   {showDOBPicker && (
//                     <DateTimePicker
//                       value={dobDate}
//                       mode="date"
//                       display="default"
//                       maximumDate={new Date()} // DOB future date nahi ho sakta
//                       onChange={(event, selectedDate) => {
//                         setShowDOBPicker(Platform.OS === "ios"); // iOS pe picker open rakho
//                         if (selectedDate) {
//                           setDobDate(selectedDate);
//                           handleChange(
//                             "dob",
//                             selectedDate.toISOString().split("T")[0]
//                           ); // YYYY-MM-DD
//                         }
//                       }}
//                     />
//                   )}
//                 </View>

//                 {/* Gender */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Gender</Text>
//                   <View
//                     style={[styles.inputContainer, { paddingHorizontal: 0 }]}
//                   >
//                     <Ionicons
//                       name="male-female-outline"
//                       size={20}
//                       color={COLORS.primary}
//                       style={styles.inputIcon}
//                     />
//                     <View style={{ flex: 1 }}>
//                       <Picker
//                         selectedValue={formData.gender}
//                         onValueChange={(value) => handleChange("gender", value)}
//                         style={styles.picker}
//                       >
//                         <Picker.Item label="Select Gender" value="" />
//                         <Picker.Item label="Male" value="male" />
//                         <Picker.Item label="Female" value="female" />
//                         <Picker.Item label="Other" value="other" />
//                       </Picker>
//                     </View>
//                   </View>
//                 </View>

//                 {/* Mobile Number */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Mobile Number</Text>
//                   <View style={styles.inputContainer}>
//                     <Ionicons
//                       name="call-outline"
//                       size={20}
//                       color={COLORS.primary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter Your Mobile Number"
//                       placeholderTextColor={COLORS.placeholderText}
//                       keyboardType="phone-pad"
//                       value={formData.phone}
//                       onChangeText={(value) => handleChange("phone", value)}
//                     />
//                   </View>
//                 </View>

//                 {/* CNIC Front */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>CNIC Front</Text>
//                   <TouchableOpacity
//                     style={styles.imagePickerContainer}
//                     onPress={async () => {
//                       const { status } =
//                         await ImagePicker.requestMediaLibraryPermissionsAsync();
//                       if (status !== "granted") {
//                         alert(
//                           "Permission to access media library is required!"
//                         );
//                         return;
//                       }
//                       const result = await ImagePicker.launchImageLibraryAsync({
//                         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                         allowsEditing: true,
//                         aspect: [4, 3],
//                         quality: 1,
//                       });
//                       if (!result.canceled) {
//                         handleChange("cnicFront", result.assets[0].uri);
//                       }
//                     }}
//                   >
//                     {formData.cnicFront ? (
//                       <Image
//                         source={{ uri: formData.cnicFront }}
//                         style={styles.profileImage}
//                       />
//                     ) : (
//                       <Ionicons
//                         name="image-outline"
//                         size={40}
//                         color={COLORS.placeholderText}
//                         style={styles.cameraIcon}
//                       />
//                     )}
//                   </TouchableOpacity>
//                   <Text style={styles.imagePickerText}>
//                     {formData.cnicFront
//                       ? "Tap to change image"
//                       : "Tap to upload CNIC front"}
//                   </Text>
//                 </View>

//                 {/* CNIC Back */}
//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>CNIC Back</Text>
//                   <TouchableOpacity
//                     style={styles.imagePickerContainer}
//                     onPress={async () => {
//                       const { status } =
//                         await ImagePicker.requestMediaLibraryPermissionsAsync();
//                       if (status !== "granted") {
//                         alert(
//                           "Permission to access media library is required!"
//                         );
//                         return;
//                       }
//                       const result = await ImagePicker.launchImageLibraryAsync({
//                         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                         allowsEditing: true,
//                         aspect: [4, 3],
//                         quality: 1,
//                       });
//                       if (!result.canceled) {
//                         handleChange("cnicBack", result.assets[0].uri);
//                       }
//                     }}
//                   >
//                     {formData.cnicBack ? (
//                       <Image
//                         source={{ uri: formData.cnicBack }}
//                         style={styles.profileImage}
//                       />
//                     ) : (
//                       <Ionicons
//                         name="image-outline"
//                         size={40}
//                         color={COLORS.placeholderText}
//                         style={styles.cameraIcon}
//                       />
//                     )}
//                   </TouchableOpacity>
//                   <Text style={styles.imagePickerText}>
//                     {formData.cnicBack
//                       ? "Tap to change image"
//                       : "Tap to upload CNIC back"}
//                   </Text>
//                 </View>

//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={handleSignup}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <ActivityIndicator size="small" color={COLORS.white} />
//                   ) : (
//                     <Text style={styles.buttonText}>Sign Up</Text>
//                   )}
//                 </TouchableOpacity>

//                 {/* Footer */}
//                 <View style={styles.footer}>
//                   <Text style={styles.footerText}>
//                     Already have an account?
//                   </Text>
//                   <Link href="/(auth)" asChild>
//                     <TouchableOpacity>
//                       <Text style={styles.link}>Sign In</Text>
//                     </TouchableOpacity>
//                   </Link>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeScreen>
//   );
// }




import { Image } from "expo-image";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import styles from "../../styles/Signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useState } from "react";
import { Link } from "expo-router";
import SafeScreen from "../../components/SafeScreen";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth } from "../../Repositories/auth";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    cnicNo: "",
    dob: "",
    gender: "",
    phone: "",
    profileImage: null,
    cnicFront: null,
    cnicBack: null,
  });

  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [dobDate, setDobDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------------
  // Image Picker Function
  // ---------------------
  const pickFile = async (field) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.image], // FIXED
      quality: 1,
    });

    if (!result.canceled) {
      handleChange(field, result.assets[0].uri);
    }
  };
  // ---------------------
  // Handle Signup Submit
  // ---------------------
  const handleSignup = async () => {
    setIsLoading(true);

    try {
      const data = new FormData();
      // Text Fields
      data.append("firstname", formData.name);
      data.append("lastname", formData.lastName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("cnic_no", formData.cnicNo);
      data.append("date_of_birth", formData.dob);
      data.append("gender", formData.gender);
      data.append("phone", formData.phone);

      // File Fields
      const appendFile = (key, uri) => {
        if (uri) {
          data.append(key, {
            uri,
            name: `${key}.jpg`,
            type: "image/jpeg",
          });
        }
      };
      
      appendFile("profile_image", formData.profileImage);
      appendFile("cnic_front", formData.cnicFront);
      appendFile("cnic_back", formData.cnicBack);

      const res = await auth.signUp(data);
      console.log("✔ Signup Success:", res.data);

    } catch (error) {
      console.log("❌ Signup Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.card}>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Crime Report 🧾</Text>
                <Text style={styles.subtitle}>Register Yourself</Text>
              </View>

              <View style={styles.formContainer}>

                {/* ---------------- PROFILE IMAGE ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Profile Image</Text>
                  <TouchableOpacity
                    style={styles.imagePickerContainer}
                    onPress={() => pickFile("profileImage")}
                  >
                    {formData.profileImage ? (
                      <Image
                        source={{ uri: formData.profileImage }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Ionicons
                        name="camera-outline"
                        size={40}
                        color={COLORS.placeholderText}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                {/* ---------------- CNIC FRONT ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CNIC Front</Text>
                  <TouchableOpacity
                    style={styles.imagePickerContainer}
                    onPress={() => pickFile("cnicFront")}
                  >
                    {formData.cnicFront ? (
                      <Image
                        source={{ uri: formData.cnicFront }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Ionicons
                        name="id-card-outline"
                        size={40}
                        color={COLORS.placeholderText}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                {/* ---------------- CNIC BACK ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CNIC Back</Text>
                  <TouchableOpacity
                    style={styles.imagePickerContainer}
                    onPress={() => pickFile("cnicBack")}
                  >
                    {formData.cnicBack ? (
                      <Image
                        source={{ uri: formData.cnicBack }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Ionicons
                        name="id-card-outline"
                        size={40}
                        color={COLORS.placeholderText}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                {/* ---------------- NAME ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(v) => handleChange("name", v)}
                    placeholder="Enter First Name"
                  />
                </View>

                {/* ---------------- LAST NAME ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(v) => handleChange("lastName", v)}
                    placeholder="Enter Last Name"
                  />
                </View>

                {/* ---------------- EMAIL ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    keyboardType="email-address"
                    onChangeText={(v) => handleChange("email", v)}
                    placeholder="Enter Email"
                  />
                </View>

                {/* ---------------- PASSWORD ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.password}
                    secureTextEntry
                    onChangeText={(v) => handleChange("password", v)}
                    placeholder="Enter Password"
                  />
                </View>

                {/* ---------------- CNIC NO ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CNIC No</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.cnicNo}
                    keyboardType="numeric"
                    onChangeText={(v) => handleChange("cnicNo", v)}
                    placeholder="Enter CNIC Number"
                  />
                </View>

                {/* ---------------- PHONE ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    keyboardType="phone-pad"
                    onChangeText={(v) => handleChange("phone", v)}
                    placeholder="Enter Phone Number"
                  />
                </View>

                {/* ---------------- GENDER PICKER ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Gender</Text>
                  <Picker
                    selectedValue={formData.gender}
                    onValueChange={(v) => handleChange("gender", v)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                  </Picker>
                </View>

                {/* ---------------- DOB PICKER ---------------- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Date of Birth</Text>

                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDOBPicker(true)}
                  >
                    <Text>
                      {formData.dob ? formData.dob : "Select Date of Birth"}
                    </Text>
                  </TouchableOpacity>

                  {showDOBPicker && (
                    <DateTimePicker
                      value={dobDate}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        setShowDOBPicker(false);
                        if (selectedDate) {
                          const formatted =
                            selectedDate.toISOString().split("T")[0];
                          handleChange("dob", formatted);
                          setDobDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </View>

                {/* ---------------- BUTTON ---------------- */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSignup}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>

                {/* ---------------- FOOTER ---------------- */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account?</Text>
                  <Link href="/(auth)" asChild>
                    <TouchableOpacity>
                      <Text style={styles.link}>Sign In</Text>
                    </TouchableOpacity>
                  </Link>
                </View>

              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
