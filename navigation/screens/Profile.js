import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';

import {defaultImage} from '../../assets/profile4.jpg';

export default function ProfileScreen({ navigation }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]); 


  const checkLoggedInUser = async () => {
    try {
      const userToken =  await AsyncStorage.getItem('userToken');
      if (userToken) {
        const userString = await AsyncStorage.getItem('loggedInUser');
        if (userString) {
          const user = JSON.parse(userString);
          const name = await AsyncStorage.getItem('Name');
          const lastname = await AsyncStorage.getItem('Lastname');
          const image = await AsyncStorage.getItem('Image');

          
          setLoggedInUser({
            ...user,
            name: name,
            lastname: lastname,
            image: image
          });
          
        }
        
      } else {
        setLoggedInUser(null);
      }
    } catch (error) {
      console.error('Došlo je do greške prilikom čitanja AsyncStorage:', error);
    }
  };

  const getUserRecipes = async () => {
    try {
      const userId = await AsyncStorage.getItem('nameid');

      if (userId) {
        try {
          const response = await axios.get(`http://mkristina9-001-site1.ftempurl.com/api/Recipe/GetRecipesByUserId/${userId}`);

          const reversedRecipes = response.data.reverse(); 
          setUserRecipes(reversedRecipes || []); 

          // setUserRecipes(response.data || []); 
        } catch (error) {
          // console.error('Error fetching recipes:', error);
          setUserRecipes([]);
        }
      } else {
        setUserRecipes([]); 
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setUserRecipes([]); 
    }
  };

  const getUserData = async () => {
    checkLoggedInUser();
    getUserRecipes();
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [])
  );


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('nameid');
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('loggedInUser'); 
      await AsyncStorage.removeItem('Name');
      await AsyncStorage.removeItem('Lastname');
      await AsyncStorage.removeItem('Image');
      await AsyncStorage.removeItem('token');
      setLoggedInUser(null);
      Alert.alert('Logout', 'Izlogovani ste!');
    } catch (error) {
      console.error('Došlo je do greške prilikom odjave:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loggedInUser ? (
        <View style={styles.header}>
          <Text style={styles.headerText}>Profil</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={[styles.content, { justifyContent: loggedInUser ? 'flex-start' : 'center' }]}>
        {loggedInUser ? (
          <View>
            <View style={styles.profileSection}>
              <View style={styles.leftContent}>
                <View style={styles.leftContent}>
                  {loggedInUser.image !== null ? (
                    <Image source={{ uri: loggedInUser.image }} style={styles.profileImage} />
                  ) : (
                    <Image source={require('../../assets/profile4.jpg')} style={styles.profileImage} />
                  )}
                </View>
              </View>
              <View style={styles.rightContent}>
                {userRecipes.length > 0 ? (
                  <>
                    <Text style={styles.name}>{loggedInUser.name} {loggedInUser.lastname}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddRecipe')}>
                      <Text style={{ color: '#0e573a' }}>Dodaj recept</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={[styles.name, {paddingTop: 10, fontSize:18}]}>{loggedInUser.name} {loggedInUser.lastname}</Text>
                  </>
                )}
              </View>
            </View>

            <View style={styles.myRecipesContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="newspaper-outline" size={14} color="tomato"/>
                <Text style={styles.myRecipesText}>Moji recepti</Text>
              </View>

              <View style={{height: 2, backgroundColor: 'tomato', width: 130, marginTop: 10, marginLeft:-10}} />
              <View style={[styles.line]} />

              
              <ScrollView contentContainerStyle={styles.recipesContainer}>
                {Array.isArray(userRecipes) && userRecipes.length > 0 ? (
                  userRecipes.map((recipe, index) => (
                    <TouchableOpacity
                      key={`${recipe.id || index}`}
                      style={styles.recipeCard}
                      onPress={() => {
                        navigation.navigate('RecipeDetails', { recipeId: recipe.id });
                      }}
                    >
                      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                      <Text style={styles.recipeName}>{recipe.name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noRecipeContent}>
                      <Image source={require('../../assets/proba1.png')} style={{width:200, height:200}} />
                      <Text style={{fontWeight:'bold', fontSize:20, textAlign:'center', paddingTop:10}}>Podelite svoje recepte sa </Text>
                      <Text style={{fontWeight:'bold', fontSize:20,paddingTop:10}}> zajednicom!</Text>
                      <Text style={{fontSize:18,paddingTop:10, color:'gray', fontWeight:'300'}}>Sada je vreme! Kliknite ispod da biste</Text>
                      <Text style={{fontSize:18,paddingTop:10, color:'gray', paddingBottom:22, fontWeight:'300'}}> podelili svoj recept sa zajednicom!</Text>
                      <TouchableOpacity style={[styles.button, {backgroundColor:'#0e573a', padding:15}]} onPress={() => navigation.navigate('AddRecipe')}>
                        <Text style={{ color: 'white',fontWeight:'300'}}>Dodaj recept</Text>
                      </TouchableOpacity>
                  </View>
                  
                )}
              </ScrollView>


            </View>
          </View>
        ) : (
          <View style={styles.notLoggedInContainer}>
       
            <Image source={require('../../assets/profiePicture1.jpg')} style={{width:'65%', height:'50%'}}/>
            <Text style={styles.notLoggedInText}>
              Za istraživanje naših najnovijih recepata, prijavite se ili registrujte.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}
                              style={styles.button1}>
              <Ionicons name='log-in-outline' style={{color:'green', fontSize:15, paddingRight:5}}/>
              <Text>Prijavi se</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}
                              style={styles.button1}>
              <Ionicons name='person-add-outline' style={{color:'green', fontSize:15, paddingRight:5}}/>
              <Text>Registruj se</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    height: 50,
    marginTop: 60,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
    paddingLeft:5
  },
  logoutText: {
    color: 'red',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    alignItems: 'flex-start',
    width: '43%',
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-start',
    marginTop: 40,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 100,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingLeft:8
  },
  noRecipeContent: {
    width:'100%',
    height:430,
    justifyContent:'center',
    alignItems:'center',
  },
  notLoggedInContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLoggedInText: {
    fontSize: 18,
    marginBottom: 40,
    marginTop:30,
    paddingHorizontal:10,
    textAlign:'center',
  },
  button: {
    borderWidth: 1,
    borderColor: '#0e573a',
    borderRadius: 50,
    padding: 10,
    marginTop: 10,
  }, 
  button1: {
    borderWidth: 1,
    width:'100%',
    borderColor: 'lightgrey',
    borderRadius: 50,
    padding: 15,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myRecipesContainer: {
    marginLeft: 0, 
    marginTop: 20,
    paddingLeft: 0,
    marginBottom:30
  },
  myRecipesText: {
    fontSize: 16,
    color: 'tomato',
    marginLeft: 5,
  },
  line: {
    height: 0.5,
    backgroundColor: 'lightgray',
    width: 1000,
    marginLeft: -40, 
  },
  recipesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 300,
  },
  recipeCard: {
    width: '48%',
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 15,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 5,
  },
  recipeName: {
    fontSize: 17,
    paddingTop: 10,
  },
});
