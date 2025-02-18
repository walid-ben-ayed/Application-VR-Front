import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import { config } from '@/config';
import { Inputs1 } from '@/components/widgets/inputs/inputs-1';
import { Inputs2 } from '@/components/widgets/inputs/inputs-2';
import { Inputs3 } from '@/components/widgets/inputs/inputs-3';
import { Inputs4 } from '@/components/widgets/inputs/inputs-4';
import { Layout } from '@/components/widgets/layout';

const metadata = { title: `Inputs | Components | ${config.site.name}` };

const components = [
  { title: 'Inputs 1', element: <Inputs1 /> },
  { title: 'Inputs 2', element: <Inputs2 /> },
  { title: 'Inputs 3', element: <Inputs3 /> },
  { title: 'Inputs 4', element: <Inputs4 /> },
];

export function Page() {
  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Layout components={components} title="Inputs" />
    </React.Fragment>
  );
}
