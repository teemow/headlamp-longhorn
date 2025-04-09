import { makeCustomResourceClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/crd';

const longhornGroup = 'longhorn.io';
// Assuming v1beta2 is the common version, adjust if needed based on your cluster.
const longhornVersion = 'v1beta2';

export function volumeClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: longhornGroup, version: longhornVersion }],
    isNamespaced: true,
    singularName: 'Volume',
    pluralName: 'volumes',
  });
}

export function nodeClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: longhornGroup, version: longhornVersion }],
    isNamespaced: true, // Nodes are typically namespaced to longhorn-system
    singularName: 'Node',
    pluralName: 'nodes',
  });
}

export function engineClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: longhornGroup, version: longhornVersion }],
    isNamespaced: true,
    singularName: 'Engine',
    pluralName: 'engines',
  });
}

export function replicaClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: longhornGroup, version: longhornVersion }],
    isNamespaced: true,
    singularName: 'Replica',
    pluralName: 'replicas',
  });
}

export function backupTargetClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: longhornGroup, version: longhornVersion }],
    isNamespaced: true,
    singularName: 'BackupTarget',
    pluralName: 'backuptargets',
  });
}

export function backupClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: longhornGroup, version: longhornVersion }],
    isNamespaced: true,
    singularName: 'Backup',
    pluralName: 'backups',
  });
}

export function settingClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: longhornGroup, version: longhornVersion }],
    isNamespaced: true,
    singularName: 'Setting',
    pluralName: 'settings',
  });
}

// Add other Longhorn CRD classes as needed...
// e.g., RecurringJob, Snapshot, InstanceManager, ShareManager, etc. 