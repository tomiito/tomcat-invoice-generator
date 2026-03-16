import type { VercelRequest, VercelResponse } from '@vercel/node'
import pool from './_lib/db.js'

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  try {
    const result = await pool.query('SELECT NOW() AS now')
    res.status(200).json({
      status: 'ok',
      db: 'connected',
      timestamp: result.rows[0].now,
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
