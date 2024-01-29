import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet,TouchableOpacity , Image, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddRecipe({ navigation }) {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitOfMeasure, setunitOfMeasure] = useState('');
  const [category, setCategory] = useState('Pasta');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [prepTimeUnit, setPrepTimeUnit] = useState('min');
  const [cookTime, setCookTime] = useState('');
  const [cookTimeUnit, setCookTimeUnit] = useState('min');
  const [difficulty, setDifficulty] = useState('Easy');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  
  const [formValid, setFormValid] = useState(true);

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
      const storageRef = ref(storage, `recipe_image/${filename}`);

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

  const handleAddIngredient = () => {
    if (ingredientName.trim() !== '') {
      const newIngredient = {
        ingredientName,
        quantity: quantity.trim() !== '' ? parseFloat(quantity) : null,
        unitOfMeasure: unitOfMeasure.trim() !== '' ? unitOfMeasure : null,
      };
      setIngredients([...ingredients, newIngredient]);
      setIngredientName('');
      setQuantity('');
      setunitOfMeasure('');
    } else {
      console.log('Naziv sastojka ne sme biti prazan.');
    }
  };
  
  const handleSubmitRecipe = async () => {
    try {
      let imageUrl = null;

      if (
        recipeName.trim() === '' ||
        servings === '' ||
        prepTime === '' ||
        cookTime === '' ||
        description === '' ||
        !selectedImage
        // ingredients.length === 0
      ) {
        Alert.alert('Greška', 'Popunite sva potrebna polja.');
        return;
      }

      if (selectedImage) {
        imageUrl = await uploadImage();
      }

      const idKorisnika = await AsyncStorage.getItem('nameid');
      console.log('idKorisnika:', idKorisnika);

      const recipe = {
        name: recipeName,
        kategory: category,
        preparationTime: prepTime,
        preparationTimeMH: prepTimeUnit,
        numberOfServings: servings,
        cookingTime: cookTime,
        cookingTimeMH: cookTimeUnit,
        difficulty: difficulty,
        image: imageUrl,
        description: description,
        userId: idKorisnika,
        ingredients: ingredients.map((ingredient) => ({
          name: ingredient.ingredientName,
          quantity: ingredient.quantity,
          unitOfMeasure: ingredient.unitOfMeasure,
        })),
      };


      const response = await axios.post(
        'http://mkristina9-001-site1.ftempurl.com/api/Recipe/AddRecipe',
        recipe
      );
      console.log('You added a new recipe successfully:', recipe);

      setRecipeName('');
      setCategory('Pasta');
      setServings('');
      setIngredients([]);
      setPrepTime('');
      setPrepTimeUnit('min');
      setCookTime('');
      setCookTimeUnit('min');
      setDifficulty('Easy');
      setDescription('');
      setSelectedImage(null);

      Alert.alert('Uspesno ste dodali recept!');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  return (
    <>
      <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.headerText}>Dodaj recept</Text>
        </View>
    <ScrollView style={styles.container}>
      <Text style={styles.name}>Naziv recepta:</Text>
      <TextInput
        style={[styles.input, !formValid && recipeName.trim() === '' && styles.inputError]}
        value={recipeName}
        onChangeText={setRecipeName}
        placeholder="Unesite naziv recepta"
      />
      {!formValid && recipeName.trim() === '' && (
        <Text style={styles.errorText}>Naziv je obavezan!</Text>
      )}

      <View style={styles.picker}>
        <Text style={styles.name}>Kategorija:</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Pasta" value="Pasta" />
          <Picker.Item label="Azijsko" value="Azijsko" />
          <Picker.Item label="Glavno jelo" value="Glavno jelo" />
          <Picker.Item label="Brzo" value="Brzo" />
          <Picker.Item label="Salata" value="Salata" />
          <Picker.Item label="Desert" value="Desert"/>
        </Picker>
      </View>

      <Text style={styles.name}>Broj porcija:</Text>
      <TextInput
        style={[styles.input, !formValid && servings === '' && styles.inputError]}
        value={servings.toString()}
        onChangeText={(text) => setServings(text)} 
        keyboardType="numeric"
        placeholder="Unesite broj porcija"
      />
      {!formValid && servings === '' && (
        <Text style={styles.errorText}>Dodajte broj porcija!</Text>
      )}

      <Text style={styles.name}>Vreme pripreme:</Text>
      <View style={styles.ingredientInput}>
        <TextInput
          style={[styles.inputIngredient, !formValid && prepTime === '' && styles.inputError]}
          value={prepTime}
          onChangeText={setPrepTime}
          placeholder="Vreme"
          keyboardType="numeric"
        />
        <Picker
          selectedValue={prepTimeUnit}
          style={{ height: 10, width: 100, marginTop:-200 , marginRight:100}}
          onValueChange={(itemValue) => setPrepTimeUnit(itemValue)}
        >
          <Picker.Item label="min" value="min" />
          <Picker.Item label="sat" value="sat"/>
        </Picker>
      </View>
      {!formValid && prepTime === '' && (
          <Text style={styles.errorText}>Vreme pripreme je obavezno!</Text>
      )}
        

      <Text style={styles.name}>Vreme kuvanja:</Text>
      <View style={styles.ingredientInput}>
        <TextInput
          style={[styles.inputIngredient, !formValid && cookTime === '' && styles.inputError]}
          value={cookTime}
          onChangeText={setCookTime}
          placeholder="Vreme"
          keyboardType="numeric"
        />
        <Picker
          selectedValue={cookTimeUnit}
          style={{height: 10, width: 100, marginTop:-200 , marginRight:100}}
          onValueChange={(itemValue) => setCookTimeUnit(itemValue)}
        >
          <Picker.Item label="min" value="min" />
          <Picker.Item label="sat" value="sat" />
        </Picker>
      </View>
        {!formValid && cookTime === '' && (
          <Text style={styles.errorText}>Vreme kuvanja je obavezno!</Text>
        )}


      <Text style={styles.name}>Težina:</Text>
        <Picker
          style={{ marginTop:-20}}
          selectedValue={difficulty}
          onValueChange={(itemValue) => setDifficulty(itemValue)}
        >
          <Picker.Item label="Lako" value="Lako" />
          <Picker.Item label="Srednje" value="Srednje"/>
          <Picker.Item label="Teško" value="Teško" />
        </Picker>

      <Text style={styles.name}>Sastojci:</Text>
      <View style={styles.ingredientsContainer}>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredient}>
          <TouchableOpacity onPress={() => handleRemoveIngredient(index)}>
            <Ionicons name="close-circle" size={24} color="red" style={{marginRight:5}}/>
          </TouchableOpacity>
          <Text style={{fontSize: 15,paddingTop:5}}>
            {ingredient.ingredientName || ''}  {ingredient.quantity || ''} {ingredient.unitOfMeasure || ''}
          </Text>
        </View>
      ))}
      </View>

      <View style={styles.ingredientInput}>
        <TextInput
          style={styles.inputIngredient}
          value={ingredientName}
          onChangeText={setIngredientName}
          placeholder="Naziv sastojka"
        />
        <TextInput
          style={styles.inputIngredient}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Količina"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.inputIngredient}
          value={unitOfMeasure}
          onChangeText={setunitOfMeasure}
          placeholder="Jedinica mere"
        />
        
      </View>
        <TouchableOpacity 
          onPress={handleAddIngredient}
          style={styles.button1}>
          <Text style={{color:'#0e573a'}}>Dodaj sastojak</Text>
        </TouchableOpacity>


      <Text style={styles.name}>Opis:</Text>
      <TextInput
        style={[styles.input, !formValid && description === '' && styles.inputError]}
        value={description}
        onChangeText={setDescription}
        placeholder="Unesite opis recepta"
        multiline
        numberOfLines={4}
      />
      {!formValid && description === '' && (
        <Text style={styles.errorText}>Opis je obavezan!</Text>
      )}

      <Text style={styles.name}>Izaberi sliku:</Text>
      <TouchableOpacity onPress={pickImage}>
      {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              ) : (
                <View>
                  <Ionicons name='camera' style={{fontSize:50, paddingTop:10, marginBottom:20}}/>
                  {!formValid && <Text style={styles.errorText}>Slika je obavezna!</Text>}
                </View>
                
              )}

      </TouchableOpacity>


      <TouchableOpacity onPress={handleSubmitRecipe} style={styles.button}>
        <Text style={{ color: 'white', fontSize:16, fontWeight:'300' }}>Sačuvaj recept</Text>
      </TouchableOpacity>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor:'white'
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
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
  input: {
    height: 40,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  inputIngredient: {
    height: 40,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: 105,
    marginRight: 17,
  },
  ingredientsContainer: {
    marginBottom: 20,
    marginTop:15
  },
  ingredient: {
    justifyContent:'flex-start',
    alignItems:'flex-start',
    flexDirection:'row',
  },
  ingredientInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom:60,
    borderColor:'black',
  },
  button1: {
    width: 120,
    borderWidth: 1,
    borderColor: '#0e573a',
    borderRadius: 50,
    padding: 10,
    marginTop: -15,
    marginLeft:115,
    marginBottom:10
  },
  button: {
    width: 180,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor:'#0e573a',
    borderRadius: 50,
    padding: 15,
    marginTop: 15,
    alignItems: 'center',
    marginLeft:80,
    marginBottom:150,
    marginTop:50,
  },
  name: {
    fontSize: 16,
    paddingBottom:10,
  },
  picker: {
    width:'100%',
    height:70,
    marginBottom:150
  },
  selectedImage: {
    width: '115%',
    height:400,
    marginBottom: 20,
    marginLeft:-20,
  },
  placeholderImage: {
    width: '115%',
    height:400,
    marginBottom: 20,
    marginLeft:-20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 30,
    marginTop:-15
  },
  inputError: {
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
});
