import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1718117197247 implements MigrationInterface {
  name = 'Init1718117197247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "diagnostic-types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(128) NOT NULL, "description" character varying(500), CONSTRAINT "PK_a3df30e15e1625698657206240d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."diagnostic-models_status_enum" AS ENUM('ENABLED', 'DISABLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "diagnostic-models" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(128) NOT NULL, "description" character varying(500), "queueName" character varying(128) NOT NULL, "status" "public"."diagnostic-models_status_enum" NOT NULL DEFAULT 'ENABLED', "typeId" uuid NOT NULL, CONSTRAINT "UQ_6c6f7bf24b7108d40ed4bafa45c" UNIQUE ("queueName"), CONSTRAINT "PK_6879263d491948e8a1e4e1d0f12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fileName" character varying(256) NOT NULL, "fileExt" character varying(256) NOT NULL, "fileNameWithExt" character varying(512) NOT NULL, "pathInStorage" character varying(512) NOT NULL, "mimetype" character varying(256) NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."diagnostic-model-versions_status_enum" AS ENUM('ENABLED', 'DISABLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "diagnostic-model-versions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(128) NOT NULL, "description" character varying(500), "version" integer NOT NULL, "status" "public"."diagnostic-model-versions_status_enum" NOT NULL DEFAULT 'ENABLED', "fileId" uuid NOT NULL, "modelId" uuid NOT NULL, CONSTRAINT "REL_edd4c48b50f81c74bf79b5bf2c" UNIQUE ("fileId"), CONSTRAINT "PK_6137426453e92732bd0dc1ad747" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh-tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "value" character varying(512) NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "UQ_0d4d8f2ef85e0809effe45d9d44" UNIQUE ("value"), CONSTRAINT "PK_8c3ca3e3f1ad4fb45ec6b793aa0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_sexatbirth_enum" AS ENUM('MALE', 'FEMALE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(128) NOT NULL, "password" character varying(256) NOT NULL, "email" character varying(256) NOT NULL, "role" character varying NOT NULL DEFAULT 'PATIENT', "age" integer, "sexAtBirth" "public"."users_sexatbirth_enum", CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "diagnostics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(128) NOT NULL, "description" character varying(500), "userId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "REL_bbda42118b66ed4dd82e17fa64" UNIQUE ("imageId"), CONSTRAINT "PK_2bb20db72fbfd9dc034f6ee7e55" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."diagnostic-results_status_enum" AS ENUM('COMPLETED', 'FAILED', 'PENDING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "diagnostic-results" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "public"."diagnostic-results_status_enum" NOT NULL DEFAULT 'PENDING', "diseaseProbability" numeric(5,2), "resultDescription" character varying(500), "diagnosticId" uuid NOT NULL, "modelVersionId" uuid NOT NULL, CONSTRAINT "PK_1851d9035d7fc5c780d2bf6cb2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostic-models" ADD CONSTRAINT "FK_3a7717d8c3797c77bb90698e6e8" FOREIGN KEY ("typeId") REFERENCES "diagnostic-types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostic-model-versions" ADD CONSTRAINT "FK_edd4c48b50f81c74bf79b5bf2ca" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostic-model-versions" ADD CONSTRAINT "FK_1bd9bb0eb392dc2da6b9636bdaf" FOREIGN KEY ("modelId") REFERENCES "diagnostic-models"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh-tokens" ADD CONSTRAINT "FK_88bd85554c3fa712cd505ec7b1b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostics" ADD CONSTRAINT "FK_eca74c213620cee8792fbf1b69f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostics" ADD CONSTRAINT "FK_bbda42118b66ed4dd82e17fa646" FOREIGN KEY ("imageId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostic-results" ADD CONSTRAINT "FK_278245394fcc36d63c94884c21c" FOREIGN KEY ("diagnosticId") REFERENCES "diagnostics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostic-results" ADD CONSTRAINT "FK_7d7f372a4a3aed91b38025aeb20" FOREIGN KEY ("modelVersionId") REFERENCES "diagnostic-model-versions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    console.log('\n\nFinished\n\n');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "diagnostic-results" DROP CONSTRAINT "FK_7d7f372a4a3aed91b38025aeb20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostic-results" DROP CONSTRAINT "FK_278245394fcc36d63c94884c21c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostics" DROP CONSTRAINT "FK_bbda42118b66ed4dd82e17fa646"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostics" DROP CONSTRAINT "FK_eca74c213620cee8792fbf1b69f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh-tokens" DROP CONSTRAINT "FK_88bd85554c3fa712cd505ec7b1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostic-model-versions" DROP CONSTRAINT "FK_1bd9bb0eb392dc2da6b9636bdaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostic-model-versions" DROP CONSTRAINT "FK_edd4c48b50f81c74bf79b5bf2ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnostic-models" DROP CONSTRAINT "FK_3a7717d8c3797c77bb90698e6e8"`,
    );
    await queryRunner.query(`DROP TABLE "diagnostic-results"`);
    await queryRunner.query(
      `DROP TYPE "public"."diagnostic-results_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "diagnostics"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_sexatbirth_enum"`);
    await queryRunner.query(`DROP TABLE "refresh-tokens"`);
    await queryRunner.query(`DROP TABLE "diagnostic-model-versions"`);
    await queryRunner.query(
      `DROP TYPE "public"."diagnostic-model-versions_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "diagnostic-models"`);
    await queryRunner.query(
      `DROP TYPE "public"."diagnostic-models_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "diagnostic-types"`);
  }
}
