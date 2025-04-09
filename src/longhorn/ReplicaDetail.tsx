import {
  MainInfoSection,
  NameValueTable,
  SectionBox,
  Link,
  DateLabel,
} from '@kinvolk/headlamp-plugin/lib/components/common';
import React from 'react';
import { useParams } from 'react-router-dom';
import { replicaClass } from './crd';
// import { ObjectEvents } from '../helpers';

export function ReplicaDetail() {
  const { namespace, name } = useParams<{ name: string; namespace: string }>();
  const [replica, error] = replicaClass().useGet(name, namespace);

  if (error) {
    return <SectionBox title={`Replica ${name}`}>Error loading Replica: {error.message}</SectionBox>;
  }

  function prepareExtraInfo(item: any) {
    if (!item) return [];
    const jsonData = item.jsonData;
    return [
      {
        name: 'State',
        value: jsonData.status?.currentState || '-',
        // Consider using StatusLabel
      },
      {
        name: 'Node',
        value: jsonData.spec?.nodeID || '-',
      },
      {
        name: 'Disk',
        value: jsonData.spec?.diskID || '-',
      },
      {
        name: 'Disk Path',
        value: jsonData.spec?.dataPath || '-',
      },
      {
        name: 'Volume',
        value: jsonData.spec?.volumeName ? (
          <Link 
            routeName='longhorn/volume/detail' 
            params={{
              name: jsonData.spec.volumeName,
              namespace: jsonData.metadata.namespace
            }}
          >
            {jsonData.spec.volumeName}
          </Link>
        ) : '-',
      },
      {
        name: 'Healthy',
        value: jsonData.status?.healthyAt ? (
            <DateLabel date={jsonData.status.healthyAt} /> 
        ) : 'No',
      },
       {
        name: 'Failed At',
        value: jsonData.spec?.failedAt ? (
            <DateLabel date={jsonData.spec.failedAt} /> 
        ) : '-',
        hide: !jsonData.spec?.failedAt, // Only show if failed
      },
       {
        name: 'Active',
        value: jsonData.spec?.active ? 'Yes' : 'No',
      },
       {
        name: 'Engine Image',
        value: jsonData.spec?.engineImage || '-',
      },
      {
        name: 'Size',
        value: jsonData.spec?.volumeSize || jsonData.status?.size || '-', 
        // Add formatting
      },
      // Add more spec/status fields like backingImage, lastFailedAt etc.
    ];
  }

  return (
    <>
      <MainInfoSection
        resource={replica}
        extraInfo={prepareExtraInfo(replica)}
        actions={[]} // Replicas likely don't have direct actions
      />

      {/* Add ObjectEvents component if helper is available */}
      {/* {replica && (
        <ObjectEvents 
            namespace={namespace} 
            name={name} 
            resourceClass={replicaClass()} 
        />
      )} */}
      {/* Potentially add sections for related resources if meaningful */}
    </>
  );
} 