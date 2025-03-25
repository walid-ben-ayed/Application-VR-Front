import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import { paths } from '@/paths';
import { fetchThemes, deleteTheme } from '@/Actions/ThemeActions';

export function Page() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const data = await fetchThemes(dispatch);
      setThemes(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load themes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce thème ?')) {
      try {
        await deleteTheme(id, dispatch);
        loadData(); // Refresh the list
      } catch (error) {
        console.error('Error deleting theme:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" spacing={4}>
          <Typography variant="h4">
            Liste des Thèmes
          </Typography>
          <Button
            startIcon={<PlusIcon />}
            variant="contained"
            onClick={() => navigate(paths.dashboard.articleParams.themes.create)}
          >
            Ajouter
          </Button>
        </Stack>

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Nom de Champ d'Application</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">Chargement...</TableCell>
                  </TableRow>
                ) : themes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">Aucun thème trouvé</TableCell>
                  </TableRow>
                ) : (
                  themes.map((theme) => (
                    <TableRow key={theme.id_theme}>
                      <TableCell>{theme.nom}</TableCell>
                      <TableCell>{theme.nomChampApplication}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(paths.dashboard.articleParams.theme.edit(theme.id_theme))}
                          >
                            <PencilSimple />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(theme.id_theme)}
                          >
                            <TrashSimple />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Stack>
    </Box>
  );
}
