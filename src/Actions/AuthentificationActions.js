import { UiActions } from "../Slice/UiSlice";
import { AuthentificationActions } from '../Slice/AuthentificationSlice';
import axios from 'axios';

export const Login = async (user,dispatch) => {
  try {
    const response = await axios.post('http://localhost:9090/api/auth/login', {
      email:user.email,
      password:user.password,
    });
    if (response) {
      const data = await response.data;
      // Dispatch success action
      dispatch(AuthentificationActions.Login(response.data));

      // Extraction des données
      const { token, username, roles } = data;

      // Stockage des informations utilisateur
      localStorage.setItem('custom-auth-token', token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", roles);

      // Dispatch de l'action de connexion réussie
      dispatch(UiActions.setIsSuccess("Connexion réussie !"));
      return response;
    }
         
  } catch (error) {
    // Dispatch d'une action pour indiquer l'échec
    dispatch(UiActions.setIsError(error.message));
    error.message = 'Invalid credentials'
    throw error; // Remonter l'erreur si besoin
  }
};
// Action pour le login
/*export const Login = async (user, dispatch) => {
  try {
    console.log("🔄 Tentative de connexion avec :", user);

    // Envoi de la requête de connexion

    const response = await sendRequest(
      "/api/auth/login",
      createRequestOptions("POST", {
        body:{
          email: user.email,
          password: user.password,
        }
      }),
      dispatch
    );

    console.log("reponse recue de l'api:",response);
    
    if (response) {
      const data = await response;
      // Dispatch success action
      dispatch(AuthentificationActions.Login(response));

    // Extraction des données
    const { token, username, roles } = data;

    // Stockage des informations utilisateur
    localStorage.setItem('custom-auth-token', token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", roles);

    console.log("🔐 Token stocké :", token);
    console.log("👤 Utilisateur connecté :", username, roles);

    // Dispatch de l'action de connexion réussie
    dispatch(UiActions.setIsSuccess("Connexion réussie !"));
    return response;}

  } catch (error) {
    // Dispatch d'une action pour indiquer l'échec
    dispatch(UiActions.setIsError(error.message));
    console.log("error",error)

    throw error; // Remonter l'erreur si besoin
  }
};*/
// Action pour le logout
export const Logout = (dispatch) => {

  // Suppression des données utilisateur du localStorage
  localStorage.removeItem("custom-auth-token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");

  // Dispatch d'une action Redux pour mettre à jour l'état
  dispatch(UiActions.setIsSuccess("Déconnexion réussie !"));

};
