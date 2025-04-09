import React from 'react';
import { SectionBox, SectionFilterHeader } from '@kinvolk/headlamp-plugin/lib/components/common';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import { nodeClass } from './crd';
import { NameLink } from '../helpers';
import Table from '../common/Table';
import StatusLabel from '../common/StatusLabel'; // Import StatusLabel for Node state

export function Nodes() {
  const filterFunction = useFilterFunc();
  const [nodes, error] = nodeClass().useList();

  if (error?.status === 404) {
    return <SectionBox title="Nodes">Longhorn Nodes CRD not found.</SectionBox>;
  }
  if (error) {
    return <SectionBox title="Nodes">Error loading Nodes: {error.message}</SectionBox>;
  }

  return (
    <SectionBox title={<SectionFilterHeader title="Nodes" />}>
      <Table
        data={nodes}
        columns={[
          // Assuming Longhorn nodes are named after K8s nodes and not namespaced for detail view
          // We'll link to a custom Longhorn node detail view
          NameLink(nodeClass(), 'longhorn/node/detail'),
          {
            header: 'State',
            accessorFn: (item: any) => <StatusLabel item={item} />, // Use StatusLabel for node state
          },
          {
            header: 'Allow Scheduling',
            accessorKey: 'spec.allowScheduling',
            Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
          },
          {
            header: 'Schedulable',
            accessorFn: (item: any) => {
              const schedulableCond = item.jsonData?.status?.conditions?.find(
                (c: any) => c.type === 'Schedulable'
              );
              return schedulableCond?.status === 'True' ? 'Yes' : 'No';
            },
          },
          {
            header: 'Ready',
            accessorFn: (item: any) => {
              const readyCond = item.jsonData?.status?.conditions?.find(
                (c: any) => c.type === 'Ready'
              );
              return readyCond?.status === 'True' ? 'Yes' : 'No';
            },
          },
          // Add Disk Status summary later if needed (might require complex accessor)
          {
            header: 'Tags',
            accessorKey: 'spec.tags',
            Cell: ({ cell }) => cell.getValue()?.join(', ') || '-',
          },
          'age',
        ]}
        filterFunction={filterFunction}
      />
    </SectionBox>
  );
} 