import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity , Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';

export default function ChangePassword({ navigation }) {
    const [email, setEmail] = useState('');

    const changePassword = async () => {
      try {
        const formattedEmail = encodeURIComponent(email);
        const response = await axios.post(`http://mkristina9-001-site1.ftempurl.com/resetPassword?Email=${formattedEmail}`);
        console.log(response.data);
      } catch (error) {
        if (error.response.status === 404) {
          Alert.alert('Korisnik sa datom email adresom nije pronađen.');
        } else {
          console.error('Greška prilikom slanja zahteva:', error);
        }
      }
    };

    const confirmSendEmail = () => {
      Alert.alert(
        'Potvrda slanja emaila',
        `Da li ste sigurni da želite poslati email za resetovanje lozinke na adresu: ${email}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => changePassword(),
          },
        ]
      );
    };

    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                    navigation.navigate('Login');
                    }}>
                    <View style={styles.backButtonCircle}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerText}>LOZINKA</Text>
            </View>

            <View style={styles.content}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Zaboravljena lozinka?</Text>
                <Text style={{fontSize:15, marginTop:15}}>Upiši svoju e-mail adresu na koju ćemo ti poslati upute za promenu lozinke.</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E-mail adresa"
                    value={email}
                    onChangeText={(text) => {
                    setEmail(text);
                    }}
                />
                <TouchableOpacity style={styles.button}
                                  onPress={confirmSendEmail}>
                    <Text style={{color:'white'}}>Zatraži novu lozinku</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
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
    fontWeight: '300',
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
  content:{
    height:'100%',
    padding:30,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    borderRadius:30,
    paddingLeft: 10,
    marginTop:30
  },
  button:{
    backgroundColor:'#0e573a',
    width:180,
    padding:15,
    borderRadius:100,
    marginTop:20
  }

});