
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
import { fetchChampApplications, deleteChampApplication } from '@/Actions/ChampApplicationActions';

export function Page() {
  const [champApplications, setChampApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const data = await fetchChampApplications(dispatch);
      setChampApplications(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load champ applications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce champ d\'application ?')) {
      try {
        console.log("id de delete",id)
        await deleteChampApplication(id, dispatch);
        loadData(); // Refresh the list
      } catch (error) {
        console.error('Error deleting champ application:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" spacing={4}>
          <Typography variant="h4">
            Champs d'application
          </Typography>
          <Button
            startIcon={<PlusIcon />}
            variant="contained"
            onClick={() => navigate(paths.dashboard.articleParams.champApplications.create)}
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
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">Chargement...</TableCell>
                  </TableRow>
                ) : champApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">Aucun champ d'application trouvé</TableCell>
                  </TableRow>
                ) : (
                  champApplications.map((champ) => (
                    <TableRow key={champ.id_champ_application}>
                      <TableCell>{champ.nom}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(paths.dashboard.articleParams.champApplications.edit(champ.id_champ_application))}
                          >
                            <PencilSimple />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(champ.id_champ_application)}
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
