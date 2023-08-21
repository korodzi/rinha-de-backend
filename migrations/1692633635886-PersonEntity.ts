import { MigrationInterface, QueryRunner } from 'typeorm';

export class PersonEntity1692633635886 implements MigrationInterface {
  name = 'PersonEntity1692633635886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "apelido" character varying NOT NULL, "nome" character varying NOT NULL, "nascimento" TIMESTAMP NOT NULL, "stack" character varying array, CONSTRAINT "UQ_742d7e7ba6f56ae158d276c91d1" UNIQUE ("apelido"), CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "person"`);
  }
}
