import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  private pool: any;

  constructor() {
    // Dynamic import works with nodenext moduleResolution
    import('pg').then((pg) => {
      this.pool = new pg.Pool({
        user: 'transcendence_user',
        host: 'postgres',
        database: 'transcendence',
        password: 'transcendence_pass',
        port: 5432,
      });
    });
  }

  async query(sql: string, params?: any[]) {
    return this.pool.query(sql, params);
  }
}


//paste