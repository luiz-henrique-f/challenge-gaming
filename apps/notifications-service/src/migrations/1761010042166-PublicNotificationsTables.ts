import { MigrationInterface, QueryRunner } from "typeorm";

export class PublicNotificationsTables1761010042166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE notifications (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id VARCHAR NOT NULL,
                task_id VARCHAR NOT NULL,
                comment_id VARCHAR DEFAULT NULL,
                type VARCHAR NOT NULL,
                content TEXT NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `);

        await queryRunner.query(`
            CREATE INDEX idx_notifications_user_id ON notifications(userId)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_notifications_task_id ON notifications(taskId)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_notifications_comment_id ON notifications(commentId)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_notifications_created_at ON notifications("createdAt")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_notifications_created_at`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_notifications_task_id`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_notifications_user_id`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_notifications_comment_id`);
        
        // Remover tabela
        await queryRunner.query(`DROP TABLE notifications`);
    }

}
