import type { ModelStatic } from 'sequelize';
import type { Hackers } from '../database/models/hacker.model.js';
import type { HackedSites } from '../database/models/hackedSites.model.js';


export type typeOfhackers = ModelStatic<Hackers>;
export type typeOfhackedSite = ModelStatic<HackedSites>;
