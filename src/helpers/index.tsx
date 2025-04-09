import { Link } from '@kinvolk/headlamp-plugin/lib/components/common';
import { KubeObjectClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import React from 'react';
import { PluralName } from './pluralName';

/**
 * Generates a table column definition for linking to a resource's details page.
 * @param resourceClass The KubeObjectClass for the resource.
 * @param routeNamePrefix A prefix for the route name (e.g., 'longhorn/volumes') to ensure uniqueness.
 * @returns A TableCol object for the Name column.
 */
export function NameLink(resourceClass: KubeObjectClass, routeNamePrefix: string) {
  const pluralName = PluralName(resourceClass.kind);

  return {
    header: 'Name',
    accessorKey: 'metadata.name',
    Cell: ({ cell, row }: { cell: any; row: { original: any } }) => (
      <Link
        // Construct the route name using the prefix and plural name
        routeName={`${routeNamePrefix}`}
        params={{
          name: row.original.metadata.name,
          namespace: row.original.metadata.namespace,
          // Pass pluralName if needed by the route, adjust as necessary
          // pluralName: pluralName,
        }}
      >
        <span>{cell.getValue()}</span>
      </Link>
    ),
  };
}

// Add other helper functions as needed, e.g., PluralName, ObjectEvents, StatusLabel adaptations 