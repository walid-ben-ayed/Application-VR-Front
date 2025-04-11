
import { UiActions } from "../Slice/UiSlice";
import axios from 'axios';
import { TOKEN, API_BASE_URL } from "@/Constants";

export const fetchLois = async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN);
      const response = await axios.get(`${API_BASE_URL}/api/loi`, {
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
      const response = await axios.get(`${API_BASE_URL}/api/loi/${id}`, {
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


  export const deleteLaw = async (id, dispatch) => {
    try {
        const token = localStorage.getItem(TOKEN);
        await axios.delete(`${API_BASE_URL}/api/loi/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        dispatch(UiActions.setIsSuccess("Loi supprimée avec succès"));
    } catch (error) {
        dispatch(UiActions.setIsError("Échec de la suppression de la loi"));
        throw error;
    }
  };

  
  export const updateLaw = async (id, lawData, dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN);
      const response = await axios.put(`${API_BASE_URL}/api/loi/${id}`, {
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
    console.log(lawData);
    const token = localStorage.getItem(TOKEN);
    const response = await axios.post(`${API_BASE_URL}/api/loi`, {
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