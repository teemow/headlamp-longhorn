import {
  MainInfoSection,
  NameValueTable,
  SectionBox,
  Link, // Import Link for navigation
} from '@kinvolk/headlamp-plugin/lib/components/common';
import React from 'react';
import { useParams } from 'react-router-dom';
import { engineClass } from './crd';
import StatusLabel from '../common/StatusLabel'; // Assuming StatusLabel can handle engine states
// import { ObjectEvents } from '../helpers';

export function EngineDetail() {
  const { namespace, name } = useParams<{ name: string; namespace: string }>();
  const [engine, error] = engineClass().useGet(name, namespace);

  if (error) {
    return <SectionBox title={`Engine ${name}`}>Error loading Engine: {error.message}</SectionBox>;
  }

  function prepareExtraInfo(item: any) {
    if (!item) return [];
    const jsonData = item.jsonData;
    return [
      {
        name: 'State',
        // Use StatusLabel if it covers engine states, otherwise just display text
        value: jsonData.status?.currentState || '-', 
        // value: <StatusLabel item={item} />, 
      },
      {
        name: 'Node',
        value: jsonData.spec?.nodeID || '-', 
        // Might link to Node detail view later
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
        name: 'Engine Image',
        value: jsonData.status?.engineImage || '-',
        // Consider linking to EngineImage detail if added later
      },
       {
        name: 'Size',
        value: jsonData.spec?.volumeSize || jsonData.status?.currentSize || '-', 
        // Add formatting
      },
      {
         name: 'Actual Size',
         value: jsonData.status?.actualSize || '-', // Add formatting
       },
      {
        name: 'IP',
        value: jsonData.status?.ip || '-',
      },
      {
        name: 'Port',
        value: jsonData.status?.port || '-',
      },
      {
        name: 'Replica Mode Map',
        // Display this more nicely, maybe a small table or formatted list
        value: <pre>{JSON.stringify(jsonData.status?.replicaModeMap || {}, null, 2)}</pre>,
      },
      // Add more spec/status fields as needed
    ];
  }

  return (
    <>
      <MainInfoSection
        resource={engine}
        extraInfo={prepareExtraInfo(engine)}
        actions={[]} // Engines likely don't have direct actions
      />

      {/* Display Replica Mode Map in a structured way? */}
      {/* Consider adding a section for related Replicas */} 

      {/* Add ObjectEvents component if helper is available */}
      {/* {engine && (
        <ObjectEvents 
            namespace={namespace} 
            name={name} 
            resourceClass={engineClass()} 
        />
      )} */}
    </>
  );
} 