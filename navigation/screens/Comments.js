import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Image, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function Comments({ route, navigation }) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [comments, setComments] = useState([]);
  const inputRef = useRef(null);

  const handleSendingComment = async () => {
    try {
      const recipeId = await route.params.recipeId;
      const userId = await AsyncStorage.getItem('nameid');

    if (!userId) {
      Alert.alert("Morate biti ulogovani da biste ostavili komentar");
      return;
    }
  
      const comment = {
        userId: userId,
        recipeId: recipeId,
        text: text
      };
  
      const response = await axios.post(
        // 'http://mkristina123-001-site1.itempurl.com/api/Comments/AddComment',
        'http://mkristina9-001-site1.ftempurl.com/api/Comments/AddComment',
        
        comment
      );
  
      setText('');
      setIsFocused(true);
      inputRef.current.focus();
  
      const updatedComments = await axios.get(
        `http://mkristina9-001-site1.ftempurl.com/api/Comments/GetCommentsByRecipeId/${recipeId}`
      );
  
      setComments(updatedComments.data);
      
  
      Alert.alert("Uspesno ste dodali komentar!");
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  

  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const recipeId = await route.params.recipeId;

        const response = await axios.get(
          `http://mkristina9-001-site1.ftempurl.com/api/Comments/GetCommentsByRecipeId/${recipeId}`
        );

        setComments(response.data);

      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    fetchComments();
  }, [route.params.recipeId]);
  
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.goBack();
              setText('');
            }}
          >
            <View style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.headerText}>Komentari</Text>
        </View>

        <ScrollView contentContainerStyle={styles.comments}>
          {comments.slice().reverse().map((comment, index) => (
            <React.Fragment key={index}>
              <View style={styles.commentCard}>
                <View style={styles.user}>
                  <Image source={{ uri: comment.userInfo?.image }} style={styles.userImage} />
                  <View style={styles.userNameContainer}>
                    <Text style={styles.userName}>
                      {`${comment.userInfo?.name} ${comment.userInfo?.lastname}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.commentView}>
                  <Text>{comment.text}</Text>
                </View>
              </View>
              <View style={styles.line} />
            </React.Fragment>
          ))}
        </ScrollView>
        
        <View style={[styles.commentBox, isFocused ? styles.commentBoxFocused : null]}>
          <TextInput
            ref={inputRef}
            style={[styles.input, isFocused ? styles.inputFocused : null]}
            placeholder={'Ostavi komentar'}
            placeholderTextColor={'gray'}
            value={text}
            onChangeText={(text) => setText(text)}
            onFocus={() => setIsFocused(true)}
          />

          <TouchableOpacity onPress={handleSendingComment}>
            <Text style={styles.text}>Pošalji</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  commentBox: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    width: '75%',
    height: 55,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  inputFocused: {
    borderColor: 'gray',
  },
  commentBoxFocused: {
    height: 80,
    padding: 13,
    paddingLeft: 20,
  },
  text: {
    color: 'gray',
    padding: 20,
  },
  comments: {
    paddingBottom:120,
    flexGrow: 1,
  },
  commentCard: {
    paddingLeft: 20,
    paddingTop:20,
    paddingBottom:10
    // marginBottom:10
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 5,
  },
  userNameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Times New Roman',
    paddingLeft:5,
    paddingBottom:10,
    color:'tomato'
  },
  commentView:{
    width:'85%',
    paddingVertical:20,
    paddingHorizontal:'5%',
    borderRadius:10,
    marginLeft:'10%',
    backgroundColor:'#FDF5E6', 
  },
  line: {
    height: 0.5,
    backgroundColor: 'gray',
    width: '120%',
    marginLeft:-25
  },
});
