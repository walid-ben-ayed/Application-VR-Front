import { UiActions } from "../Slice/UiSlice";
import axios from 'axios';
import { TOKEN, API_BASE_URL } from "@/Constants";

export const fetchCodes = async (dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.get(`${API_BASE_URL}/api/code`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    dispatch(UiActions.setIsError("Échec du chargement des codes"));
    throw error;
  }
};

export const getCodeById = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.get(`${API_BASE_URL}/api/code/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la récupération du code"));
    throw error;
  }
};

export const deleteCode = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    await axios.delete(`${API_BASE_URL}/api/code/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    dispatch(UiActions.setIsSuccess("Code supprimé avec succès"));
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la suppression du code"));
    throw error;
  }
};

export const updateCode = async (id, codeData, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.put(`${API_BASE_URL}/api/code/${id}`, {
      nom: codeData.nom,
      nom_loi: codeData.nom_loi
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      dispatch(UiActions.setIsSuccess("Code mis à jour avec succès!"));
      return response.data;
    }
  } catch (error) {
    dispatch(UiActions.setIsError(error.message));
    throw error;
  }
};

export const addCode = async (codeData, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.post(`${API_BASE_URL}/api/code`, {
      nom: codeData.nom,
      nom_loi: codeData.nom_loi
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      dispatch(UiActions.setIsSuccess("Code créé avec succès"));
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la création du code"));
    throw error;
  }
};