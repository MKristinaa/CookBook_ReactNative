import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity , KeyboardAvoidingView, 
         TouchableWithoutFeedback, Keyboard, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const clearError = () => {
    setLoginError('');
  };

  const storeUserData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Greška prilikom upisa u AsyncStorage za ključ ${key}:`, error);
    }
  };

  const getInfo = async (token) => {
    try {
      const response = await fetch('http://mkristina9-001-site1.ftempurl.com/getInfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userInfo = await response.json();
        Object.keys(userInfo).forEach(async (key) => {
          await storeUserData(key, userInfo[key]);
        });
      } else {
        console.log('Došlo je do greške prilikom dobijanja informacija o korisniku.');
      }
    } catch (error) {
      console.error('Došlo je do greške prilikom dobijanja informacija o korisniku:', error);
    }
  };

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setLoginError('Molimo vas da unesete korisničko ime ili email i lozinku.');
        return;
      }
  
      const response = await fetch('http://mkristina9-001-site1.ftempurl.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          Alert.alert('Morate prvo verifikovati Vaš nalog na email!');
        } else
        {
          setLoginError(errorData || 'Došlo je do greške prilikom logovanja.');
        }
        return;
      }
  
      const responseData = await response.json();
  
      if (responseData === null) {
        setLoginError('Pogrešno ste uneli korisničko ime ili lozinku.');
      } else {
        await storeUserData('userToken', responseData.token);
        await storeUserData('loggedInUser', JSON.stringify(responseData));
        await getInfo(responseData.token);
  
        navigation.navigate('Profile');
      }
    } catch (error) {
      setLoginError('Došlo je do greške prilikom logovanja.');
    }
  };

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
          <Text style={styles.headerText}>Prijavi se</Text>
          
        </View>
       
       <View style={styles.content}>
          <TextInput
              style={styles.input}
              placeholder="Korisničko ime ili Email"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                clearError();
              }}
            />
           <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Lozinka"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearError();
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordIcon}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="gray" />
              </TouchableOpacity>
            </View>
          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Prijavi se</Text>
          </TouchableOpacity>

          <View style={styles.register}>
            <Text style={{color:'gray'}}>Niste registrovani?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{paddingLeft:5, textDecorationLine: 'underline'}}>Registruj se</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{marginTop:25}}
                            onPress={() => navigation.navigate('ChangePassword')}>
              <Text>Zaboravljena lozinka?</Text>
            </TouchableOpacity>
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
  input: {
    height: 45,
    width: '100%',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    borderRadius:10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  content: {
    justifyContent:'center',
    alignItems:'center',
    paddingTop:60,
    paddingHorizontal:20,
  },
  button: {
    width:'100%',
    backgroundColor: '#0e573a',
    paddingVertical: 15,
    padding:15,
    borderRadius: 50,
    marginTop:30
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  register: {
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    marginTop:20
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
