import * as migration_20260622_084426_initial from './20260622_084426_initial';
import * as migration_20260804_104649_widerruf_agb from './20260804_104649_widerruf_agb';
import * as migration_20260923_141629_redesign_fundament from './20260923_141629_redesign_fundament';
import * as migration_20260923_155007_agentur_seiten from './20260923_155007_agentur_seiten';
import * as migration_20260923_163024_referenzen_ueber_uns from './20260923_163024_referenzen_ueber_uns';
import * as migration_20260923_165405_ratgeber from './20260923_165405_ratgeber';

export const migrations = [
  {
    up: migration_20260622_084426_initial.up,
    down: migration_20260622_084426_initial.down,
    name: '20260622_084426_initial',
  },
  {
    up: migration_20260804_104649_widerruf_agb.up,
    down: migration_20260804_104649_widerruf_agb.down,
    name: '20260804_104649_widerruf_agb',
  },
  {
    up: migration_20260923_141629_redesign_fundament.up,
    down: migration_20260923_141629_redesign_fundament.down,
    name: '20260923_141629_redesign_fundament',
  },
  {
    up: migration_20260923_155007_agentur_seiten.up,
    down: migration_20260923_155007_agentur_seiten.down,
    name: '20260923_155007_agentur_seiten',
  },
  {
    up: migration_20260923_163024_referenzen_ueber_uns.up,
    down: migration_20260923_163024_referenzen_ueber_uns.down,
    name: '20260923_163024_referenzen_ueber_uns',
  },
  {
    up: migration_20260923_165405_ratgeber.up,
    down: migration_20260923_165405_ratgeber.down,
    name: '20260923_165405_ratgeber'
  },
];
