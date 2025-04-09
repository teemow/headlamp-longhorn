import React from 'react';
import {
  SectionBox,
  SectionFilterHeader,
  Link,
} from '@kinvolk/headlamp-plugin/lib/components/common';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import { engineClass } from './crd';
// import { NameLink } from '../helpers'; // Don't use NameLink for now
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
          // Define Name column directly with Link
          {
            header: 'Name',
            accessorKey: 'metadata.name',
            Cell: ({ cell, row }: { cell: any; row: { original: any } }) => {
              const name = row.original?.metadata?.name;
              const namespace = row.original?.metadata?.namespace;
              if (!name || !namespace) {
                return <span>{cell.getValue() ?? '-'}</span>;
              }
              return (
                <Link 
                  routeName='longhorn/engine/detail' 
                  params={{ name, namespace }}
                >
                  <span>{cell.getValue()}</span>
                </Link>
              );
            }
          },
          // NameLink(engineClass(), 'longhorn/engine/detail'), // Use direct Cell instead
          'namespace', 
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
             Cell: ({ cell, row }) => {
                const volumeName = cell.getValue();
                const namespace = row.original.metadata.namespace;
                if (!volumeName || !namespace) return <span>{volumeName ?? '-'}</span>;
                return (
                  <Link 
                    routeName='longhorn/volume/detail' 
                    params={{ name: volumeName, namespace }}
                  >
                    {volumeName}
                  </Link>
                )
             }
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