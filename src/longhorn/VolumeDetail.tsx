import {
  ConditionsTable,
  MainInfoSection,
  NameValueTable,
  SectionBox,
} from '@kinvolk/headlamp-plugin/lib/components/common';
import React from 'react';
import { useParams } from 'react-router-dom';
import { volumeClass } from './crd'; // Import the CRD class
// import { ObjectEvents } from '../helpers'; // Assuming ObjectEvents helper exists
// Import actions if/when Longhorn supports similar actions (Suspend, Resume, Sync?)

export function VolumeDetail() {
  // Use `name` and `namespace` from URL params
  const { namespace, name } = useParams<{ name: string; namespace: string }>();
  const [volume, error] = volumeClass().useGet(name, namespace);

  // Basic error handling
  if (error) {
    return <SectionBox title={`Volume ${name}`}>Error loading Volume: {error.message}</SectionBox>;
  }

  // Prepare data for the MainInfoSection
  function prepareExtraInfo(item: any) {
    if (!item) return [];
    const jsonData = item.jsonData; // For easier access

    return [
      {
        name: 'State',
        value: jsonData.status?.state || '-',
      },
      {
        name: 'Size',
        // Add formatting (e.g., bytes to GiB) as needed
        value: jsonData.spec?.size || '-',
      },
      {
        name: 'Node',
        value: jsonData.status?.currentNodeID || '-', // Might link to Node detail later
      },
      {
        name: 'Attached',
        value: jsonData.status?.state === 'attached' ? 'Yes' : 'No',
      },
       {
        name: 'Robustness',
        value: jsonData.status?.robustness || '-',
      },
      {
        name: 'Replicas',
        value: jsonData.spec?.numberOfReplicas || '-',
      },
      {
        name: 'Frontend',
        value: jsonData.spec?.frontend || '-',
      },
      {
        name: 'Stale Replica Timeout',
        value: `${jsonData.spec?.staleReplicaTimeout || '-'} min`,
      },
      // Add more relevant fields from spec and status
    ];
  }

  // Define actions (placeholder for now, adapt if Longhorn supports actions)
  function prepareActions() {
    const actions: React.ReactNode[] = [];
    // Example: Add actions if applicable
    // actions.push(<SomeLonghornAction resource={volume} />);
    return actions;
  }

  return (
    <>
      <MainInfoSection
        resource={volume} // Pass the KubeObject
        extraInfo={prepareExtraInfo(volume)} // Pass the prepared info
        actions={prepareActions()} // Pass prepared actions
      />
      {/* Render ConditionsTable if conditions exist */}
      {volume?.jsonData?.status?.conditions && (
        <SectionBox title="Conditions">
          <ConditionsTable resource={volume.jsonData} showLastUpdate={true} />
        </SectionBox>
      )}
      {/* Render Replicas table */}
      {volume?.jsonData?.status?.replicas && (
         <SectionBox title="Replicas">
             {/* Create a dedicated ReplicasTable component later */}
             <NameValueTable 
                rows={volume.jsonData.status.replicas.map((rep: any) => ({
                    name: rep.name,
                    value: `Mode: ${rep.mode}, Healthy: ${rep.healthyAt ? 'Yes' : 'No'}`
                }))}
             />
         </SectionBox>
      )}

       {/* Render Kubernetes Status */}
       {volume?.jsonData?.status?.kubernetesStatus && (
         <SectionBox title="Kubernetes Status">
           <NameValueTable 
              rows={[
                { name: 'PV Name', value: volume.jsonData.status.kubernetesStatus.pvName || '-' },
                { name: 'PV Status', value: volume.jsonData.status.kubernetesStatus.pvStatus || '-' },
                { name: 'PVC Name', value: volume.jsonData.status.kubernetesStatus.pvcName || '-' },
                { name: 'Namespace', value: volume.jsonData.status.kubernetesStatus.namespace || '-' },
                { name: 'Last Pod Ref At', value: volume.jsonData.status.kubernetesStatus.lastPodRefAt || '-' },
              ]}
           />
         </SectionBox>
       )}

      {/* Add ObjectEvents component if helper is available */}
      {/* {volume && (
        <ObjectEvents 
            namespace={namespace} 
            name={name} 
            resourceClass={volumeClass()} 
        />
      )} */}
      {/* Add more sections as needed, e.g., Snapshots, Backups associated with the volume */}
    </>
  );
} 