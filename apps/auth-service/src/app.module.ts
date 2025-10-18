import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [JwtModule.register({
    secret: 'your_jwt_secret_key',
    signOptions: {
      expiresIn: '1h',
    }
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
