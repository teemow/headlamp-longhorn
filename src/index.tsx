import {
  registerRoute,
  registerSidebarEntry,
} from '@kinvolk/headlamp-plugin/lib';

// Import Longhorn list and detail view components
import { Volumes } from './longhorn/VolumeList';
import { VolumeDetail } from './longhorn/VolumeDetail';
import { Nodes } from './longhorn/NodeList'; // Import Nodes list component
import { NodeDetail } from './longhorn/NodeDetail'; // Import Node detail component
import { Engines } from './longhorn/EngineList'; // Import Engines list component
import { EngineDetail } from './longhorn/EngineDetail'; // Import Engine detail component
import { Replicas } from './longhorn/ReplicaList'; // Import Replicas list component
import { ReplicaDetail } from './longhorn/ReplicaDetail'; // Import Replica detail component

// Register a top-level sidebar entry for Longhorn
registerSidebarEntry({
  parent: null, // null makes it a top-level entry
  name: 'longhorn',
  label: 'Longhorn',
  url: '/longhorn/volumes', // Default to Volumes view
  icon: 'mdi:cow', // Example icon, choose a suitable one
});

// Register a sidebar entry specifically for Volumes under Longhorn
registerSidebarEntry({
  parent: 'longhorn',
  name: 'volumes',
  label: 'Volumes',
  url: '/longhorn/volumes',
  // icon: 'mdi:database', // Optional icon for sub-entry
});

// Register sidebar entry for Nodes
registerSidebarEntry({
  parent: 'longhorn',
  name: 'nodes',
  label: 'Nodes',
  url: '/longhorn/nodes',
});

// Register sidebar entry for Engines
registerSidebarEntry({
  parent: 'longhorn',
  name: 'engines',
  label: 'Engines',
  url: '/longhorn/engines',
});

// Register sidebar entry for Replicas
registerSidebarEntry({
  parent: 'longhorn',
  name: 'replicas',
  label: 'Replicas',
  url: '/longhorn/replicas',
});

// Route for the main Longhorn Volumes list view
registerRoute({
  path: '/longhorn/volumes',
  name: 'longhorn/volumes',
  parent: 'longhorn', // Associate with the top-level Longhorn entry
  sidebar: 'volumes', // Associate with the Volumes sidebar entry
  component: Volumes, // Use the Volumes component
  exact: true,
});

// Route for the Longhorn Volume detail view
registerRoute({
  // :namespace and :name are parameters captured from the URL
  path: '/longhorn/volumes/:namespace/:name',
  name: 'longhorn/volume/detail', // Unique name for the detail route
  parent: 'longhorn', // Associate with the top-level Longhorn entry
  sidebar: 'volumes', // Keep the Volumes sidebar item selected
  component: VolumeDetail, // Use the VolumeDetail component
  exact: true,
});

// Route for Nodes list view
registerRoute({
  path: '/longhorn/nodes',
  name: 'longhorn/nodes',
  parent: 'longhorn',
  sidebar: 'nodes',
  component: Nodes, // Use the Nodes component
  exact: true,
});

// Route for Node detail view
registerRoute({
  // Longhorn Node CRDs are namespaced (longhorn-system) but named after K8s nodes.
  // We don't need namespace in the URL path here, as we fetch using the name param
  // and a fixed namespace (e.g., 'longhorn-system') in the component.
  path: '/longhorn/nodes/:name', 
  name: 'longhorn/node/detail',
  parent: 'longhorn',
  sidebar: 'nodes',
  component: NodeDetail, // Use the NodeDetail component
  exact: true,
});

// Route for Engines list view
registerRoute({
  path: '/longhorn/engines',
  name: 'longhorn/engines', // Unique route name
  parent: 'longhorn',
  sidebar: 'engines',
  component: Engines, // Use the Engines component
  exact: true,
});

// Route for Engine detail view
registerRoute({
  path: '/longhorn/engines/:namespace/:name',
  name: 'longhorn/engine/detail',
  parent: 'longhorn',
  sidebar: 'engines',
  component: EngineDetail, // Use the EngineDetail component
  exact: true,
});

// Route for Replicas list view
registerRoute({
  path: '/longhorn/replicas',
  name: 'longhorn/replicas', // Unique route name
  parent: 'longhorn',
  sidebar: 'replicas',
  component: Replicas, // Use the Replicas component
  exact: true,
});

// Route for Replica detail view
registerRoute({
  path: '/longhorn/replicas/:namespace/:name',
  name: 'longhorn/replica/detail',
  parent: 'longhorn',
  sidebar: 'replicas',
  component: ReplicaDetail, // Use the ReplicaDetail component
  exact: true,
});

// Placeholder for other Longhorn sections (Backups, Settings, etc.)
// Register sidebar entries and routes for them similarly...

/* Example: Nodes section
registerSidebarEntry({
  parent: 'longhorn',
  name: 'nodes',
  label: 'Nodes',
  url: '/longhorn/nodes',
});

registerRoute({
  path: '/longhorn/nodes',
  name: 'longhorn/nodes',
  parent: 'longhorn',
  sidebar: 'nodes',
  component: () => <div>Longhorn Nodes List Placeholder</div>, // Replace with actual NodesList component
  exact: true,
});

registerRoute({
  path: '/longhorn/nodes/:namespace/:name', // Assuming nodes are namespaced in Longhorn
  name: 'longhorn/node/detail',
  parent: 'longhorn',
  sidebar: 'nodes',
  component: () => <div>Longhorn Node Detail Placeholder</div>, // Replace with actual NodeDetail component
  exact: true,
});
*/

// Remove or keep the initial default example action
// registerAppBarAction(<span>Hello</span>);
