import {
  ConditionsTable,
  MainInfoSection,
  NameValueTable,
  SectionBox,
  Table, // Use our common Table
} from '@kinvolk/headlamp-plugin/lib/components/common';
import React from 'react';
import { useParams } from 'react-router-dom';
import { nodeClass } from './crd';
import StatusLabel from '../common/StatusLabel';
// import { ObjectEvents } from '../helpers';

export function NodeDetail() {
  // Longhorn Nodes are namespaced (usually longhorn-system), but their names match K8s nodes.
  // The :name param will be the Kubernetes node name.
  // We need the namespace (typically 'longhorn-system') to fetch the Longhorn Node CRD.
  // Let's assume it's passed or configured, defaulting to 'longhorn-system' for now.
  const { name } = useParams<{ name: string }>();
  const namespace = 'longhorn-system'; // Default or get from config/context later

  const [node, error] = nodeClass().useGet(name, namespace);

  if (error?.status === 404) {
     return (
      <SectionBox title={`Node ${name}`}>Longhorn Node CRD not found in namespace '{namespace}'. Is Longhorn installed and the namespace correct?</SectionBox>
    );
  }
  if (error) {
    return <SectionBox title={`Node ${name}`}>Error loading Node: {error.message}</SectionBox>;
  }

  function prepareExtraInfo(item: any) {
    if (!item) return [];
    const jsonData = item.jsonData;
    return [
      {
        name: 'State',
        value: <StatusLabel item={item} />,
      },
      {
        name: 'Allow Scheduling',
        value: jsonData.spec?.allowScheduling ? 'Yes' : 'No',
      },
      {
        name: 'Schedulable',
        value: jsonData.status?.conditions?.find((c: any) => c.type === 'Schedulable')?.status === 'True' ? 'Yes' : 'No',
      },
       {
        name: 'Ready',
        value: jsonData.status?.conditions?.find((c: any) => c.type === 'Ready')?.status === 'True' ? 'Yes' : 'No',
      },
      {
        name: 'Tags',
        value: jsonData.spec?.tags?.join(', ') || '-',
      },
      // Add more relevant fields like IP, Hostname if available
    ];
  }

  // Format disk status for the table
  const diskStatusRows = React.useMemo(() => {
     if (!node?.jsonData?.status?.diskStatus) return [];
     return Object.entries(node.jsonData.status.diskStatus).map(([name, disk]: [string, any]) => ({
        name: name,
        storageAvailable: disk.storageAvailable || '-', // Add formatting later
        storageScheduled: disk.storageScheduled || '-', 
        storageMaximum: disk.storageMaximum || '-',
        conditions: disk.conditions?.map((c: any) => `${c.type}=${c.status}`).join(', ') || '-',
        // Add filesystem, path, etc.
     }));
  }, [node]);

  return (
    <>
      <MainInfoSection
        resource={node}
        extraInfo={prepareExtraInfo(node)}
        // Add actions like Cordon/Uncordon if applicable/implementable
        actions={[]}
      />

      {/* Disk Status Table */}
      {diskStatusRows.length > 0 && (
        <SectionBox title="Disks">
           <Table
              data={diskStatusRows}
              columns={[
                 { header: 'Name', accessorKey: 'name' },
                 { header: 'Storage Available', accessorKey: 'storageAvailable' },
                 { header: 'Storage Scheduled', accessorKey: 'storageScheduled' },
                 { header: 'Storage Maximum', accessorKey: 'storageMaximum' },
                 { header: 'Conditions', accessorKey: 'conditions' },
              ]}
           />
        </SectionBox>
      )}

      {/* Conditions Table */}
      {node?.jsonData?.status?.conditions && (
        <SectionBox title="Conditions">
          <ConditionsTable resource={node.jsonData} showLastUpdate={true} />
        </SectionBox>
      )}

      {/* Add ObjectEvents component if helper is available */}
      {/* {node && (
        <ObjectEvents 
            namespace={namespace} 
            name={name} 
            resourceClass={nodeClass()} 
        />
      )} */}
      {/* Add more sections like Instance Managers running on the node */}
    </>
  );
} 