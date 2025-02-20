
import { UiActions } from "../Slice/UiSlice";
import axios from 'axios';
import { TOKEN } from "@/Constants";

export const fetchLois = async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN);
      const response = await axios.get('http://localhost:9090/api/loi', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      dispatch(UiActions.setIsError("Échec du chargement des lois"));
      throw error;
    }
  };


  export const getLawById = async (id, dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN);
      const response = await axios.get(`http://localhost:9090/api/loi/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      dispatch(UiActions.setIsError("Échec de la récupération de la loi"));
      throw error;
    }
  };
  
  export const updateLaw = async (id, lawData, dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN);
      const response = await axios.put(`http://localhost:9090/api/loi/${id}`, {
        nom: lawData.nomLoi,
        type: lawData.type,
        numero: parseInt(lawData.numLoi),
        date: lawData.date,
        source: lawData.source,
        titre: ""
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data) {
        dispatch(UiActions.setIsSuccess("Loi updated successfully!"));
        return response.data;
      }
    } catch (error) {
      dispatch(UiActions.setIsError(error.message));
      throw error;
    }
  };




export const addLaw = async (lawData, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.post('http://localhost:9090/api/loi', {
      nom: lawData.nomLoi,
      type: lawData.type,
      numero: parseInt(lawData.numLoi),
      date: lawData.date,
      source: lawData.source,
      titre: ""
      
    },
    {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
  });

    if (response.data) {
        dispatch(UiActions.setIsSuccess("Code créé avec succes"));
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la création du code"));
    throw error;
  }
};
