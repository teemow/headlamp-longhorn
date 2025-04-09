import React from 'react';
import { SectionBox, SectionFilterHeader } from '@kinvolk/headlamp-plugin/lib/components/common';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import { volumeClass } from './crd';
import { NameLink } from '../helpers'; // Assuming helpers exist from Flux example
import Table from '../common/Table'; // Assuming common Table exists

export function Volumes() {
  const filterFunction = useFilterFunc();
  const [volumes, error] = volumeClass().useList();

  // Basic error handling (similar to Flux's NotSupported)
  if (error?.status === 404) {
    // You might want a specific LonghornNotInstalled component later
    return <SectionBox title="Volumes">Longhorn Volumes CRD not found.</SectionBox>;
  }
  if (error) {
     return <SectionBox title="Volumes">Error loading Volumes: {error.message}</SectionBox>;
  }

  return (
    <SectionBox title={<SectionFilterHeader title="Volumes" />}>
      <Table
        data={volumes}
        columns={[
          NameLink(volumeClass(), 'longhorn/volumes'), // Use a unique route name prefix
          'namespace', // Assuming volumes are namespaced
          {
            header: 'State',
            accessorKey: 'status.state',
          },
          {
            header: 'Size',
            accessorKey: 'spec.size', // Adjust accessor based on actual CRD structure
             // Add formatting if needed (e.g., bytes to GiB)
          },
           {
            header: 'Node',
            accessorKey: 'status.currentNodeID', // Adjust accessor
          },
           {
            header: 'Attached',
            //accessorKey: 'status.isAttached', // Check actual field
             accessorFn: item => item.status?.state === 'attached' ? 'Yes' : 'No', // Example derived state
          },
          // Add more relevant columns: Robustness, Replicas, etc.
          'age',
        ]}
        filterFunction={filterFunction}
        // Add default sorting if desired
      />
    </SectionBox>
  );
} 