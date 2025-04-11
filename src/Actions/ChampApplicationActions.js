import { UiActions } from "../Slice/UiSlice";
import axios from "axios";
import { TOKEN } from "@/Constants";
import { toast } from '@/components/core/toaster';
import { API_BASE_URL } from '@/Constants';



// 📌 Récupérer tous les champs d'application
export const fetchChampApplications = async (dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.get(`${API_BASE_URL}/api/champ-application`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    dispatch(UiActions.setIsError("Échec du chargement des champs d'application"));
    throw error;
  }
};

// 📌 Récupérer un champ par ID
export const getChampApplicationById = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.get(`${API_BASE_URL}/api/champ-application/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la récupération du champ d'application"));
    throw error;
  }
};

// 📌 Supprimer un champ
export const deleteChampApplication = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    await axios.delete(`${API_BASE_URL}/api/champ-application/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    dispatch(UiActions.setIsSuccess("Champ d'application supprimé avec succès"));
    toast.success("Champ d'application supprimé avec succès");
    
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la suppression du champ d'application"));
    toast.error("Échec de la suppression du champ d'application");
    throw error;
  }
};

// 📌 Mettre à jour un champ
export const updateChampApplication = async (id, champData, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.put(`${API_BASE_URL}/api/champ-application/${id}`, 
      { nom: champData.nom }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      dispatch(UiActions.setIsSuccess("Champ d'application mis à jour avec succès!"));
      toast.success("Champ d'application mis à jour avec succès");

      return response.data;
    }
  } catch (error) {
    dispatch(UiActions.setIsError(error.message));
    toast.error("Échec de mis à jour du champ d'application");
    throw error;
  }
};

// 📌 Ajouter un nouveau champ
export const addChampApplication = async (champData, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.post(`${API_BASE_URL}/api/champ-application`, 
      { nom: champData.nom }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      dispatch(UiActions.setIsSuccess("Champ d'application créé avec succès"));
      toast.success("Champ d'application créé avec succès");
      return response.data;
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la création du champ d'application"));
    toast.error("Échec de la création du champ d'application");
    throw error;
  }
};
