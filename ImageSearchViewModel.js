import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'https://api.unsplash.com/search/photos/';
const ACCESS_KEY = "fEx0f6fugNGVNZ2AwARl7_wG8gr8zWAoIQkLUOpmEmE";

const useImageSearch = () => {
  const [images, setImages] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAPI = async (query, page = 1) => {
    try {
      const queryString = `?query=${query}&client_id=${ACCESS_KEY}&page=${page}`;
      const fullUrl = apiUrl + queryString;
      const response = await axios.get(fullUrl);
      const imageData = response.data.results;
      const imageDetailsPromises = imageData.map(async (item) => {
        return {
          id: item.id,
          url: item.urls.regular,
          title: "Titulo: " + item.alt_description || 'Sin título',
          author: "Autor: " + item.user.name || 'Autor desconocido',
        };
      });
      const imageDetails = await Promise.all(imageDetailsPromises);
      if (page === 1) {
        setImages(imageDetails);
      } else {
        setImages((prevImages) => [...prevImages, ...imageDetails]);
      }
      setSearchHistory((prevHistory) => [query, ...prevHistory]);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error al traer la data:', error);
    }
  };

  useEffect(() => {
    fetchAPI(''); // Puedes proporcionar una cadena vacía o el valor predeterminado que desees al inicio
  }, []);

  return {
    images,
    searchHistory,
    fetchAPI,
    currentPage,
  };
};

export default useImageSearch;