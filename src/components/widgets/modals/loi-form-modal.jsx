import * as React from 'react';
import { useDispatch } from 'react-redux';
import { addLaw, fetchLois } from '@/Actions/LawActions';
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

  // Mock data - replace with actual data from your backend
  

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addLaw(formData, dispatch);
      // Assuming 'toast' is available in the scope.  If not, replace with your notification method.
      toast.success("Code créé avec succes");
      onSubmit?.(formData);
      setFormData({
        type: '',
        numLoi: '',
        date: '',
        nomLoi: '',
        source: ''
      });
    } catch (error) {
      // Assuming 'toast' is available in the scope.  If not, replace with your notification method.
      toast.error("Échec de la création du code");
      console.error('Error submitting law:', error);
    }
  };

  const handleToggleView = () => {
    setShowList(!showList);
  };

  React.useEffect(() => {
    const getLois = async () => {
      try {
        const data = await fetchLois(dispatch);
        setLois(data);
      } catch (error) {
        console.error('Error fetching lois:', error);
        // Assuming 'toast' is available in the scope.  If not, replace with your notification method.
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
          <Typography variant="h6">{showList ? 'Liste de lois' : 'Loi Form'}</Typography>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {lois.map((loi, index) => (
                <TableRow key={index}>
                  <TableCell>{loi.titre}</TableCell>
                  <TableCell>{loi.source}</TableCell>
                  <TableCell>{loi.date}</TableCell>
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
              >
                Submit
              </Button>
            </Stack>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}