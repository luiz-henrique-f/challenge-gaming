import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { CommentEntity } from "src/comment/entities/comment.entity";
import { TaskHistoryEntity } from "src/task-history/entities/task-history.entity";
import { TaskEntity } from "src/task/entities/task.entity";
import { DataSource } from "typeorm";

config()

const configService = new ConfigService();

export default new DataSource({
    type: 'postgres',
    host: configService.getOrThrow('DB_HOST'),
    port: configService.getOrThrow('DB_PORT'),
    database: configService.getOrThrow('DB_NAME'),
    username: configService.getOrThrow('DB_USERNAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    migrations: ['migrations/**'],
    entities: [TaskEntity, CommentEntity, TaskHistoryEntity],
    
})

