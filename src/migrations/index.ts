import * as migration_20260622_084426_initial from './20260622_084426_initial';

export const migrations = [
  {
    up: migration_20260622_084426_initial.up,
    down: migration_20260622_084426_initial.down,
    name: '20260622_084426_initial'
  },
];
