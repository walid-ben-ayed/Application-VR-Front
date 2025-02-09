import { TOKEN } from "@/Constants";
import { throwMainException } from "@/Actions/ErrorHandling";
import { UiActions } from "../Slice/UiSlice";
import { readFileContent } from "../Utils/ReadFileContent";

// Fonction pour récupérer l'URL de l'API à partir d'un fichier de configuration
async function getApiUrl() {
  try {
    const fileContent = await readFileContent(`/public/connection.txt`);
    if (typeof fileContent === "string") {
      const [ipAddress, port] = fileContent.split(";");
      return `http://${ipAddress}:${port}`;
    }
    throw new Error("Fichier de configuration invalide");
  } catch (error) {
    throw new Error("Impossible de récupérer l'URL de l'API");
  }
}

// Fonction pour créer les options de requête
export function createRequestOptions(method, body) {
  
  const storedToken = localStorage.getItem(TOKEN);

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": storedToken && storedToken !== "null" ? `Bearer ${storedToken}` : "", // Évite "Bearer null"
    },
  };

  if (body) {
    options.body = body;
  }

  return options;
}

// Fonction pour envoyer une requête API
export async function sendRequest(url, options, dispatch) {
  try {
    const apiUrl = await getApiUrl();
    const fullUrl = new URL(url, apiUrl).href; // Construction de l'URL complète

    if (options?.method !== "") {
      dispatch?.(UiActions.setIsSuccess("")); // Indiquer le début de l'opération
    }

    const response = await fetch(fullUrl, options);

    // Gestion des erreurs HTTP
    if (!response.ok) {
      let errorMessage = await response.text();
      if (response.status === 500) {
        errorMessage = "Erreur du serveur";
      } else if (response.status === 404) {
        errorMessage = "Données non trouvées";
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json();

    if (dispatch) {
      if (options?.method !== "") {
        dispatch(UiActions.setIsSuccess(responseData.message));
      }
    }

    return options?.method !== "DELETE" ? responseData.data : undefined;
  } catch (error) {
    if (dispatch) {
      throwMainException(error.toString(), dispatch);
    }
    throw error;
  }
}

// Fonction pour envoyer une requête avec des paramètres OData
export async function sendRequestOdata(url, options, dispatch) {
  try {
    const apiUrl = await getApiUrl();
    dispatch?.(UiActions.setIsLoading(true));


    const response = await fetch(apiUrl + url, options);

    if (!response.ok) {
      let errorMessage = await response.text();
      if (response.status === 500) errorMessage = "Erreur du serveur";
      else if (response.status === 404) errorMessage = "Données non trouvées";
      else if (response.status === 401) errorMessage = "Non autorisé";
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    dispatch?.(UiActions.setIsLoading(false));


    return options?.method !== "DELETE" ? responseData : undefined;
  } catch (error) {
    if (dispatch) {
      throwMainException(error.toString(), dispatch);
    }
    throw error;
  }
}
