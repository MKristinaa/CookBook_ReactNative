import React, { useState, useRef } from 'react';
import { View, TextInput, Image, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function SearchScreen({ route, navigation }) {
  const [searchText, setSearchText] = useState('');
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const textInputRef = useRef(null);
  const { filteredRecipes } = route.params || {};

  const getFilteredRecipes = async (searchTerm) => {
    try {
      const response = await axios.get(`http://mkristina9-001-site1.ftempurl.com/api/Search/GetRecipesByCategoryOrName/${searchTerm}`);
      const reversedRecipes = response.data.reverse(); 
      return reversedRecipes || [];
    } catch (error) {
      console.error('Error fetching filtered recipes:', error);
      return [];
    }
  };

  const searchRecipes = async (text) => {
    const trimmedText = text.trim();
    if (trimmedText !== '') {
      const filtered = await getFilteredRecipes(trimmedText);
      setSelectedCategory(filtered);
    } else {
      setSelectedCategory([]);
    }
  };

  const navigateToSearch2 = () => {
    setIsCategorySelected(true);
  };

  const clearFilter = () => {
    navigation.setParams({ filteredRecipes: [] });
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pretraži</Text>
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}> 
        <TouchableOpacity onPress={navigateToSearch2} style={styles.inputContainer}>
          <Ionicons name="search-outline" size={18} style={styles.searchIcon} />
          <TextInput
            ref={textInputRef}
            style={styles.input}
            placeholder="Gladni?"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              searchRecipes(text);
              
            }}
            onFocus={() => navigation.setParams({ filteredRecipes: [] })}
          />
        </TouchableOpacity>
        <View style="filter">
          <TouchableOpacity style={{padding: 10, borderRadius: 10, backgroundColor: 'black', paddingVertical: 16 }} onPress={() => navigation.navigate('Filter')}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Filter <Ionicons name="chevron-down" size={16} color="white" /></Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredRecipes && filteredRecipes.length > 0 && (
        <TouchableOpacity style={{marginLeft:-275, marginTop:20 ,padding: 5, borderRadius: 10, backgroundColor: 'white',  borderWidth:1, borderRadius:10 , borderColor:'gray'}} 
                          onPress={clearFilter}>
          <Text style={{textAlign: 'center' }}>Obrisi Filter</Text>
        </TouchableOpacity>
      )}

      <View style={styles.line} />

      <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.recipeContainer}>
          {selectedCategory.map((recipe, index) => (
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
          {filteredRecipes && filteredRecipes.map((recipe, index) => (
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
          
         
        </View>
      </ScrollView>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    height: 60,
    marginTop: 40,
    marginBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
    marginLeft: -170,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
  },
  searchIcon: {
    marginLeft: 5,
    marginRight: 5,
  },
  category: {
    width: '100%',
    height: '60%',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  card: {
    width: '27%',
    height: 140,
    backgroundColor: '#FDF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: 90,
    objectFit: 'cover',
  },
  image1: {
    width: '70%',
    height: 70,
    objectFit: 'cover',
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 5,
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
  scrollViewContent: {
    flexGrow: 1,
  },
  recipeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: 350,
    paddingBottom: 20,
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
  filter: {
    backgroundColor: 'black',
  },
  line: {
    height: 0.5,
    backgroundColor: 'lightgray',
    width: 1000,
    marginLeft: -40, 
    marginTop: 20,
  },
  filterCategories: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  categoryItem: {
    borderWidth: 0.5,
    borderRadius: 15,
    borderColor:'gray',
    padding: 5,
    margin: 5,
    justifyContent:'flex-start',
    alignItems: 'flex-start', 
    flexDirection: 'row',
    backgroundColor: 'white',
  },
});
