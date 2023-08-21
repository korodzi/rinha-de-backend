const { DataSource } = require('typeorm');

const connectionSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  autoLoadEntities: true,
  entities: ['dist/modules/**/entities/**.js'],
  migrations: ['dist/migrations/*{.js,.ts}'],
  cli: {
    migrationsDr: ['migrations'],
  },
});

module.exports = {
  connectionSource,
};
