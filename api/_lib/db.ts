import { Pool } from 'pg'

const pool = new Pool({
  connectionString:
    process.env.POSTGRES_URL ||
    'postgresql://invoice_user:invoice_pass@localhost:5433/invoice_db',
})

export default pool
