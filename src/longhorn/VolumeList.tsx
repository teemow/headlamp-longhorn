import React, { useEffect } from 'react';
import {
  SectionBox,
  SectionFilterHeader,
  Link,
} from '@kinvolk/headlamp-plugin/lib/components/common';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import { volumeClass } from './crd';
import { NameLink, formatBytes } from '../helpers'; // Import NameLink and formatBytes
import Table from '../common/Table';
import StatusLabel from '../common/StatusLabel'; // Import StatusLabel

export function Volumes() {
  const filterFunction = useFilterFunc();
  const [volumes, error] = volumeClass().useList();

  // Log the first volume's *entire KubeObject* structure once loaded
  // useEffect(() => { // REMOVE useEffect logging
  //   if (volumes && volumes.length > 0) {
  //     console.log('### Longhorn Volume Sample Object (volumes[0]):', volumes[0]); 
  //   }
  //    if (error) {
  //       console.error('Longhorn Volume List Error:', error);
  //    }
  // }, [volumes, error]);

  // Basic error handling (similar to Flux's NotSupported)
  if (error?.status === 404) {
    // You might want a specific LonghornNotInstalled component later
    return <SectionBox title="Volumes">Longhorn Volumes CRD not found.</SectionBox>;
  }
  if (error) {
    return <SectionBox title="Volumes">Error loading Volumes: {error.message}</SectionBox>;
  }
  if (!volumes) {
    return <SectionBox title="Volumes">Loading Volumes...</SectionBox>;
  }

  // Log the data directly before passing to Table if it exists
  if (volumes && volumes.length > 0) {
      console.log('### Longhorn Volumes Data (volumes):', volumes);
  } else {
      console.log('### Longhorn Volumes Data: (empty or null)', volumes);
  }

  return (
    <SectionBox title={<SectionFilterHeader title="Volumes" />}>
      <Table
        data={volumes}
        columns={[
          NameLink(volumeClass(), 'longhorn/volume/detail'),
          'namespace', // Assuming volumes are namespaced
          {
            header: 'State',
            id: 'state', // Add id for potential sorting/filtering
            // Log the whole item in the cell to inspect
            Cell: ({ row }) => {
              console.log(`### Volume Row Data for ${row.original?.metadata?.name}:`, row.original);
              // Attempt to display state, default to '-'
              return <span>{row.original?.jsonData?.status?.state ?? '-'}</span>;
            },
          },
          {
            header: 'Robustness',
            // Log the whole item in the cell to inspect
            Cell: ({ row }) => {
              // Attempt to display robustness, default to '-'
              return <span>{row.original?.jsonData?.status?.robustness ?? '-'}</span>;
            },
          },
          {
            header: 'Size',
            // Log the whole item in the cell to inspect
            Cell: ({ row }) => {
              const statusSize = row.original?.jsonData?.status?.size;
              const specSize = row.original?.jsonData?.spec?.size;
              return <span>{formatBytes(statusSize ?? specSize)}</span>;
            },
          },
          {
            header: 'Node',
            // Log the whole item in the cell to inspect
            Cell: ({ row }) => {
              const nodeID = row.original?.jsonData?.status?.currentNodeID;
              return <span>{nodeID ?? '-'}</span>;
            },
          },
          {
            header: 'Replicas',
            accessorKey: 'spec.numberOfReplicas',
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          'age',
        ]}
        filterFunction={filterFunction}
        // Example: Default sort by age descending
        initialState={{
          sorting: [
            { id: 'age', desc: false },
          ],
        }}
        muiTableBodyRowProps={({ row }) => ({
          key: row.original?.metadata?.uid ?? JSON.stringify(row.original),
        })}
      />
    </SectionBox>
  );
} 