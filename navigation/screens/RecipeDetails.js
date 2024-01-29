import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';

import defaultImage from '../../assets/profile4.jpg';
const RecipeDetails = ({ route, navigation }) => {
  const [recipe, setRecipe] = useState(null);
  const [userData, setUserData] = useState(null);
  const [storedUserId, setStoredUserId] = useState(null);
  const [numberOfComments, setNumberOfComments] = useState(0); 
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeId = route.params.recipeId;
        const response = await fetch(`http://mkristina9-001-site1.ftempurl.com/api/Recipe/GetRecipeWithIngredientsById/${recipeId}`);
        const data = await response.json();

        if (data) {
          setRecipe(data);
          if (data.userId) {
            const userId = data.userId;
            const userResponse = await axios.get(`http://mkristina9-001-site1.ftempurl.com/api/Recipe/GetUserDataByUserId/${userId}`);
            setUserData(userResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };
    getStoredUserId();
    fetchRecipe();

  }, [route.params.recipeId, navigation]); 

  const checkIfLoggedIn = async () => {
    try {
      const userId = await AsyncStorage.getItem('nameid');
      if (!userId) {
        alert('Morate biti ulogovani da biste ocenili recept.');
      } else {
        navigation.navigate('Rate', { recipeId: route.params.recipeId }); 
      }
    } catch (error) {
      console.error('Greška prilikom provjere ulogovanosti:', error);
    }
  };
  


  useFocusEffect(
    React.useCallback(() => {
      const fetchCommentCount = async () => {
        try {
          const response = await axios.get(`http://mkristina9-001-site1.ftempurl.com/api/Comments/CountCommentsByRecipeId/${route.params.recipeId}`);
          setNumberOfComments(response.data);
        } catch (error) {
          console.error('Error fetching comment count:', error);
        }
      };
      fetchCommentCount();

      const fetchAverageRating = async () => {
        try {
          const response = await axios.get(`http://mkristina9-001-site1.ftempurl.com/api/Rating/GetAverageRating/${route.params.recipeId}`);
          setAverageRating(response.data);
        } catch (error) {
          console.error('Error fetching average rating:', error);
        }
      };
  
      fetchAverageRating(); 
    }, [route.params.recipeId])
  );

  const getStoredUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('nameid');
      setStoredUserId(userId);
    } catch (error) {
      console.error('Greška prilikom dohvatanja storedUserId:', error);
    }
  };

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Učitavanje...</Text>
      </View>
    );
  }

  const renderIngredients = () => {
    if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
      return <Text>Nema dostupnih sastojaka</Text>;
    }
  
    return recipe.ingredients.map((ingredient, index) => (
      <View key={index}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '20%' }}>
            <Text>{ingredient.quantity} {ingredient.unitOfMeasure}</Text>
          </View>
          <Text>{ingredient.name}</Text>
        </View>
      </View>
    ));
  };

  return (
    <>
    <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backButtonCircle}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </View>
      </TouchableOpacity>

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

      <View style={{marginBottom:50}}> 
        <Text style={[styles.title, {marginBottom:20, padding:10}]}>{recipe.name}</Text>


        <TouchableOpacity onPress={checkIfLoggedIn}>
          <View style={{ justifyContent:'center',alignItems:'center', flexDirection: 'row' }}>
            {[...Array(5)].map((_, index) => (
              <Text key={index} style={{ fontSize: 20, marginRight: 5, color: 'tomato' }}>★</Text>
            ))}
          </View>
        </TouchableOpacity>

        {typeof averageRating === 'number' && !Number.isNaN(averageRating) && averageRating !== 0 ? (
          <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20, fontSize: 12 }}>
            Prosecna ocena: {parseFloat(averageRating).toFixed(2)}
          </Text>
        ) : (
          <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20, fontSize: 12 }}>
            Nema jos ocena
          </Text>
        )}
       
      </View>
      
      <View style={styles.line} />

      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
        onPress={() => {
          if (userData) {
            if (userData.userId.toString() === storedUserId.toString()) {
              navigation.navigate('Profile');
            } else {
              navigation.navigate('Profile2', { idKorisnika: userData.userId });
            }
          }
        }}
      >
        {userData && userData.userImage ? (
          <Image source={{ uri: userData.userImage }} style={styles.userImage} />
        ) : (
          <Image source={defaultImage} style={styles.userImage} />
        )}

        <View style={{ marginLeft: 20 }}>
          {userData && (
            <Text style={styles.userName}>
              {userData.userName} {userData.userLastname}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.line} />
      <View style={{ paddingLeft:20,paddingTop:30,paddingBottom:30,paddingRight:20, flexDirection: 'row' }}>
        <Text style={styles.titleReview}>Kategorija: </Text><Text>{recipe.kategory}</Text>
      </View>
      <View style={styles.line} />
      <View style={styles.reviews}>
        <View> 
          <Text style={styles.titleReview}>Komentari</Text>
          <Text style={{color:'gray'}}>Broj komentara: {numberOfComments}</Text>
        </View>
        <TouchableOpacity style={styles.read}
                          onPress={() => {
                            navigation.navigate('Comments', { recipeId: recipe.id});
                          }}>
          <Text style={{color:'tomato'}}>Otvori</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.line} />
      <View style={{paddingLeft:20,paddingTop:30,paddingBottom:30,paddingRight:20, flexDirection: 'row',}}>
        <Text style={styles.titleReview}>Težina: </Text><Text>{recipe.difficulty}</Text>
      </View>
      <View style={styles.line} />
      <View style={{ padding:30,flexDirection: 'row',alignItems: 'center',}}>
        <View style={{width:'60%'}}>
          <Text style={[styles.titleReview, {paddingBottom:10}]}>Vreme pripreme:</Text>
          <View style={{marginLeft:30,borderWidth:1, width:60,height:60, borderRadius:100, justifyContent:'center', alignItems:'center', borderColor:'tomato'}}>
            <Text style={{textAlign:'center'}}>{recipe.preparationTime} {recipe.preparationTimeMH}</Text>
          </View> 
        </View>
        <View>
          <Text style={[styles.titleReview, {paddingBottom:10}]}>Vreme kuvanja:</Text>
          <View style={{borderWidth:1, width:60,height:60, borderRadius:100, justifyContent:'center', alignItems:'center', borderColor:'tomato', marginLeft:20}}>
            <Text style={{textAlign:'center'}}>{recipe.cookingTime} {recipe.cookingTimeMH}</Text>
          </View>
        </View>
      </View>
      <View style={styles.line} />
      <View style={{paddingLeft:20,paddingTop:30,paddingBottom:30,paddingRight:20,}}>
        <Text style={[styles.titleReview, { paddingBottom: 20 }]}>Sastojci </Text>
        <Text style={{fontWeight:'bold', marginBottom:30}}>{recipe.numberOfServings} Porcije </Text>
        <View style={{ flexDirection: 'column' }}>
          {renderIngredients()}
        </View>
      </View>
      <View style={styles.line} />
      <View style={{paddingLeft:20,paddingTop:30,paddingBottom:30,paddingRight:20, marginBottom:100}}>
        <Text style={[styles.titleReview, {paddingBottom:50}]}>Postupak pripreme: </Text>
        <Text>{recipe.description}</Text>
      </View>
    </ScrollView>
    </>
  );
};


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
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeImage: {
    width: '100%',
    height: 500,
    objectFit: 'cover',
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontFamily:'Times New Roman',
    marginBottom: 10,
    marginTop:20,
    textAlign:'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 15,
  },
  line: {
    height: 0.5,
    backgroundColor: 'gray',
    width: '100%',
  },
  reviews: {
    paddingLeft:20,
    paddingTop:30,
    paddingBottom:30,
    paddingRight:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleReview: {
    fontWeight:'bold',
    fontSize:15,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily:'Times New Roman'
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 18,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default RecipeDetails;
