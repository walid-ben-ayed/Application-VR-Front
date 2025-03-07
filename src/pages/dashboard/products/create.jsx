import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import { config } from '@/config';
import { paths } from '@/paths';
import { RouterLink } from '@/components/core/link';
import { ProductCreateForm } from '@/components/dashboard/product/product-create-form';



const metadata = { title: `Create | Products | Dashboard | ${config.site.name}` };

function useExtractSearchParams() {
  const [searchParams] = useSearchParams();

  return {
    previewId: searchParams.get('previewId') || undefined,
    editId: searchParams.get('edit') || undefined,
  };
}

export function Page() {
  const { editId } = useExtractSearchParams();
  const isEditing = Boolean(editId);
  return (
    <React.Fragment>
      <Helmet>
        <title>{isEditing ? 'Modifier le texte réglementaire' : metadata.title}</title>
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
                Aricles
              </Link>
            </div>
            <div>
              <Typography variant="h4">
                {isEditing ? "Modifier le texte réglementaire" : "Créer un texte réglementaire"}
              </Typography>
            </div>
          </Stack>
          <ProductCreateForm isEditing={isEditing} editId={editId} />
        </Stack>
      </Box>
    </React.Fragment>
  );
}