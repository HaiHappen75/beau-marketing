import * as migration_20260622_084426_initial from './20260622_084426_initial';
import * as migration_20260804_104649_widerruf_agb from './20260804_104649_widerruf_agb';

export const migrations = [
  {
    up: migration_20260622_084426_initial.up,
    down: migration_20260622_084426_initial.down,
    name: '20260622_084426_initial',
  },
  {
    up: migration_20260804_104649_widerruf_agb.up,
    down: migration_20260804_104649_widerruf_agb.down,
    name: '20260804_104649_widerruf_agb'
  },
];
