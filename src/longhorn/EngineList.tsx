import React from 'react';
import {
  SectionBox,
  SectionFilterHeader,
  Link,
} from '@kinvolk/headlamp-plugin/lib/components/common';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import { engineClass } from './crd';
import { NameLink } from '../helpers';
import Table from '../common/Table';
import StatusLabel from '../common/StatusLabel'; // Import StatusLabel for Engine state

export function Engines() {
  const filterFunction = useFilterFunc();
  const [engines, error] = engineClass().useList();

  if (error?.status === 404) {
    return <SectionBox title="Engines">Longhorn Engines CRD not found.</SectionBox>;
  }
  if (error) {
    return <SectionBox title="Engines">Error loading Engines: {error.message}</SectionBox>;
  }

  return (
    <SectionBox title={<SectionFilterHeader title="Engines" />}>
      <Table
        data={engines}
        columns={[
          NameLink(engineClass(), 'longhorn/engines'), // Link to Engine detail
          'namespace', // Engines are namespaced
          {
            header: 'State',
            accessorKey: 'status.currentState',
            // Potentially use StatusLabel if states match or adapt StatusLabel
            // accessorFn: (item: any) => <StatusLabel item={item} />, 
          },
          {
            header: 'Node',
            accessorKey: 'spec.nodeID',
          },
          {
             header: 'Volume',
             accessorKey: 'spec.volumeName',
             Cell: ({ cell, row }) => (
                <Link 
                  routeName='longhorn/volume/detail' 
                  params={{
                    name: cell.getValue(),
                    namespace: row.original.metadata.namespace
                  }}
                >
                  {cell.getValue()}
                </Link>
             )
          },
          {
            header: 'Image',
            accessorKey: 'status.engineImage',
            // Consider linking to EngineImage detail if added later
          },
          {
            header: 'Size',
            accessorKey: 'spec.volumeSize', // Or status.currentSize?
            // Add formatting (bytes to GiB)
          },
          'age',
        ]}
        filterFunction={filterFunction}
      />
    </SectionBox>
  );
} 