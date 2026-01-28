import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // <--- important, makes it injectable in other modules
})
export class DatabaseModule {}
//paste