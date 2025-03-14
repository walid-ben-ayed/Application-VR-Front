import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { UiActions } from "@/Slice/UiSlice";
import { addTexteReglementaire, updateTexteReglementaire, getTexteReglementaireById, updateTexteReglementairePlus } from '@/Actions/TexteReglementaireActions';
import { useDispatch } from 'react-redux';
import { paths } from '@/paths';
import { TextEditor } from '@/components/core/text-editor/text-editor';
import { fetchLois } from '@/Actions/LawActions';
import { fetchCodes } from '@/Actions/CodeActions';
import { FileDropzone } from '@/components/core/file-dropzone';
import { File as FileIcon } from '@phosphor-icons/react/dist/ssr/File';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';

export function ProductCreateForm({ editId = null, isNewVersion = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingTexteData, setLoadingTexteData] = useState(false);
  const [formData, setFormData] = useState({
    loiTitre: '',
    codeNom: '',
    numeroArticle: '',
    champApplication: '',
    texteResume: '',
    texte: '',
    pieceJointe: null,
    version: 1
  });
  const [lois, setLois] = useState([]);
  const [codes, setCodes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const isEditing = !!editId;

  useEffect(() => {
    const fetchLawsAndCodes = async () => {
      setIsLoadingData(true);
      try {
        const loisData = await fetchLois();
        setLois(loisData || []);
        const codesData = await fetchCodes();
        setCodes(codesData || []);
      } catch (error) {
        dispatch(UiActions.setIsError("Erreur lors du chargement des lois et codes"));
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchLawsAndCodes();
  }, [dispatch]);

  useEffect(() => {
    const fetchTexteData = async () => {
      if (isEditing && editId) {
        setLoadingTexteData(true);
        try {
          const texteData = await getTexteReglementaireById(editId, dispatch);
          if (texteData) {
            setFormData({
              loiTitre: texteData.loiTitre || '',
              codeNom: texteData.codeNom || '',
              numeroArticle: texteData.numeroArticle?.toString() || '',
              champApplication: texteData.champApplication || '',
              texteResume: texteData.texteResume || '',
              texte: texteData.texte || '',
              pieceJointe: texteData.pieceJointe || null,
              version: texteData.version || 1
            });

            if (texteData.pieceJointe) {
              const mockFile = new File(
                [""],
                "pièce-jointe." + (texteData.pieceJointe.includes("data:application/pdf") ? "pdf" : "docx"),
                { type: "application/octet-stream" }
              );
              setSelectedFile(mockFile);
            }
          }
        } catch (error) {
          console.error("Error fetching TexteReglementaire data:", error);
          dispatch(UiActions.setIsError("Erreur lors du chargement des données du texte réglementaire"));
        } finally {
          setLoadingTexteData(false);
        }
      }
    };

    fetchTexteData();
  }, [isEditing, editId, dispatch]);

  const handleFileDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setFormData(prevState => ({
        ...prevState,
        pieceJointe: file
      }));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData(prevState => ({
      ...prevState,
      pieceJointe: null
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleTextEditorChange = (field) => ({ editor }) => {
    const htmlContent = editor.getHTML();
    setFormData(prevState => ({
      ...prevState,
      [field]: htmlContent
    }));

    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.loiTitre) errors.loiTitre = "Le titre de la loi est requis";
    if (!formData.codeNom) errors.codeNom = "Le nom du code est requis";
    if (!formData.numeroArticle) errors.numeroArticle = "Le numéro d'article est requis";
    if (!formData.champApplication) errors.champApplication = "Le champ d'application est requis";
    if (!formData.texteResume) errors.texteResume = "Le résumé du texte est requis";
    if (!formData.texte) errors.texte = "Le texte complet est requis";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let result;

      const submitData = { ...formData };

      if (formData.pieceJointe instanceof File) {
        const base64String = await convertFileToBase64(formData.pieceJointe);
        submitData.pieceJointe = base64String;
      }

      if (isEditing) {
        if (isNewVersion) {
          result = await updateTexteReglementairePlus(editId, submitData, dispatch);
        } else {
          result = await updateTexteReglementaire(editId, submitData, dispatch);
        }
      } else {
        result = await addTexteReglementaire(submitData, dispatch);
      }

      if (result) {
        navigate(paths.dashboard.products.list);
      }
    } catch (error) {
      if (isNewVersion) {
        console.error("Erreur lors de la création de la nouvelle version:", error);
      } else {
        console.error(isEditing ? "Erreur lors de la modification du texte réglementaire:" : "Erreur lors de la création du texte réglementaire:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData || loadingTexteData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <Card>
          <CardHeader
            title={isNewVersion ? "Nouvelle Version" : isEditing ? "Modifier le texte réglementaire" : "Créer un texte réglementaire"}
            subheader={isNewVersion ? "Créer une nouvelle version du texte réglementaire" : isEditing ? "Modifier les détails du texte réglementaire" : "Ajouter les détails du texte réglementaire"}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!validationErrors.loiTitre}>
                  <InputLabel required>Titre de la loi</InputLabel>
                  <Select
                    name="loiTitre"
                    value={formData.loiTitre}
                    onChange={handleChange}
                    required
                    input={<OutlinedInput label="Titre de la loi" />}
                  >
                    {lois.map((loi) => (
                      <MenuItem key={loi.id} value={loi.titre}>
                        {loi.titre}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.loiTitre && (
                    <Typography color="error" variant="caption">{validationErrors.loiTitre}</Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!validationErrors.codeNom}>
                  <InputLabel required>Nom du code</InputLabel>
                  <Select
                    name="codeNom"
                    value={formData.codeNom}
                    onChange={handleChange}
                    required
                    input={<OutlinedInput label="Nom du code" />}
                  >
                    {codes.map((code) => (
                      <MenuItem key={code.id} value={code.nom}>
                        {code.nom}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.codeNom && (
                    <Typography color="error" variant="caption">{validationErrors.codeNom}</Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!validationErrors.numeroArticle}>
                  <InputLabel required>Numéro d'article</InputLabel>
                  <OutlinedInput
                    name="numeroArticle"
                    onChange={handleChange}
                    required
                    type="number"
                    value={formData.numeroArticle}
                    label="Numéro d'article"
                  />
                  {validationErrors.numeroArticle && (
                    <Typography color="error" variant="caption">{validationErrors.numeroArticle}</Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!validationErrors.champApplication}>
                  <InputLabel required>Champ d'application</InputLabel>
                  <OutlinedInput
                    name="champApplication"
                    onChange={handleChange}
                    required
                    value={formData.champApplication}
                    label="Champ d'application"
                  />
                  {validationErrors.champApplication && (
                    <Typography color="error" variant="caption">{validationErrors.champApplication}</Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Texte complet"
            subheader="Saisissez le contenu complet du texte réglementaire"
          />
          <Divider />
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                Texte complet *
              </Typography>
              <Box sx={{ '& .tiptap-container': { minHeight: '350px' } }}>
                <TextEditor
                  content={formData.texte}
                  onUpdate={handleTextEditorChange('texte')}
                  placeholder="Écrivez le texte réglementaire complet..."
                />
              </Box>
              {validationErrors.texte && (
                <Typography color="error" variant="caption">{validationErrors.texte}</Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Résumé du texte"
            subheader="Fournissez un résumé clair et concis du texte réglementaire"
          />
          <Divider />
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                Résumé du texte *
              </Typography>
              <Box sx={{ '& .tiptap-container': { minHeight: '150px' } }}>
                <TextEditor
                  content={formData.texteResume}
                  onUpdate={handleTextEditorChange('texteResume')}
                  placeholder="Écrivez un résumé du texte réglementaire..."
                />
              </Box>
              {validationErrors.texteResume && (
                <Typography color="error" variant="caption">{validationErrors.texteResume}</Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Pièce jointe"
            subheader="Ajoutez une pièce jointe si nécessaire (optionnel)"
          />
          <Divider />
          <CardContent>
            {!selectedFile ? (
              <FileDropzone
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc', '.docx'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png']
                }}
                caption="PDF, DOC, DOCX, JPG, PNG jusqu'à 10MB"
                maxFiles={1}
                maxSize={10485760}
                onDrop={handleFileDrop}
              />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Avatar
                      sx={{
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        height: 40,
                        mr: 1,
                        width: 40
                      }}
                    >
                      <FileIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography noWrap variant="subtitle2">
                        {selectedFile.name}
                      </Typography>
                      <Typography color="text.secondary" noWrap variant="body2">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    color="error"
                    onClick={handleRemoveFile}
                    size="small"
                    variant="text"
                  >
                    Supprimer
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(paths.dashboard.products.list)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {isNewVersion ? 'Créer nouvelle version' : isEditing ? 'Modifier le texte réglementaire' : 'Créer le texte réglementaire'}
          </Button>
        </Box>
      </Stack>
    </form>
  );
}