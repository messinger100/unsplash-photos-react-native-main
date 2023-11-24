import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Modal, Image, TouchableWithoutFeedback } from 'react-native';
import { Button, Card, TextInput, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useImageSearch from './ImageSearchViewModel';

export default function App() {
  const { images, searchHistory, currentPage, fetchAPI } = useImageSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSearchHistory, setShowSearchHistory] = useState(true);

  const handleSearch = () => {
    fetchAPI(searchQuery, 1);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    fetchAPI(searchQuery, nextPage);
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const renderImages = () => {
    return images.map((image, index) => (
      <View key={index} style={styles.cardContainer}>
        <Card style={styles.card}>
          <TouchableWithoutFeedback onPress={() => handleImagePress(image.url)}>
            <Card.Cover source={{ uri: image.url }} style={styles.image} />
          </TouchableWithoutFeedback>
          <Text>{image.title}</Text>
          <Text>{image.author}</Text>
        </Card>
      </View>
    ));
  };

  const renderSearchHistoryCards = () => {
    return searchHistory.map((query, index) => (
      <View key={index} style={styles.cardContainer}>
        <Card style={styles.card}>
          <TouchableWithoutFeedback onPress={() => handleSearchHistoryPress(query)}>
            <View>
              <Card.Content>
                <Text>{query}</Text>
              </Card.Content>
            </View>
          </TouchableWithoutFeedback>
        </Card>
      </View>
    ));
  };

  const handleSearchHistoryPress = (query) => {
    setSearchQuery(query);
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar imágenes"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={handleSearch}>
            <Icon name="search" size={24} color="#707070" style={styles.icon} />
          </Button>
        </View>
      </View>
      <ScrollView>
        <Button onPress={() => setShowSearchHistory(!showSearchHistory)}>
          <Icon name={showSearchHistory ? "eye-slash" : "eye"} size={24} color="#707070" style={styles.icon} />
        </Button>
        {showSearchHistory && (
          <View style={styles.searchHistoryContainer}>
            <Text style={styles.searchHistoryTitle}>Historial de búsqueda</Text>
            <ScrollView vertical={true} showsHorizontalScrollIndicator={false} style={styles.searchHistoryScrollView}>
              {renderSearchHistoryCards()}
            </ScrollView>
          </View>
        )}
        <View style={styles.rowContainer}>
          {renderImages()}
        </View>
      </ScrollView>
      <ScrollView onEndReached={handleLoadMore} onEndReachedThreshold={0.1}>
        {/* ... (rest of the code) */}
        <Button onPress={handleLoadMore}>
          <Text>Cargar más</Text>
        </Button>
      </ScrollView>
      <Modal visible={selectedImage !== null} transparent={true} onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          <Button onPress={closeImageModal} style={styles.closeButton}>Cerrar</Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flex: 1,
    maxHeight: 100,
  },
  buttonContainer: {
    marginTop: 40,
    backgroundColor: 'black',
    flex: 0.2,
    maxHeight: '100',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    maxHeight: 20,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  cardContainer: {
    width: '45%',
    marginBottom: 10,
  },
  card: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '100%',
    height: 600,
    resizeMode: 'stretch',
    marginBottom: 10,
  },
  button: {
    margin: 20,
    height: 60
  },
  searchBar: {
    marginTop: 40,
    marginStart: 10,
    marginEnd: 10,
    marginBottom: 20,
    height: 60,
  },
  closeButton: {
    backgroundColor: 'white',
  },
  searchHistoryContainer: {
    marginTop: 20,
  },
  searchHistoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchHistoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchHistoryCard: {
    marginRight: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchHistoryCardContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchHistoryCardText: {
    color: 'white',
  },
  searchHistoryScrollView: {
    marginTop: 10,
    marginBottom: 20,
  },
});