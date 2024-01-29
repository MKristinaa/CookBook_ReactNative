import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import defaultImage from '../../assets/profile4.jpg';

export default function Profile2Screen({ route, navigation }) {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);

  const userId = route.params.idKorisnika;

  const getUserData = async () => {
    try {
      const response = await axios.get(`http://mkristina9-001-site1.ftempurl.com/Recipe/GetUserDataByUserId/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Došlo je do greške prilikom dohvatanja korisničkih podataka:', error);
    }
  };

  const getUserRecipes = async () => {
    try {
      const response = await axios.get(`http://mkristina9-001-site1.ftempurl.com/api/Recipe/GetRecipesByUserId/${userId}`);
      setUserRecipes(response.data);
    } catch (error) {
      console.error('Došlo je do greške prilikom dohvatanja recepata:', error);
    }
  };

  useEffect(() => {
    getUserData();
    getUserRecipes(); 

    const unsubscribe = navigation.addListener('focus', () => {
        getUserData();
        getUserRecipes();
      });
      return unsubscribe;
    }, [navigation]);

    
  return (
    <View style={styles.container}>

    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.backButtonCircle}>
          <Ionicons name="arrow-back" size={25} color="black" />
        </View>
    </TouchableOpacity>

        {userData && (
        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.leftContent}>
            {userData && userData.userImage ? (
              <Image source={{ uri: userData.userImage }} style={styles.profileImage} />
            ) : (
              <Image source={defaultImage} style={styles.profileImage} />
            )}
            </View>

            <View style={styles.rightContent}>
                <Text style={styles.name}>
                {userData.userName} {userData.userLastname}
                </Text>
             </View>
          </View>

          <View style={styles.myRecipesContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="newspaper-outline" size={18} color="tomato"/>
              <Text style={styles.myRecipesText}>Recepti</Text>
            </View>
            
            <View style={{height: 2, backgroundColor: 'tomato', width: 130, marginTop: 10, marginLeft:-10}} />
            <View style={styles.line} />

            <ScrollView contentContainerStyle={styles.recipesContainer}>
                {userRecipes.map((recipe, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.recipeCard}
                    onPress={() => {
                    navigation.navigate('RecipeDetails', { recipeId: recipe.id });
                    }}
                >
                    <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
       
    </View>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop:60
  },
  backButton: {
    position: 'absolute',
    top: 50,
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
    marginTop:20
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    alignItems: 'flex-start',
    width: '30%',
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-start',
    marginTop: 55,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    margin:25
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  myRecipesContainer:{
    paddingLeft:20,
    paddingRight:20
  },  
  myRecipesText: {
    fontSize: 16,
    color: 'tomato',
    marginLeft:5
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
    paddingBottom:180,
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
    fontSize:17,
    paddingTop:10
  },
});