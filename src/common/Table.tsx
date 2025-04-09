import {
  DateLabel,
  Link,
  ShowHideLabel,
  Table as HTable,
  TableColumn,
  TableProps as HTableProps,
} from '@kinvolk/headlamp-plugin/lib/components/common';
import { KubeObject, KubeObjectClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { KubeCRD } from '@kinvolk/headlamp-plugin/lib/lib/k8s/crd';
import React from 'react';
// Adjust import if helpers structure differs
import { NameLink } from '../helpers';
import StatusLabel from './StatusLabel'; // Assuming StatusLabel exists or will be created

type CommonColumnType =
  | 'namespace'
  | 'name'
  | 'lastUpdated'
  | 'age'
  | 'status'
  | 'message' // Added message for consistency
  | string; // Allow other string keys for custom columns

interface TableCol {
  header: string;
  accessorKey?: string;
  accessorFn?: (item: any) => React.ReactNode;
  Cell?: (props: { row: { original: any }; cell: any }) => React.ReactNode; // Added cell prop for flexibility
  id?: string; // Added id for sorting/filtering
  gridTemplate?: string; // Added for layout control
  enableColumnFilter?: boolean; // Added for filtering control
  muiTableBodyCellProps?: object; // Added for MUI cell props
  resourceClass?: KubeObjectClass; // Added resourceClass to TableCol definition
}

interface NameColumn extends Partial<TableCol> {
  extends: 'name';
  routeName?: string;
  routeNamePrefix?: string; // Add prefix for unique route generation
}

export interface TableProps extends Omit<HTableProps<any>, 'columns'> {
  columns: (TableCol | CommonColumnType | NameColumn | TableColumn<any, any>)[];
}

function prepareLastUpdated(item: KubeCRD) {
  // Adapt based on where Longhorn stores the last update time
  const condition = item?.jsonData?.status?.conditions?.find(c => c.type === 'Ready');
  return condition?.lastTransitionTime || item?.jsonData?.metadata?.creationTimestamp;
}

function prepareNameColumn(colProps: Partial<NameColumn> = {}): TableCol {
  const { routeName, routeNamePrefix, resourceClass, ...genericProps } = colProps as NameColumn & {
    resourceClass?: KubeObjectClass;
  };
  delete genericProps.extends;

  // Use the NameLink helper if available and routeNamePrefix is provided
  if (routeNamePrefix && resourceClass) {
    return NameLink(resourceClass, routeNamePrefix);
  }

  // Fallback generic name column (potentially without linking)
  return {
    header: 'Name',
    accessorKey: 'metadata.name',
    ...(routeName
      ? {
          Cell: ({ row: { original: item } }) => (
            <Link
              routeName={routeName} // Use provided routeName if no prefix logic needed
              params={{
                name: item.metadata.name,
                namespace: item.metadata.namespace,
                // pluralName might not be needed if route is simple
              }}
            >
              {item.metadata.name}
            </Link>
          ),
        }
      : {}),
    ...genericProps,
  };
}

export function Table(props: TableProps) {
  const { columns, data, ...otherProps } = props;

  const processedColumns = React.useMemo(() => {
    return columns.map(column => {
      if (typeof column === 'string') {
        switch (column) {
          case 'namespace':
            return {
              header: 'Namespace',
              accessorKey: 'metadata.namespace',
              Cell: ({ row: { original: item } }) => (
                <Link routeName="namespace" params={{ name: item.metadata.namespace }}>
                  {item.metadata.namespace}
                </Link>
              ),
            };
          case 'name':
            // Default name column without specific linking
            return prepareNameColumn();
          case 'lastUpdated':
            return {
              header: 'Last Updated',
              accessorFn: item => prepareLastUpdated(item),
              Cell: ({ cell }: any) => <DateLabel format="mini" date={cell.getValue()} />,
            };
          case 'age':
            return {
              id: 'age',
              header: 'Age',
              gridTemplate: 'min-content',
              accessorFn: (item: KubeObject) =>
                -new Date(item.metadata.creationTimestamp).getTime(),
              enableColumnFilter: false,
              muiTableBodyCellProps: {
                align: 'right',
              },
              Cell: ({ row }) =>
                row.original && (
                  <DateLabel date={row.original.metadata.creationTimestamp} format="mini" />
                ),
            };
          case 'status':
            return {
              header: 'Status',
              // Use accessorFn for custom components
              accessorFn: (item: KubeCRD) => {
                return <StatusLabel item={item} />; // Assuming StatusLabel handles Longhorn status
              },
              // Alternatively, use accessorKey if status is a simple string
              // accessorKey: 'status.phase', // Example for simple status field
            };
          case 'message': // Added for consistency with Flux example
            return {
              header: 'Message',
              accessorFn: item => {
                // Adapt this logic to find the relevant message in Longhorn status
                const message = item.jsonData.status?.conditions?.find(
                  c => c.type === 'Ready'
                )?.message;
                return (
                  <ShowHideLabel labelId={`${item?.metadata?.uid}-message`}>
                    {message ?? ''}
                  </ShowHideLabel>
                );
              },
            };
          // Add other common Longhorn columns here if needed
          default:
            // Handle custom string columns if necessary
            // console.warn(`Unhandled common column string: ${column}`);
            return {
              header: column, // Use the string as header by default
              accessorKey: column, // Assume it's a direct key path
            };
        }
      } // end if typeof column === 'string'

      // Handle NameColumn configuration with routeNamePrefix
      if ((column as NameColumn).extends === 'name' && (column as NameColumn).routeNamePrefix) {
        // Pass the resourceClass if it's available in the column definition
        const nameColProps = column as NameColumn & { resourceClass?: KubeObjectClass };
        return prepareNameColumn(nameColProps);
      }

      // Handle generic NameColumn without prefix (or fallback)
      if ((column as NameColumn).extends === 'name') {
        return prepareNameColumn(column as NameColumn);
      }

      // Pass through other column configurations directly
      return column as TableCol;
    });
  }, [columns]);

  return (
    <HTable
      data={data}
      loading={data === null}
      muiTableBodyRowProps={({ row }) => ({
        key: row.original?.metadata?.uid ?? JSON.stringify(row.original),
      })}
      {...otherProps}
      columns={processedColumns as TableCol[]}
    />
  );
}

export default Table; 