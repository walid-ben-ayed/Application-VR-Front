
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
import { paths } from '@/paths';
import { 
  addChampApplication, 
  updateChampApplication,
  getChampApplicationById 
} from '@/Actions/ChampApplicationActions';

export function Page() {
  const [formData, setFormData] = useState({ nom: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    const loadChampApplication = async () => {
      if (isEditMode) {
        try {
          const data = await getChampApplicationById(id, dispatch);
          setFormData({ nom: data.nom });
        } catch (error) {
          console.error("Failed to load champ application:", error);
        }
      }
    };

    loadChampApplication();
  }, [id, isEditMode, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {

        await updateChampApplication(id, formData, dispatch);
      } else {
        await addChampApplication(formData, dispatch);
      }
      navigate(paths.dashboard.articleParams.champApplications.list);
    } catch (error) {
      console.error("Failed to save champ application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h4">
            {isEditMode ? 'Modifier' : 'Créer'} un champ d'application
          </Typography>

          <Card>
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    onClick={() => navigate(paths.dashboard.articleParams.champApplications.list)}
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
