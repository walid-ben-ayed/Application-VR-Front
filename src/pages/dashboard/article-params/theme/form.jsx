import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { paths } from '@/paths';
import { 
  addTheme, 
  updateTheme,
  getThemeById,
} from '@/Actions/ThemeActions';

import { fetchChampApplications } from '@/Actions/ChampApplicationActions';

export function Page() {
  const [formData, setFormData] = useState({ nom: '', nomChampApplication: '' });
  const [champApplications, setChampApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les thèmes si en mode édition
        if (isEditMode) {
          const data = await getThemeById(id, dispatch);
          setFormData({ nom: data.nom, nomChampApplication: data.nomChampApplication });
        }

        // Charger la liste des champs d'application
        const champs = await fetchChampApplications(dispatch);
        setChampApplications(champs.map((champ) => champ.nom));
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, [id, isEditMode, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await updateTheme(id, formData, dispatch);
      } else {
        await addTheme(formData, dispatch);
      }
      navigate(paths.dashboard.articleParams.theme.list);
    } catch (error) {
      console.error("Failed to save theme:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h4">
            {isEditMode ? 'Modifier' : 'Créer'} un Thème
          </Typography>

          <Card>
            <CardContent>
              <Stack spacing={3}>
                {/* Champ Nom */}
                <TextField
                  fullWidth
                  label="Nom"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />

                {/* Sélection du Champ d'Application */}
                <div>
                  <InputLabel>Nom de Champ d'Application</InputLabel>
                  <Select
                    fullWidth
                    name="nomChampApplication"
                    value={formData.nomChampApplication}
                    onChange={(e) => setFormData({ ...formData, nomChampApplication: e.target.value })}
                  >
                    {champApplications.map((champNom) => (
                      <MenuItem key={champNom} value={champNom}>
                        {champNom}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                {/* Boutons */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    onClick={() => navigate(paths.dashboard.articleParams.theme.list)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {isEditMode ? 'Modifier' : 'Créer'}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </form>
    </Box>
  );
}
