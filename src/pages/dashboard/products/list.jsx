import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { LoiFormModal } from '@/components/widgets/modals/loi-form-modal';
import { useState } from 'react';

import { config } from '@/config';
import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { RouterLink } from '@/components/core/link';
import { ProductModal } from '@/components/dashboard/product/product-modal';
import { ProductsFilters } from '@/components/dashboard/product/products-filters';
import { ProductsPagination } from '@/components/dashboard/product/products-pagination';
import { ProductsTable } from '@/components/dashboard/product/products-table';
import { CodeFormModal } from '@/components/widgets/modals/code-form-modal';

const metadata = { title: `List | Products | Dashboard | ${config.site.name}` };

const products = [
  {
    id: 'PRD-005',
    name: 'Soja & Co. Eucalyptus',
    image: '/assets/product-5.png',
    category: 'Skincare',
    type: 'physical',
    quantity: 10,
    currency: 'USD',
    price: 65.99,
    sku: '592_LDKDI',
    status: 'draft',
    createdAt: dayjs().subtract(23, 'minute').toDate(),
  },
  {
    id: 'PRD-004',
    name: 'Necessaire Body Lotion',
    image: '/assets/product-4.png',
    category: 'Skincare',
    type: 'physical',
    quantity: 5,
    currency: 'USD',
    price: 17.99,
    sku: '321_UWEAJT',
    status: 'published',
    createdAt: dayjs().subtract(5, 'minute').subtract(1, 'hour').toDate(),
  },
  {
    id: 'PRD-003',
    name: 'Ritual of Sakura',
    image: '/assets/product-3.png',
    category: 'Skincare',
    type: 'physical',
    quantity: 8,
    currency: 'USD',
    price: 155,
    sku: '211_QFEXJO',
    status: 'draft',
    createdAt: dayjs().subtract(43, 'minute').subtract(3, 'hour').toDate(),
  },
  {
    id: 'PRD-002',
    name: 'Lancome Rouge',
    image: '/assets/product-2.png',
    category: 'Makeup',
    type: 'physical',
    quantity: 0,
    currency: 'USD',
    price: 95,
    sku: '978_UBFGJC',
    status: 'published',
    createdAt: dayjs().subtract(15, 'minute').subtract(4, 'hour').toDate(),
  },
  {
    id: 'PRD-001',
    name: 'Erbology Aloe Vera',
    image: '/assets/product-1.png',
    category: 'Healthcare',
    type: 'physical',
    quantity: 10,
    currency: 'USD',
    price: 24,
    sku: '401_1BBXBK',
    status: 'published',
    createdAt: dayjs().subtract(39, 'minute').subtract(7, 'hour').toDate(),
  },
];

export function Page() {
  const [openLoiModal, setOpenLoiModal] = useState(false);
  const [openCodeModal, setOpenCodeModal] = React.useState(false);
  const { category, previewId, sortDir, sku, status } = useExtractSearchParams();

  const orderedProducts = applySort(products, sortDir);
  const filteredProducts = applyFilters(orderedProducts, { category, sku, status });

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
          {/*<Card>
            <ProductsFilters filters={{ category, sku, status }} sortDir={sortDir} />
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              <ProductsTable rows={filteredProducts} />
            </Box>
            <Divider />
            <ProductsPagination count={filteredProducts.length} page={0} />
          </Card>*/}
        </Stack>
      </Box>
      <ProductModal open={Boolean(previewId)} />
    </React.Fragment>
  );
}

function useExtractSearchParams() {
  const [searchParams] = useSearchParams();

  return {
    category: searchParams.get('category') || undefined,
    previewId: searchParams.get('previewId') || undefined,
    sortDir: searchParams.get('sortDir') || undefined,
    sku: searchParams.get('sku') || undefined,
    status: searchParams.get('status') || undefined,
  };
}

// Sorting and filtering has to be done on the server.

function applySort(row, sortDir) {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

function applyFilters(row, { category, status, sku }) {
  return row.filter((item) => {
    if (category) {
      if (item.category !== category) {
        return false;
      }
    }

    if (status) {
      if (item.status !== status) {
        return false;
      }
    }

    if (sku) {
      if (!item.sku?.toLowerCase().includes(sku.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}
