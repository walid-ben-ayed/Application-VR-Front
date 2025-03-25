import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoiFormModal } from '@/components/widgets/modals/loi-form-modal';
import { useState, useEffect } from 'react';
import { TextT as TextFormatIcon } from '@phosphor-icons/react/dist/ssr/TextT';
import { FileText as FileTextIcon } from '@phosphor-icons/react/dist/ssr/FileText';
import { PaperclipHorizontal as PaperclipIcon } from '@phosphor-icons/react/dist/ssr/PaperclipHorizontal';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import { useDispatch } from 'react-redux';
import { UiActions } from '@/Slice/UiSlice';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';

import { config } from '@/config';
import { paths } from '@/paths';
import { RouterLink } from '@/components/core/link';
import { ProductModal } from '@/components/dashboard/product/product-modal';
import { CodeFormModal } from '@/components/widgets/modals/code-form-modal';
import { fetchTexteReglementaire, deleteTexteReglementaire, getTexteReglementaireById } from '@/Actions/TexteReglementaireActions';

const metadata = { title: `Liste des textes réglementaires | Dashboard | ${config.site.name}` };

export function Page() {
  const [openLoiModal, setOpenLoiModal] = useState(false);
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [texteReglementaires, setTexteReglementaires] = useState({ content: [], totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Added state for page number
  const [size] = useState(5); // Added state for page size (fixed to 5)
  const [searchTerm, setSearchTerm] = useState(''); // Added state for search term
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { previewId } = useExtractSearchParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTexteReglementaire(dispatch, page, size, searchTerm);
        setTexteReglementaires(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load texte reglementaire:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, page, searchTerm]); // Added page and searchTerm to dependencies


  const handleOpenTextModal = (text, title) => {
    setSelectedContent(text);
    setSelectedTitle(title);
    setTextModalOpen(true);
  };

  const handleOpenResumeModal = (text, title) => {
    setSelectedContent(text);
    setSelectedTitle(title);
    setResumeModalOpen(true);
  };

  // Handler for editing a TexteReglementaire
  const handleEditTexte = async (id, isNewVersion = false) => {
    try {
      console.log("Editing texte with ID:", id, "New version:", isNewVersion);
      if (!id) {
        dispatch(UiActions.setIsError("ID du texte réglementaire manquant"));
        return;
      }

      const texteData = await getTexteReglementaireById(id, dispatch);
      if (texteData) {
        // Navigate to create page with the data for editing
        // Pass additional parameter for new version if needed
        navigate(`${paths.dashboard.products.create}?edit=${id}${isNewVersion ? '&newVersion=true' : ''}`);
      }
    } catch (error) {
      console.error('Error fetching texte reglementaire for edit:', error);
      dispatch(UiActions.setIsError("Erreur lors de la récupération du texte réglementaire"));
    }
  };

  // Handler for deleting a TexteReglementaire
  const handleDeleteTexte = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce texte réglementaire ?')) {
      try {
        const success = await deleteTexteReglementaire(id, dispatch);
        if (success) {
          // Refresh the list after deletion
          const data = await fetchTexteReglementaire(dispatch, page, size, searchTerm);
          setTexteReglementaires(data.content); // Access content property of the Page object
        }
      } catch (error) {
        console.error('Error deleting texte reglementaire:', error);
        dispatch(UiActions.setIsError("Erreur lors de la suppression du texte réglementaire"));
      }
    }
  };

  const handleDownloadAttachment = (base64Data, fileName) => {
    if (!base64Data) return;

    try {
      // Extract file type from base64 string
      let fileExtension = 'pdf'; // Default to PDF for backward compatibility
      let mimeType = 'application/pdf';
      let dataForBlob = base64Data;

      // Check if it's a data URL
      if (base64Data.startsWith('data:')) {
        const match = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);

        if (match && match.length > 1) {
          mimeType = match[1];
          dataForBlob = base64Data.split(',')[1];

          // Map MIME types to extensions - focusing on PDF and DOCX
          if (mimeType === 'application/pdf') {
            fileExtension = 'pdf';
          } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            fileExtension = 'docx';
          } else if (mimeType === 'application/msword') {
            fileExtension = 'doc';
          } else {
            // For other types, try to extract extension from MIME type
            const mimeExtension = mimeType.split('/')[1];
            if (mimeExtension && mimeExtension !== 'octet-stream') {
              fileExtension = mimeExtension;
            }
          }
        }
      } else {
        // Handle raw base64 data by checking for magic bytes

        // PDF Magic Bytes: %PDF- (JVBERi in base64)
        if (base64Data.startsWith('JVBERi')) {
          fileExtension = 'pdf';
          mimeType = 'application/pdf';
        } 
        // DOCX Magic Bytes: PK.. (UEs in base64) - this is for ZIP files which DOCX files are
        else if (base64Data.startsWith('UEs')) {
          // This could be a DOCX file (or any Office Open XML format)
          // Since we can't definitively tell from just magic bytes, use filename if available
          const originalExt = fileName.split('.').pop();
          if (originalExt && ['docx', 'xlsx', 'pptx'].includes(originalExt.toLowerCase())) {
            fileExtension = originalExt.toLowerCase();

            // Set appropriate MIME type
            const mimeMap = {
              'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            };
            mimeType = mimeMap[fileExtension];
          } else {
            // If we can't determine specifically, default to DOCX
            fileExtension = 'docx';
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          }
        }
        // Try to detect from filename if available and we haven't determined yet
        else {
          const originalExt = fileName.split('.').pop();
          if (originalExt && originalExt.length > 0 && originalExt.length < 5) {
            const lowerExt = originalExt.toLowerCase();
            fileExtension = lowerExt;

            // Basic MIME type mapping
            const extToMime = {
              'pdf': 'application/pdf',
              'doc': 'application/msword',
              'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            };
            mimeType = extToMime[lowerExt] || 'application/octet-stream';
          }
        }
      }

      console.log('Detected MIME type:', mimeType);
      console.log('Detected file extension:', fileExtension);

      // Create a base filename without extension
      let baseName = fileName.split('.').slice(0, -1).join('.');
      if (!baseName) baseName = fileName; // If no dots in filename, use the whole filename

      // Create a safe filename
      let safeFileName = baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

      // Add the determined extension
      const fullFileName = `${safeFileName}.${fileExtension}`;
      console.log('Using filename:', fullFileName);

      // Convert base64 to blob
      const byteString = atob(dataForBlob);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeType });

      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fullFileName;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      dispatch(UiActions.setIsError("Erreur lors du téléchargement de la pièce jointe"));
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Base Réglementaire</Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                href={paths.dashboard.products.create}
                startIcon={<PlusIcon />}
                variant="contained"
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenLoiModal(true)}
              >
                Loi-Décret-Article-Circulaire
              </Button>
              <LoiFormModal
                open={openLoiModal}
                onClose={() => setOpenLoiModal(false)}
                onSubmit={(data) => {
                  console.log('Form submitted:', data);
                  // Handle form submission here
                }}
              />
              <Button
                variant="contained"
                onClick={() => setOpenCodeModal(true)}
              >
                Code
              </Button>
              <CodeFormModal
                open={openCodeModal}
                onClose={() => setOpenCodeModal(false)}
                onSubmit={(data) => {
                  console.log('Code form submitted:', data);
                  // Handle code form submission here
                }}
              />
            </Stack>
          </Stack>
          <Box sx={{ mb: 2 }}> {/* Added search bar */}
            <TextField
              fullWidth
              label="Rechercher par titre de loi"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0); // Reset page to 0 when search term changes
              }}
            />
          </Box>
          <Card>
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Titre de la loi</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>Champ d'application</TableCell>
                      <TableCell>Numéro d'article</TableCell>
                      <TableCell>Version</TableCell>
                      <TableCell>Texte</TableCell>
                      <TableCell>Résumé</TableCell>
                      <TableCell>Pièce jointe</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">Chargement des données...</TableCell>
                      </TableRow>
                    ) : texteReglementaires.content.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">Aucun texte réglementaire trouvé</TableCell>
                      </TableRow>
                    ) : (
                      texteReglementaires.content.map((texte, index) => (
                        <TableRow key={index}>
                          <TableCell>{texte.loiTitre}</TableCell>
                          <TableCell>{texte.codeNom}</TableCell>
                          <TableCell>{texte.champApplication}</TableCell>
                          <TableCell>{texte.numeroArticle}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                color="success"
                                onClick={() => handleEditTexte(texte.idTexteReglementaire, true)}
                                aria-label="Nouvelle Version"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 11V5h4l-7 8-7-8h4v6"/><path d="M21 19H3"/><path d="M21 15H3"/><path d="M21 11H17.5"/><path d="M21 7H11"/></svg>
                              </IconButton>
                              <IconButton
                                color="info"
                                onClick={() => {
                                  navigate(`/dashboard/products/${texte.idTexteReglementaire}`);
                                }}
                                aria-label="Liste des versions"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                              </IconButton>
                            </Stack>
                          </TableCell>
              
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography noWrap sx={{ maxWidth: 200 }}>
                              {texte.texte?.replace(/<[^>]*>/g, '').split(' ').slice(0, 8).join(' ')}...
                              </Typography>
                              <IconButton 
                                color="primary" 
                                onClick={() => handleOpenTextModal(texte.texte, "Texte intégral")}
                                aria-label="Voir le texte"
                              >
                                <FileTextIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="primary" 
                              onClick={() => handleOpenResumeModal(texte.texteResume, "Résumé du texte")}
                              aria-label="Voir le résumé"
                            >
                              <TextFormatIcon />
                            </IconButton>
                          </TableCell>
                          
                          <TableCell>
                            {texte.pieceJointe ? (
                              <IconButton
                                color="primary"
                                onClick={() => handleDownloadAttachment(texte.pieceJointe, texte.loiTitre)}
                                aria-label="Télécharger la pièce jointe"
                              >
                                <PaperclipIcon />
                              </IconButton>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                color="primary"
                                onClick={() => handleEditTexte(texte.idTexteReglementaire)}
                                aria-label="Modifier"
                              >
                                <PencilSimple />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteTexte(texte.idTexteReglementaire)}
                                aria-label="Supprimer"
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
              <TablePagination
                component="div"
                count={texteReglementaires.totalElements || 0}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={size}
                rowsPerPageOptions={[5]}
                nextIconButtonProps={{
                  'aria-label': 'Page suivante'
                }}
                backIconButtonProps={{
                  'aria-label': 'Page précédente'
                }}
              />
            </Box>
          </Card>
        </Stack>
      </Box>

      {/* Modal for displaying text content */}
      <Dialog 
        open={textModalOpen} 
        onClose={() => setTextModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {selectedTitle}
            <IconButton onClick={() => setTextModalOpen(false)}>
              <XIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <div dangerouslySetInnerHTML={{ __html: selectedContent }} />
        </DialogContent>
      </Dialog>

      {/* Modal for displaying resume content */}
      <Dialog 
        open={resumeModalOpen} 
        onClose={() => setResumeModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {selectedTitle}
            <IconButton onClick={() => setResumeModalOpen(false)}>
              <XIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <div dangerouslySetInnerHTML={{ __html: selectedContent }} />
        </DialogContent>
      </Dialog>

      <ProductModal open={Boolean(previewId)} />
    </React.Fragment>
  );
}

function useExtractSearchParams() {
  const [searchParams] = useSearchParams();

  return {
    previewId: searchParams.get('previewId') || undefined,
  };
}