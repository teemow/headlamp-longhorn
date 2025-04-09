// Method to derive Plural name for a k8s kind.
// Copied from https://github.com/kubernetes/gengo/blob/master/namer/plural_namer.go (converted from go to typescript).
//
// This method is required because the kustomization inventory provides only the singular name of the entry,
// whereas the k8s REST API expects a plural name.

import { indexOf } from 'lodash'; // Assuming lodash is available via Headlamp

const consonants = 'bcdfghjklmnpqrstvwxyz';

// Name returns the plural form of the type's name.
export function PluralName(kind: string): string {
  // Handle known Longhorn kinds explicitly for simplicity, though the generic logic might work.
  // Add more specific mappings if the generic logic fails for certain Longhorn kinds.
  const knownPlurals: { [key: string]: string } = {
    Volume: 'volumes',
    Node: 'nodes',
    Engine: 'engines',
    Replica: 'replicas',
    BackupTarget: 'backuptargets',
    Backup: 'backups',
    Setting: 'settings',
    RecurringJob: 'recurringjobs',
    Snapshot: 'snapshots',
    InstanceManager: 'instancemanagers',
    ShareManager: 'sharemanagers',
    EngineImage: 'engineimages',
    BackingImage: 'backingimages',
    BackingImageManager: 'backingimagemanagers',
    BackingImageDataSource: 'backingimagedatasources',
    VolumeAttachment: 'volumeattachments',
    Orphan: 'orphans',
    SystemBackup: 'systembackups',
    SystemRestore: 'systemrestores',
    VolumeRestore: 'volumerestores',
    VolumeRebuilding: 'volumerebuildings',
    // Add other specific mappings as needed
  };

  if (knownPlurals[kind]) {
    return knownPlurals[kind];
  }

  // Fallback to generic pluralization logic (adapted from Flux plugin)
  const singular = kind.toLowerCase();
  const lastChar = singular.substring(singular.length - 1, singular.length);
  const beforeLastChar = singular.substring(singular.length - 2, singular.length - 1);

  switch (lastChar) {
    case 's':
    case 'x':
    case 'z': {
      return singular + 'es';
    }
    case 'y':
      if (isConsonant(beforeLastChar)) {
        return iesPlural(singular);
      } else {
        return sPlural(singular);
      }
    case 'h':
      if (beforeLastChar === 'c' || beforeLastChar === 's') {
        return esPlural(singular);
      } else {
        return sPlural(singular);
      }
    case 'e':
      if (beforeLastChar === 'f') {
        return vesPlural(singular.substring(0, singular.length - 1));
      } else {
        return sPlural(singular);
      }
    case 'f':
      return vesPlural(singular);
    default:
      return sPlural(singular);
  }
}

function esPlural(singular: string): string {
  return singular + 'es';
}
function iesPlural(singular: string): string {
  return singular.substring(0, singular.length - 1) + 'ies';
}

function sPlural(singular: string) {
  return singular + 's';
}

function vesPlural(singular: string): string {
  return singular.substring(0, singular.length - 1) + 'ves';
}

function isConsonant(rune: string): boolean {
  return consonants.indexOf(rune) >= 0; // Changed from indexOf to standard indexOf
} 