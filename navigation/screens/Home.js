import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [storedUserId, setStoredUserId] = useState(null);


  const getUserData = async () => {
    fetchRecipes();
    getStoredUserId();
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [])
  );

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://mkristina9-001-site1.ftempurl.com/api/Recipe/GetAllRecipes');
      const reversedRecipes = response.data.reverse(); 
      setRecipes(reversedRecipes);
      
      const initialUsersData = {};
      response.data.forEach((recipe) => {
        initialUsersData[recipe.id] = {};
      });
      setUsersData(initialUsersData);
    } catch (error) {
      console.error('Došlo je do greške prilikom dohvatanja recepata:', error);
    }
  };

  const fetchUserDataByRecipeId = async (recipeId) => {
    try {
      const response = await axios.get(`http://mkristina9-001-site1.ftempurl.com/api/Recipe/GetUserByRecipeId/${recipeId}`);
      setUsersData((prevUsersData) => ({
        ...prevUsersData,
        [recipeId]: response.data,
      }));
    } catch (error) {
      console.error('Došlo je do greške prilikom dohvatanja podataka o korisniku:', error);
    }
  };

  useEffect(() => {
    recipes.forEach((recipe) => {
      fetchUserDataByRecipeId(recipe.id);
    });
  }, [recipes]);

  const getStoredUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('nameid');
      setStoredUserId(userId);
    } catch (error) {
      console.error('Greška prilikom dohvatanja storedUserId:', error);
    }
  };


  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Image source={require('../../assets/jelo2.jpg')} style={styles.logoImage} />

        <View style={{justifyContent:'center', backgroundColor:'#FDF5E6', margin:15, height:270,
                      borderRadius:20, marginTop:-50, marginBottom:60}}>
            <Text style={{fontSize:38, fontFamily:'Palatino', paddingLeft:15}}>Ukusi koji inspirišu. Recepti za savršene trenutke.</Text>
        </View>

        {recipes.map((recipe) => (
        <React.Fragment key={recipe.id}>
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => {
              navigation.navigate('RecipeDetails', { recipeId: recipe.id });
            }}
          >
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            <Text style={styles.recipeName}>{recipe.name}</Text>
          </TouchableOpacity>
          

          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => {
              const userId = recipe.userId; 
              if (userId) {
                if (userId === parseInt(storedUserId)) {
                  navigation.navigate('Profile');
                } else {
                  navigation.navigate('Profile2', { idKorisnika: userId });
                }
              }
            }}
          >
            {usersData[recipe.id]?.userImage ? (
              <Image source={{ uri: usersData[recipe.id]?.userImage }} style={styles.userImage} />
            ) : (
              <Image source={require('../../assets/profile4.jpg')} style={styles.userImage} />
            )}
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>
                {usersData[recipe.id]?.userName} {usersData[recipe.id]?.userLastname}
              </Text>
            </View>
          </TouchableOpacity>


        </React.Fragment>
      ))}
      {recipes.length === 0 && (
        <Text style={styles.noRecipesText}>Nema dostupnih recepata.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  recipeCard: {
    padding: 15,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 5,
  },
  recipeName: {
    fontSize: 18,
    paddingTop: 10,
    paddingLeft:10
  },
  noRecipesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    paddingLeft:20
  },
  userImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 5,
  },
  userNameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    color:'black',
    fontFamily:'Times New Roman'
  },
  logoImage:{
    width: '100%',
    height: 500,
    objectFit:'cover',
  }
});
