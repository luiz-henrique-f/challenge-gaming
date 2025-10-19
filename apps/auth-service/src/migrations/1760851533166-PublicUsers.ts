import { MigrationInterface, QueryRunner } from "typeorm";

export class PublicUsers1760851533166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
         await queryRunner.query(
            `CREATE TABLE "user" (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                name varchar(256) NOT NULL,
                username varchar(256) NOT NULL,
                password varchar(256) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT user_pk_id PRIMARY KEY (id),
                CONSTRAINT user_un_username UNIQUE (username)
                );`,
    );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS user;`);
    }

}
