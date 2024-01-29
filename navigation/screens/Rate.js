import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Rating } from 'react-native-ratings';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Rate({ navigation, route }) {
  const [rating, setRating] = useState(0);

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = async () => {
    try {
      const recipeId = route.params.recipeId;
      const userId = await AsyncStorage.getItem('nameid');
  
      const ratingDto = {
        RecipeId: recipeId,
        UserId: userId,
        Rating: rating,
      };
  
      const response = await axios.post('http://mkristina9-001-site1.ftempurl.com/api/Rating/AddRating', ratingDto);
  
      if (response.status === 200) {
        Alert.alert('Uspešno ste dali ocenu', '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack(); 
            },
          },
        ]);
      } else {
        Alert.alert('Došlo je do greške prilikom davanja ocene');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === "Vec ste dali ocenu za ovaj recept.") {
        Alert.alert('Već ste dali ocenu za ovaj recept.', '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack(); 
            },
          },
        ]);
      } else {
        console.error('Greška prilikom slanja ocene:', error);
        Alert.alert('Došlo je do greške prilikom slanja ocene');
      }
    }
  };
  

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => { navigation.goBack(); }}
        >
          <View style={styles.backButtonCircle}>
            <Text style={{ color: 'tomato', fontSize: 15 }}>Otkaži</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.headerText}>Oceni</Text>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitRating} 
        >
          <View style={styles.backButtonCircle}>
            <Text style={{ color: 'gray', fontSize: 16 }}>Potvrdi</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={{ textAlign: 'center', paddingTop: 50, fontSize: 20, fontWeight: 'bold', marginBottom: 50 }}>Dajte svoju ocenu ovde! </Text>

      <Rating
        type="star"
        startingValue={rating}
        imageSize={30}
        onFinishRating={handleRating}
        showRating
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonCircle: {
    backgroundColor: 'white',
    width: 60,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
