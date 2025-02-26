import * as React from 'react';
import { useDispatch } from 'react-redux';
import { addCode, fetchCodes, updateCode, getCodeById, deleteCode } from '@/Actions/CodeActions';
import { fetchLois } from '@/Actions/LawActions';
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

export function CodeFormModal({ open, onClose, onSubmit }) {
  const dispatch = useDispatch();
  const [showList, setShowList] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nom: '',
    nom_loi: ''
  });
  const [codes, setCodes] = React.useState([]);
  const [lois, setLois] = React.useState([]);
  const [selectedCodeId, setSelectedCodeId] = React.useState(null);
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
      if (isEditing && selectedCodeId) {
        // Update existing code
        await updateCode(selectedCodeId, formData, dispatch);
        toast.success("Code modifié avec succès");
        setIsEditing(false);
        setSelectedCodeId(null);
      } else {
        // Create new code
        await addCode(formData, dispatch);
        toast.success("Code créé avec succès");
      }
      
      onSubmit?.(formData);
      // Reset form
      setFormData({
        nom: '',
        nom_loi: ''
      });
      
      // Refresh the list
      if (!showList) {
        setShowList(true);
      } else {
        const updatedCodes = await fetchCodes(dispatch);
        setCodes(updatedCodes);
      }
    } catch (error) {
      toast.error(isEditing ? "Échec de la modification" : "Échec de la création");
      console.error('Error submitting code:', error);
    }
  };

  const handleEdit = async (codeId) => {
    try {
      const codeData = await getCodeById(codeId, dispatch);
      setFormData({
        nom: codeData.nom,
        nom_loi: codeData.nom_loi
      });
      setSelectedCodeId(codeId);
      setIsEditing(true);
      setShowList(false);
    } catch (error) {
      toast.error("Échec du chargement du code");
      console.error('Error fetching code:', error);
    }
  };

  const handleDelete = async (codeId) => {
    try {
      await deleteCode(codeId, dispatch);
      toast.success("Code supprimé avec succès");
      const updatedCodes = await fetchCodes(dispatch);
      setCodes(updatedCodes);
    } catch (error) {
      toast.error("Échec de la suppression");
      console.error('Error deleting code:', error);
    }
  };

  const handleToggleView = () => {
    setShowList(!showList);
    if (isEditing) {
      setIsEditing(false);
      setSelectedCodeId(null);
      setFormData({
        nom: '',
        nom_loi: ''
      });
    }
  };

  // Fetch codes for the list view
  React.useEffect(() => {
    const getCodes = async () => {
      try {
        const data = await fetchCodes(dispatch);
        setCodes(data);
      } catch (error) {
        console.error('Error fetching codes:', error);
        toast.error("Échec du chargement des codes");
      }
    };
    if (showList) {
      getCodes();
    }
  }, [showList, dispatch]);

  // Fetch lois for the dropdown
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
    
    // Fetch lois when component mounts or when showing the form
    if (!showList) {
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
            {showList ? 'Liste des codes' : isEditing ? 'Modifier Code' : 'Nouveau Code'}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={handleToggleView}>
              {showList ? 'Nouveau' : 'Liste Code'}
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
                <TableCell>Nom</TableCell>
                <TableCell>Nom de Loi</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id_code}>
                  <TableCell>{code.nom}</TableCell>
                  <TableCell>{code.nom_loi}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(code.id_code)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(code.id_code)}
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
              <TextField
                fullWidth
                label="Nom du code"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Nom de loi</InputLabel>
                <Select
                  name="nom_loi"
                  value={formData.nom_loi}
                  onChange={handleChange}
                >
                  {lois.map((loi) => (
                    <MenuItem key={loi.id_loi} value={loi.nom}>
                      {loi.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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