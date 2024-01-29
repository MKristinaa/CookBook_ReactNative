import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function Filter({ navigation }) {
const [selectedCategories, setSelectedCategories] = useState([]);

const handleCategoryPress = (category) => {
    const newSelectedCategories = [...selectedCategories];
    const index = newSelectedCategories.indexOf(category);
    
    if (index > -1) {
        newSelectedCategories.splice(index, 1);
    } else {
        newSelectedCategories.push(category);
    }
    
    setSelectedCategories(newSelectedCategories);
    };


    const handleFilter = () => {
        const url = 'http://mkristina9-001-site1.ftempurl.com/api/Search/GetRecipesByCategory';
    
        const searchParams = new URLSearchParams();
    
        selectedCategories.forEach(category => {
            searchParams.append('searchTerms', category);
        });
    
        const fullURL = `${url}?${searchParams.toString()}`;
    
        axios.get(fullURL)
            .then(response => {
                navigation.navigate('Search', { filteredRecipes: response.data });
            })
            .catch(error => {
                console.error('Greška prilikom filtriranja kategorija:', error);
            });
    };

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerText}>Filtriraj</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.category}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Kategorije: </Text>
          <Ionicons name="chevron-down" size={16} color="gray" />
        </View>
        <View style={styles.line} />

        <View style={styles.row}>
        {['Pasta', 'Azijsko', 'Glavno jelo', 'Brzo', 'Salata', 'Desert'].map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleCategoryPress(category)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {selectedCategories.includes(category) ? (
                <Ionicons name="checkbox" size={20} color="tomato"/>
              ) : (
                <Ionicons name="square-outline" size={20} color="lightgray" />
              )}
              <Text style={styles.text}>{category}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.submit}
                          onPress={() => handleFilter(navigation)}>
            <Text style={{color:'white', textAlign:'center'}}>Filtriraj</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 60,
    paddingBottom: 20,
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
  main: {
    padding: 15,
    paddingTop: 30,
  },
  line: {
    height: 0.5,
    backgroundColor: 'lightgray',
    width: 1000,
    marginLeft: -40,
    marginTop: 20,
  },
  category: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  row: {
    paddingTop:20
  },
  text: {
    fontSize:18
  },
  submit:{
    marginTop:50,
    backgroundColor:'black',
    width:'100%',
    padding:15,
    borderRadius:10,
    borderWidth:1
  }
});
