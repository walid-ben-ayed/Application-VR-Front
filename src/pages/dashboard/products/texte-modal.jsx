
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function TexteModal({ open, onClose, texte, type }) {
  const title = type === 'resume' ? 'Résumé du Texte Réglementaire' : 'Texte Réglementaire Complet';
  const content = type === 'resume' ? texte.texteResume : texte.texte;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={onClose}>
            <XIcon />
          </IconButton>
        </Stack>
        
        <ReactQuill
          theme="bubble"
          value={content}
          readOnly={true}
          modules={{ toolbar: false }}
        />
      </DialogContent>
    </Dialog>
  );
}
