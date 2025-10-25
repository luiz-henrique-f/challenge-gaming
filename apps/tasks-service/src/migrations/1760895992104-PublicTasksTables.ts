import { MigrationInterface, QueryRunner } from "typeorm";

export class PublicTasksTables1760895992104 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        
        await queryRunner.query(
            `CREATE TABLE "tasks" (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                title varchar(255) NOT NULL,
                description text NULL,
                deadline TIMESTAMP NULL,
                priority varchar(20) NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
                status varchar(20) NULL CHECK (status IN ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')),
                created_by uuid NOT NULL,
                created_by_name text NOT NULL,
                assigned_user_ids text[] NULL,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT tasks_pk_id PRIMARY KEY (id)
            );`
        );

        await queryRunner.query(
            `CREATE TABLE "comments" (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                content text NOT NULL,
                user_id uuid NOT NULL,
                user_email varchar(255) NOT NULL,
                user_name varchar(255) NOT NULL,
                task_id uuid NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT comments_pk_id PRIMARY KEY (id),
                CONSTRAINT comments_fk_task_id FOREIGN KEY (task_id) 
                    REFERENCES tasks(id) ON DELETE CASCADE
            );`
        );

        await queryRunner.query(
            `CREATE TABLE "task_history" (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                task_id uuid NOT NULL,
                user_id uuid NOT NULL,
                action varchar(50) NOT NULL,
                old_values jsonb NULL,
                new_values jsonb NULL,
                description text NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT task_history_pk_id PRIMARY KEY (id),
                CONSTRAINT task_history_fk_task_id FOREIGN KEY (task_id) 
                    REFERENCES tasks(id) ON DELETE CASCADE
            );`
        );

        await queryRunner.query(`CREATE INDEX tasks_idx_created_by ON tasks(created_by);`);
        await queryRunner.query(`CREATE INDEX tasks_idx_status ON tasks(status);`);
        await queryRunner.query(`CREATE INDEX tasks_idx_priority ON tasks(priority);`);
        await queryRunner.query(`CREATE INDEX tasks_idx_deadline ON tasks(deadline);`);
        
        await queryRunner.query(`CREATE INDEX comments_idx_task_id ON comments(task_id);`);
        await queryRunner.query(`CREATE INDEX comments_idx_user_id ON comments(user_id);`);
        await queryRunner.query(`CREATE INDEX comments_idx_created_at ON comments(created_at);`);
        
        await queryRunner.query(`CREATE INDEX task_history_idx_task_id ON task_history(task_id);`);
        await queryRunner.query(`CREATE INDEX task_history_idx_user_id ON task_history(user_id);`);
        await queryRunner.query(`CREATE INDEX task_history_idx_created_at ON task_history(created_at);`);
        await queryRunner.query(`CREATE INDEX task_history_idx_action ON task_history(action);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS task_history_idx_action;`);
        await queryRunner.query(`DROP INDEX IF EXISTS task_history_idx_created_at;`);
        await queryRunner.query(`DROP INDEX IF EXISTS task_history_idx_user_id;`);
        await queryRunner.query(`DROP INDEX IF EXISTS task_history_idx_task_id;`);
        
        await queryRunner.query(`DROP INDEX IF EXISTS comments_idx_created_at;`);
        await queryRunner.query(`DROP INDEX IF EXISTS comments_idx_user_id;`);
        await queryRunner.query(`DROP INDEX IF EXISTS comments_idx_task_id;`);
        
        await queryRunner.query(`DROP INDEX IF EXISTS tasks_idx_deadline;`);
        await queryRunner.query(`DROP INDEX IF EXISTS tasks_idx_priority;`);
        await queryRunner.query(`DROP INDEX IF EXISTS tasks_idx_status;`);
        await queryRunner.query(`DROP INDEX IF EXISTS tasks_idx_created_by;`);

        await queryRunner.query(`DROP TABLE IF EXISTS task_history;`);
        await queryRunner.query(`DROP TABLE IF EXISTS comments;`);
        await queryRunner.query(`DROP TABLE IF EXISTS tasks;`);
    }

}
