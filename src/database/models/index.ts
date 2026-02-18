import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import { initHackerModel } from './hacker.model.js';
import { initHackedSitesModel } from './hackedSites.model.js';

dotenv.config();

const sequelize = new Sequelize(process.env.CONNECTION_STRING as string);

const factories = {
  Hackers: initHackerModel,
  HackedSites: initHackedSitesModel,
};


export interface MyDb {
  Hackers: ReturnType<typeof initHackerModel>;
  HackedSites: ReturnType<typeof initHackedSitesModel>;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db = {} as MyDb;


Object.entries(factories).forEach(([name, factory]) => {
  (db as any)[name] = factory(sequelize);
});


Object.values(db).forEach((model: any) => {
  if (model && typeof model.associate === 'function') {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;