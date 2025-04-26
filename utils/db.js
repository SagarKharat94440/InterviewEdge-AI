import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon('postgresql://neondb_owner:npg_canxsDrz09AC@ep-sparkling-dawn-a1t5wtvg-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');


export const db = drizzle(sql, { schema });
