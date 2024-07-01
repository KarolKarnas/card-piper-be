import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { QuotesModule } from './quotes/quotes.module';
import { FavoriteQuoteModule } from './favorite-quote/favorite-quote.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    QuotesModule,
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 100 },
      { name: 'long', ttl: 60000, limit: 1000 },
    ]),
    MyLoggerModule,
    FavoriteQuoteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
