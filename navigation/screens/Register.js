import React, { useState } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, StyleSheet, Text, Image, Alert ,KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; 
import { storage } from '../../config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

import defaultImage from '../../assets/profile4.jpg';

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [requiredFields, setRequiredFields] = useState([]);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    setUploading(true);

    try {
      let blob;
      if (selectedImage.startsWith('http')) {
        const response = await fetch(selectedImage);
        blob = await response.blob();
      } else {
        const localUri = selectedImage;
        blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', localUri, true);
          xhr.send(null);
        });
      }

      const filename = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `profile_photos/${filename}`);

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      setUploading(false);
      return downloadURL; 
    } catch (error) {
      console.error(error);
      setUploading(false);
      throw error; 
    }
  };

  const handleRegister = async () => {
    try {
      const required = [];
      if (!firstName.trim()) {
        required.push('Ime');
      }
      if (!lastName.trim()) {
        required.push('Prezime');
      }
      if (!username.trim()) {
        required.push('Korisničko ime');
      }
      if (!password.trim()) {
        required.push('Lozinka');
      }
      if (!email.trim()) {
        required.push('Email');
      }

      if (required.length > 0) {
        setRequiredFields(required);
        return;
      }
    
      let imageUrl = '';

      if (selectedImage) {
        imageUrl = await uploadImage();
      }

      const user = {
        name: firstName,
        lastName: lastName,
        image: imageUrl,
        username: username,
        password: password,
        email:email,
        verified: false
      };
        const response = await axios.post('http://mkristina9-001-site1.ftempurl.com/register', user);
        console.log('User registered successfully:', response.data);
        

      setFirstName('');
      setLastName('');
      setUsername('');
      setPassword('');
      setEmail('');
      setSelectedImage(null);

      Alert.alert('Potvrdite vasu verifikaciju na email!');

    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data === 'Korisnik već postoji') {
          setUsernameError('Korisnik već postoji');
        } else if (error.response.data === 'Email već postoji') {
          setEmailError('Email već postoji');
        } else {
          console.error('Error registering user:', error);
        }
      } else {
        console.error('Error registering user:', error);
      }
    };
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
      
        <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.navigate('Profile');
              }}>
              <View style={styles.backButtonCircle}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerText}>Registruj se</Text>
        </View>

        <View style={styles.first}>
          <TouchableOpacity onPress={pickImage}>
            {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              ) : (
                <Image source={defaultImage} style={styles.placeholderImage} />
              )}
          </TouchableOpacity>
          <TextInput
            style={[ styles.input, requiredFields.includes('Ime') && { borderColor: 'red' }]}
            placeholder="Ime"
            placeholderTextColor={'gray'}
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              if (requiredFields.includes('Ime')) {
                setRequiredFields(requiredFields.filter(field => field !== 'Ime'));
              }
            }}
          />
          {requiredFields.includes('Ime') && <Text style={{ color: 'red' }}>Ime je neophodno!</Text>}

          <TextInput
            style={[ styles.input, requiredFields.includes('Prezime') && { borderColor: 'red', marginTop:10 }]}
            placeholder="Prezime"
            placeholderTextColor={'gray'}
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              if (requiredFields.includes('Prezime')) {
                setRequiredFields(requiredFields.filter(field => field !== 'Prezime'));
              }
            }}
          />
          {requiredFields.includes('Prezime') && <Text style={{ color: 'red'}}>Prezime je neophodno!</Text>}

          <TextInput
            style={[
              styles.input,
              requiredFields.includes('Email') && { borderColor: 'red', marginTop: 10 },
              emailError && { borderColor: 'red' },
            ]}
            placeholder="Email"
            placeholderTextColor={'gray'}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (text.trim().length > 0) {
                setRequiredFields(requiredFields.filter(field => field !== 'Email'));
                setEmailError('');
              } else {
                setRequiredFields([...requiredFields, 'Email']);
              }
            }}
          />
          {requiredFields.includes('Email') && <Text style={{ color: 'red' }}>Email je neophodan!</Text>}
          {emailError ? <Text style={{ color: 'red', marginBottom: 10 }}>{emailError}</Text> : null}

          <TextInput
            style={[ styles.input, requiredFields.includes('Korisničko ime') && { borderColor: 'red',marginTop:10 },
                     usernameError && { borderColor: 'red' }]}
            placeholder="Korisničko ime"
            placeholderTextColor={'gray'}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (text.trim().length > 0) {
                setRequiredFields(requiredFields.filter(field => field !== 'Korisničko ime'));
                setUsernameError('');
              } else {
                setRequiredFields([...requiredFields, 'Korisničko ime']);
              }
            }}
          />
          {requiredFields.includes('Korisničko ime') && <Text style={{ color: 'red', marginBottom:10 }}>Korisničko ime je neophodno!</Text>}
          {usernameError ? <Text style={{ color: 'red', marginBottom: 10 }}>{usernameError}</Text> : null}

        <View style={styles.passwordContainer}> 
          <TextInput
            style={[
              styles.input,
              requiredFields.includes('Lozinka') && { borderColor: 'red' },
            ]}
            placeholder="Lozinka"
            placeholderTextColor={'gray'}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (text.trim().length >= 8 || text.trim().length === 0) {
                setRequiredFields(requiredFields.filter((field) => field !== 'Lozinka'));
              } else {
                if (!requiredFields.includes('Lozinka')) {
                  setRequiredFields([...requiredFields, 'Lozinka']);
                }
              }
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordIcon}
          >
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="gray" />
          </TouchableOpacity></View>
          {requiredFields.includes('Lozinka') && (
            <Text style={{ color: 'red', marginBottom: 10 }}>
              Lozinka mora imati najmanje 8 karaktera!
            </Text>
          )}

          <TouchableOpacity onPress={handleRegister} style={styles.button}>
                <Text style={{color: 'white', textAlign:'center'}}>Registruj se</Text>
          </TouchableOpacity>

          <View style={styles.login}>
            <Text style={{color:'gray'}}>Već ste registrovani?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{paddingLeft:5, textDecorationLine: 'underline'}}>Prijavi se</Text>
            </TouchableOpacity>
          </View>
          
        </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 60,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  backButtonCircle: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  first: {
    justifyContent:'centar',
    alignItems:'center',
    marginTop:50,
  },
  input: {
    height: 45,
    width: '90%',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    borderRadius:10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  text: {
    fontSize: 20,
  },
  selectedImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 100,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 100,
  },
  button: {
    borderWidth: 1,
    width:'90%',
    backgroundColor: '#0e573a',
    borderWidth:0,
    borderRadius: 50,
    padding: 15,
    marginTop: 60,
  },
  login: {
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    marginTop:20
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 40,
  },
  passwordIcon: {
    position: 'absolute',
    right: 10,
    top:10
  },
});
