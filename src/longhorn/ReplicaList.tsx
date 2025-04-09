import React from 'react';
import {
  SectionBox,
  SectionFilterHeader,
  Link,
  DateLabel, // For Last Healthy At
} from '@kinvolk/headlamp-plugin/lib/components/common';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import { replicaClass } from './crd';
// import { NameLink } from '../helpers'; // Don't use NameLink for now
import Table from '../common/Table';
import StatusLabel from '../common/StatusLabel'; // For Replica state

export function Replicas() {
  const filterFunction = useFilterFunc();
  const [replicas, error] = replicaClass().useList();

  if (error?.status === 404) {
    return <SectionBox title="Replicas">Longhorn Replicas CRD not found.</SectionBox>;
  }
  if (error) {
    return <SectionBox title="Replicas">Error loading Replicas: {error.message}</SectionBox>;
  }

  return (
    <SectionBox title={<SectionFilterHeader title="Replicas" />}>
      <Table
        data={replicas}
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
                  routeName='longhorn/replica/detail' 
                  params={{ name, namespace }}
                >
                  <span>{cell.getValue()}</span>
                </Link>
              );
            }
          },
          // NameLink(replicaClass(), 'longhorn/replica/detail'), // Use direct Cell instead
          'namespace', 
          {
            header: 'State',
            accessorKey: 'status.currentState',
          },
          {
            header: 'Node',
            accessorKey: 'spec.nodeID',
          },
           {
            header: 'Disk',
            accessorKey: 'spec.diskID',
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
            header: 'Healthy',
            accessorKey: 'status.healthyAt',
            Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
          },
          {
            header: 'Last Healthy At',
            accessorKey: 'status.healthyAt',
            Cell: ({ cell }) => <DateLabel date={cell.getValue()} format="mini" />,
          },
          'age',
        ]}
        filterFunction={filterFunction}
      />
    </SectionBox>
  );
} 