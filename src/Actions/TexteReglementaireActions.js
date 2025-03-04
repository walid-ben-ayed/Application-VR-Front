import { UiActions } from "../Slice/UiSlice";
import axios from 'axios';
import { TOKEN } from "@/Constants";

export const fetchTexteReglementaire = async (dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.get('http://localhost:9090/api/texteReglementaire', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    dispatch(UiActions.setIsError("Échec du chargement des textes réglementaires"));
    throw error;
  }
};

export const getTexteReglementaireById = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.get(`http://localhost:9090/api/texteReglementaire/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la récupération du texte réglementaire"));
    throw error;
  }
};

export const deleteTexteReglementaire = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.delete(`http://localhost:9090/api/texteReglementaire/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      dispatch(UiActions.setIsSuccess("Texte réglementaire supprimé avec succès"));
      return true;
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la suppression du texte réglementaire"));
    throw error;
  }
};

export const updateTexteReglementaire = async (id, data, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.put(`http://localhost:9090/api/texteReglementaire/${id}`, {
      loiTitre: data.loiTitre,
      codeNom: data.codeNom,
      champApplication: data.champApplication,
      texteResume: data.texteResume,
      texte: data.texte,
      pieceJointe: data.pieceJointe,
      numeroArticle: parseInt(data.numeroArticle),
      version: data.version
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      dispatch(UiActions.setIsSuccess("Texte réglementaire mis à jour avec succès"));
      return response.data;
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la mise à jour du texte réglementaire"));
    throw error;
  }
};

export const addTexteReglementaire = async (data, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    console.log("data",data);
    console.log("Token utilisé pour la requête:", token ? "Token présent" : "Token absent");
    const response = await axios.post('http://localhost:9090/api/texteReglementaire', {
      loiTitre: data.loiTitre,
      codeNom: data.codeNom,
      champApplication: data.champApplication,
      texteResume: data.texteResume,
      texte: data.texte,
      pieceJointe: data.pieceJointe,
      numeroArticle: parseInt(data.numeroArticle),
      version: 1
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      dispatch(UiActions.setIsSuccess("Texte réglementaire créé avec succès"));
      return response.data;
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la création du texte réglementaire"));
    throw error;
  }
};
