import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUsers1760887984044 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" 
            ADD COLUMN "hashedRefreshToken" varchar NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" 
            DROP COLUMN "hashedRefreshToken"
        `);
    }

}
