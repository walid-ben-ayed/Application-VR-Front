
import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { Helmet } from 'react-helmet-async';
import { TextT as TextFormatIcon } from '@phosphor-icons/react/dist/ssr/TextT';
import { FileText as FileTextIcon } from '@phosphor-icons/react/dist/ssr/FileText';
import { PaperclipHorizontal as PaperclipIcon } from '@phosphor-icons/react/dist/ssr/PaperclipHorizontal';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { useDispatch } from 'react-redux';
import {  useParams } from 'react-router-dom';

import { config } from '@/config';
import { paths } from '@/paths';
import { RouterLink } from '@/components/core/link';
import { getTexteReglementaireVersions } from '@/Actions/TexteReglementaireActions';
import { UiActions } from '@/Slice/UiSlice';

const metadata = { title: `Versions du texte réglementaire | Dashboard | ${config.site.name}` };

export function Page() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const dispatch = useDispatch();
  const { productId } = useParams();  // Change from 'id' to 'productId'

// Normalize ID - handle different formats and ensure it's a proper value
const normalizeId = (rawId) => {
  if (!rawId) return null;
  // Remove any non-numeric characters if ID should be numeric
  // Or return as is if IDs can contain non-numeric characters
  return rawId.toString().trim();
};

const texteId = normalizeId(productId);  // Use only productId, remove searchParams fallback
  // Debug the ID value

  useEffect(() => {
    const fetchVersions = async () => {
      if (!texteId) {
        dispatch(UiActions.setIsError("ID du texte réglementaire manquant"));
        setLoading(false);
        return;
      }

      try {
        const data = await getTexteReglementaireVersions(texteId, dispatch);
        setVersions(data);
      } catch (error) {
        console.error("Failed to load versions:", error);
        dispatch(UiActions.setIsError("Échec du chargement des versions"));
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [texteId, dispatch]);

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

      // Create a base filename without extension
      let baseName = fileName.split('.').slice(0, -1).join('.');
      if (!baseName) baseName = fileName; // If no dots in filename, use the whole filename

      // Create a safe filename
      let safeFileName = baseName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

      // Add the determined extension
      const fullFileName = `${safeFileName}.${fileExtension}`;

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
          <Stack spacing={3}>
            <div>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.products.list}
                sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
                variant="subtitle2"
              >
                <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
                Base Réglementaire
              </Link>
            </div>
            <div>
              <Typography variant="h4">Historique des versions</Typography>
            </div>
          </Stack>

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
                      <TableCell>Résumé</TableCell>
                      <TableCell>Texte</TableCell>
                      <TableCell>Pièce jointe</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : versions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">Aucune version trouvée</TableCell>
                      </TableRow>
                    ) : (
                      versions.map((version, index) => (
                        <TableRow key={version.idVersionTexteReglementaire || index}>
                          <TableCell>{version.loiTitre}</TableCell>
                          <TableCell>{version.codeNom}</TableCell>
                          <TableCell>{version.champApplication}</TableCell>
                          <TableCell>{version.numeroArticle}</TableCell>
                          <TableCell>{version.version}</TableCell>
                          <TableCell>
                            <IconButton 
                              color="primary" 
                              onClick={() => handleOpenResumeModal(version.texteResume, "Résumé du texte")}
                              aria-label="Voir le résumé"
                            >
                              <TextFormatIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="primary" 
                              onClick={() => handleOpenTextModal(version.texte, "Texte intégral")}
                              aria-label="Voir le texte"
                            >
                              <FileTextIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            {version.pieceJointe ? (
                              <IconButton
                                color="primary"
                                onClick={() => handleDownloadAttachment(version.pieceJointe, version.loiTitre)}
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
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
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
    </React.Fragment>
  );
}
