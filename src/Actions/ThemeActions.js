import { UiActions } from "../Slice/UiSlice";
import axios from "axios";
import { TOKEN } from "@/Constants";
import { toast } from '@/components/core/toaster';


// 📌 Récupérer tous les thèmes
export const fetchThemes = async (dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.get("http://localhost:9090/api/themes", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    dispatch(UiActions.setIsError("Échec du chargement des thèmes"));
    throw error;
  }
};

// 📌 Récupérer un thème par ID
export const getThemeById = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.get(`http://localhost:9090/api/themes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la récupération du thème"));
    throw error;
  }
};

// 📌 Supprimer un thème
export const deleteTheme = async (id, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    await axios.delete(`http://localhost:9090/api/themes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    dispatch(UiActions.setIsSuccess("Thème supprimé avec succès"));
    toast.success("Thème supprimé avec succès");

  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la suppression du thème"));
    toast.error("Échec de la suppression du Thème");

    throw error;
  }
};

// 📌 Mettre à jour un thème
export const updateTheme = async (id, themeData, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.put(
      `http://localhost:9090/api/themes/${id}`,
      {
        nom: themeData.nom,
        nomChampApplication: themeData.nomChampApplication,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      dispatch(UiActions.setIsSuccess("Thème mis à jour avec succès!"));
      toast.success("Thème mis à jour avec succès");
      return response.data;
    }
  } catch (error) {
    dispatch(UiActions.setIsError(error.message));
    toast.error("Échec de la mis à jour du Thème");
    throw error;
  }
};

// 📌 Ajouter un nouveau thème
export const addTheme = async (themeData, dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN);
    const response = await axios.post(
      "http://localhost:9090/api/themes",
      {
        nom: themeData.nom,
        nomChampApplication: themeData.nomChampApplication,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      dispatch(UiActions.setIsSuccess("Thème créé avec succès"));
      toast.success("Thème créé avec succès");

      return response.data;
    }
  } catch (error) {
    dispatch(UiActions.setIsError("Échec de la création du thème"));
    toast.error("Échec de la création du Thème");
    throw error;
  }
};
