import { Link } from '@kinvolk/headlamp-plugin/lib/components/common';
import { KubeObjectClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import React from 'react';
import { PluralName } from './pluralName';
import { formatBytes } from './formatters';

/**
 * Generates a table column definition for linking to a resource's details page.
 * @param resourceClass The KubeObjectClass for the resource.
 * @param detailRouteName The *exact* name of the registered detail route.
 * @returns A TableCol object for the Name column.
 */
export function NameLink(resourceClass: KubeObjectClass, detailRouteName: string) {
  return {
    header: 'Name',
    accessorKey: 'metadata.name',
    Cell: ({ cell, row }: { cell: any; row: { original: any } }) => {
      const resourceName = row.original?.metadata?.name;
      const resourceNamespace = row.original?.metadata?.namespace;
      const cellValue = cell.getValue();

      // If name is missing, just render the value (or placeholder)
      if (!resourceName) {
        console.warn('NameLink: Missing resource name for cell value:', cellValue);
        return <span>{cellValue ?? '-'}</span>;
      }

      // Determine required params based on the route name
      let params: Record<string, string> = { name: resourceName }; // Use Record for flexibility
      let linkIsPossible = true;

      // Define routes that require namespace explicitly
      const namespacedRoutes = [
        'longhorn/volume/detail',
        'longhorn/engine/detail',
        'longhorn/replica/detail',
        // Add other namespaced detail routes here
      ];

      if (namespacedRoutes.includes(detailRouteName)) {
        if (resourceNamespace) {
          params.namespace = resourceNamespace;
        } else {
          // Required namespace is missing!
          console.error(
            `NameLink: Missing namespace for namespaced route ${detailRouteName} on resource ${resourceName}. Cannot generate link.`
          );
          linkIsPossible = false;
        }
      } else if (detailRouteName === 'longhorn/node/detail') {
        // Node route only requires name, which we already have.
        // No namespace needed in params for this specific route.
      } else {
        // Fallback for unknown routes - attempt to add namespace if present
        if (resourceNamespace) {
          params.namespace = resourceNamespace;
        }
      }

      // Render Link only if possible
      if (linkIsPossible) {
        try {
           // Attempt to render the link. This might still throw if the route definition is wrong elsewhere.
           // But the params object itself should be correctly formed now.
          return (
            <Link routeName={detailRouteName} params={params}>
              <span>{cellValue}</span>
            </Link>
          );
        } catch (e) {
          console.error(`NameLink: Error rendering Link for route ${detailRouteName} with params:`, params, e);
          // Fallback to text if Link rendering fails
          return <span>{cellValue}</span>;
        }
      } else {
        // Render plain text if link is not possible (e.g., missing required param)
        return <span>{cellValue}</span>;
      }
    },
  };
}

// Add other helper functions as needed, e.g., PluralName, ObjectEvents, StatusLabel adaptations 