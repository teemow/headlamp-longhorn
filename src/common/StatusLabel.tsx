import { StatusLabel as HLStatusLabel } from '@kinvolk/headlamp-plugin/lib/components/common';
import { KubeCRD } from '@kinvolk/headlamp-plugin/lib/lib/k8s/crd';
import { Tooltip } from '@mui/material';
import React from 'react';

interface StatusLabelProps {
  item: KubeCRD;
}

// Basic StatusLabel adapted from Flux. Needs customization for Longhorn states.
export default function StatusLabel(props: StatusLabelProps) {
  const { item } = props;

  // Check if item or jsonData or status is null/undefined before accessing properties
  if (!item?.jsonData?.status) {
    return <span>-</span>; // Or some other placeholder
  }

  // Example: Use Longhorn's specific state if available
  const longhornState = item.jsonData.status.state;
  if (longhornState) {
    let statusType: 'success' | 'warning' | 'error' | '' = '';
    let statusText = longhornState;

    switch (longhornState.toLowerCase()) {
      case 'attached':
      case 'healthy': // Assuming 'healthy' might be a state
        statusType = 'success';
        break;
      case 'detached':
      case 'degraded': // Assuming 'degraded' might be a state
      case 'creating': // Or other intermediate states
      case 'rebuilding':
        statusType = 'warning';
        break;
      case 'faulted':
      case 'error': // Assuming 'error' might be a state
        statusType = 'error';
        break;
      default:
        // Keep text as is, maybe mark as unknown/warning
        statusType = 'warning'; 
        break;
    }
    return <HLStatusLabel status={statusType}>{statusText}</HLStatusLabel>;
  }

  // Fallback to generic Ready condition if state is not present (like in Flux)
  const ready = item.jsonData.status.conditions?.find(c => c.type === 'Ready');
  if (!ready) {
    return <span>-</span>;
  }

  if (item?.jsonData?.spec?.suspend) {
    return <HLStatusLabel status="warning">Suspended</HLStatusLabel>;
  }
  if (ready.status === 'Unknown') {
    return <HLStatusLabel status="warning">Reconciling…</HLStatusLabel>;
  }

  // This part might need adjustment based on Longhorn condition reasons
  if (ready.reason === 'DependencyNotReady') {
    return (
      <HLStatusLabel status={'warning'}>
        <Tooltip title={ready.message}>{'Waiting'}</Tooltip>
      </HLStatusLabel>
    );
  }

  const isReady = ready.status === 'True';
  return (
    <HLStatusLabel status={isReady ? 'success' : 'error'}>
      <Tooltip title={ready.message}>{isReady ? 'Ready' : 'Failed'}</Tooltip>
    </HLStatusLabel>
  );
} 