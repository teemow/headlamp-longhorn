import {
  registerRoute,
  registerSidebarEntry,
} from '@kinvolk/headlamp-plugin/lib';

// Import Longhorn list and detail view components
import { Volumes } from './longhorn/VolumeList';
import { VolumeDetail } from './longhorn/VolumeDetail';

// Register a top-level sidebar entry for Longhorn
registerSidebarEntry({
  parent: null, // null makes it a top-level entry
  name: 'longhorn',
  label: 'Longhorn',
  url: '/longhorn', // Default view, e.g., Volumes list
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

// Placeholder for other Longhorn sections (Nodes, Backups, Settings, etc.)
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
