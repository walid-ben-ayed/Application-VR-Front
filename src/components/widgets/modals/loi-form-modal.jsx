import * as React from 'react';
import { useDispatch } from 'react-redux';
import { addLaw, fetchLois, updateLaw, getLawById, deleteLaw } from '@/Actions/LawActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { toast } from '@/components/core/toaster';
import { Trash2 } from "lucide-react";
export function LoiFormModal({ open, onClose, onSubmit }) {
  const dispatch = useDispatch();
  const [showList, setShowList] = React.useState(false);
  const [formData, setFormData] = React.useState({
    type: '',
    numLoi: '',
    date: '',
    nomLoi: '',
    source: ''
  });
  const [lois, setLois] = React.useState([]);
  const [selectedLawId, setSelectedLawId] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditing && selectedLawId) {
        // Update existing law
        await updateLaw(selectedLawId, formData, dispatch);
        toast.success("Loi modifiée avec succès");
        setIsEditing(false);
        setSelectedLawId(null);
      } else {
        // Create new law
        await addLaw(formData, dispatch);
        toast.success("Loi créée avec succès");
      }
      
      onSubmit?.(formData);
      // Reset form
      setFormData({
        type: '',
        numLoi: '',
        date: '',
        nomLoi: '',
        source: ''
      });
      
      // Refresh the list
      if (!showList) {
        setShowList(true);
      } else {
        const updatedLois = await fetchLois(dispatch);
        setLois(updatedLois);
      }
    } catch (error) {
      toast.error(isEditing ? "Échec de la modification" : "Échec de la création");
      console.error('Error submitting law:', error);
    }
  };
  const handleEdit = async (lawId) => {
    try {
      const lawData = await getLawById(lawId, dispatch);
      setFormData({
        type: lawData.type,
        numLoi: lawData.numero,
        date: lawData.date,
        nomLoi: lawData.nom,
        source: lawData.source
      });
      setSelectedLawId(lawId);
      setIsEditing(true);
      setShowList(false);
    } catch (error) {
      toast.error("Échec du chargement de la loi");
      console.error('Error fetching law:', error);
    }
  };
  const handleDelete = async (lawId) => {
    try {
      // Assuming you have a deleteLaw action
      await deleteLaw(lawId, dispatch);
      toast.success("Loi supprimée avec succès");
      const updatedLois = await fetchLois(dispatch);
      setLois(updatedLois);
    } catch (error) {
      toast.error("Échec de la suppression");
      console.error('Error deleting law:', error);
    }
  };
  const handleToggleView = () => {
    setShowList(!showList);
    if (isEditing) {
      setIsEditing(false);
      setSelectedLawId(null);
      setFormData({
        type: '',
        numLoi: '',
        date: '',
        nomLoi: '',
        source: ''
      });
    }
  };
  React.useEffect(() => {
    const getLois = async () => {
      try {
        const data = await fetchLois(dispatch);
        setLois(data);
      } catch (error) {
        console.error('Error fetching lois:', error);
        toast.error("Échec du chargement des lois");
      }
    };
    if (showList) {
      getLois();
    }
  }, [showList, dispatch]);
  return (
    <Dialog 
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <DialogContent>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {showList ? 'Liste de lois' : isEditing ? 'Modifier Loi' : 'Nouvelle Loi'}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={handleToggleView}>
              {showList ? 'Nouveau' : 'Liste Loi'}
            </Button>
            <IconButton onClick={onClose}>
              <XIcon />
            </IconButton>
          </Stack>
        </Stack>
        {showList ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lois.map((loi) => (
                <TableRow key={loi.id_loi}>
                  <TableCell>{loi.titre}</TableCell>
                  <TableCell>{loi.source}</TableCell>
                  <TableCell>{loi.date}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(loi.id_loi)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(loi.id_loi)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="loi">Loi</MenuItem>
                  <MenuItem value="decret">Decret</MenuItem>
                  <MenuItem value="arret">Arret</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Num de loi"
                name="numLoi"
                type="number"
                value={formData.numLoi}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Nom de loi"
                name="nomLoi"
                value={formData.nomLoi}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color={isEditing ? "primary" : "primary"}
              >
                {isEditing ? 'Modifier' : 'Ajouter'}
              </Button>
            </Stack>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 