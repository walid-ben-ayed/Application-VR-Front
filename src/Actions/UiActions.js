// Import des constantes nécessaires
import { TOKEN, USERNAME, ROLE } from '@/Constants';

// Fonction pour gérer les éléments du localStorage lorsqu'un token expire
export const TokenExpired = () => {
  // Suppression des éléments pertinents du localStorage
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USERNAME);
  localStorage.removeItem(ROLE);
};
