import { UiActions } from "../Slice/UiSlice";
import axios from 'axios';
import { TOKEN } from "@/Constants";
import { toast } from '@/components/core/toaster';
import { API_BASE_URL } from '@/Constants';


export const fetchTexteReglementaire = async (dispatch, page = 0, size = 5, searchTerm = '') => {
  try {
    const token = localStorage.getItem(TOKEN);
    
    // Construire l'URL avec les paramètres de requête
    let url = `${API_BASE_URL}/api/texteReglementaire?page=${page}&size=${size}`;
    
    // Ajouter le paramètre de recherche s'il existe
    if (searchTerm && searchTerm.trim() !== '') {
      url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data; // Cela retournera un objet Page avec le contenu et les métadonnées de pagination
  } catch (error) {
    dispatch(UiActions.setIsError("Échec du chargement des textes réglementaires"));
    throw error;
  }
};

export const getTexteReglementaireById = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.get(`${API_BASE_URL}/api/texteReglementaire/${id}`, {
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

export const filterTexteReglementaire = async (dispatch, page = 0, size = 5, champApplication = '', theme = '', searchTerm = '') => {
  try {
      const token = localStorage.getItem(TOKEN);

      // Construire l'URL avec les paramètres de requête
      let url = `${API_BASE_URL}/api/texteReglementaire/filter?page=${page}&size=${size}`;

      // Ajouter les paramètres de filtre s'ils existent
      if (champApplication && champApplication.trim() !== '') {
          url += `&champApplication=${encodeURIComponent(champApplication)}`;
      }

      if (theme && theme.trim() !== '') {
          url += `&theme=${encodeURIComponent(theme)}`;
      }

      if (searchTerm && searchTerm.trim() !== '') {
          url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
      }

      const response = await axios.get(url, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      return response.data;
  } catch (error) {
      dispatch(UiActions.setIsError("Échec du filtrage des textes réglementaires"));
      throw error;
  }
};


export const deleteTexteReglementaire = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.delete(`${API_BASE_URL}/api/texteReglementaire/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'  
      }
    });
    if (response.status === 200) {
      toast.success("Texte réglementaire supprimé avec succès");
      dispatch(UiActions.setIsSuccess("Texte réglementaire supprimé avec succès"));
      return true;
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la suppression du texte réglementaire"));
    toast.error("Échec de supprimé du texte réglementaire");
    throw error;
  }
};

export const updateTexteReglementaire = async (id, data, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.put(`${API_BASE_URL}/api/texteReglementaire/${id}`, {
      loiTitre: data.loiTitre,
      codeNom: data.codeNom,
      champApplication: data.champApplication,
      theme: data.theme,
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
      toast.success("Texte réglementaire mis à jour avec succès");
      return response.data;
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la mise à jour du texte réglementaire"));
    toast.error("Échec de la mise à jour du texte réglementaire");
    throw error;
  }
};

export const addTexteReglementaire = async (data, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.post(`${API_BASE_URL}/api/texteReglementaire`, {
      loiTitre: data.loiTitre,
      codeNom: data.codeNom,
      champApplication: data.champApplication,
      theme: data.theme,
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
      toast.success("Texte réglementaire créé avec succès");
      return response.data;
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la création du texte réglementaire"));
    toast.error("Échec de la création du texte réglementaire");
    throw error;
  }
};


export const updateTexteReglementairePlus = async (id, data, dispatch) => {
  console.log(`Updating texte with ID: ${id} and creating a new version`, data);
  
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.put(`${API_BASE_URL}/api/texteReglementaire/${id}/plus`, {
      loiTitre: data.loiTitre,
      codeNom: data.codeNom,
      champApplication: data.champApplication,
      theme: data.theme,
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
      dispatch(UiActions.setIsSuccess("Texte réglementaire mis à jour avec succès et nouvelle version créée"));
      toast.success("Texte réglementaire mis à jour avec succès et nouvelle version créée");
      return response.data;
    }
  } catch (error) {
    console.error("Error updating texte with version:", error);
    dispatch(UiActions.setIsError("Échec de la mise à jour du texte réglementaire et de la création de version"));
    toast.error("Échec de la mise à jour du texte réglementaire et de la création de version");
    throw error;
  }
};

export const getTexteReglementaireVersions = async (id, dispatch) => {
  console.log("getTexteReglementaireVersions called with ID:", id);
  console.log("ID type:", typeof id);
  
  if (!id) {
    dispatch(UiActions.setIsError("ID du texte réglementaire manquant"));
    throw new Error("ID du texte réglementaire manquant");
  }

  try {
    const token = localStorage.getItem(TOKEN);
    
    if (!token) {
      dispatch(UiActions.setIsError("Vous n'êtes pas authentifié. Veuillez vous reconnecter."));
      throw new Error("Token d'authentification manquant");
    }
    
    console.log(`Fetching versions for texte with ID: ${id}`);
    const response = await axios.get(`${API_BASE_URL}/api/texteReglementaire/${id}/versions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("API versions response:", response.status, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching texte versions:`, error);
    
    if (error.response && error.response.status === 401) {
      dispatch(UiActions.setIsError("Session expirée. Veuillez vous reconnecter."));
    } else {
      dispatch(UiActions.setIsError("Échec de la récupération des versions du texte réglementaire"));
      toast.error("Échec de la récupération des versions du texte réglementaire");
    }
    
    throw error;
  }
};
