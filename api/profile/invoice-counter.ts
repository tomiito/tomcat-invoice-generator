import type { VercelRequest, VercelResponse } from '@vercel/node'
import pool from '../_lib/db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { auth0_id } = req.query

  if (!auth0_id || typeof auth0_id !== 'string') {
    return res.status(400).json({ error: 'auth0_id is required' })
  }

  try {
    const profileResult = await pool.query(
      'SELECT id FROM profiles WHERE auth0_id = $1',
      [auth0_id],
    )

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    const userId = profileResult.rows[0].id

    const counterResult = await pool.query(
      `INSERT INTO invoice_counters (user_id, next_number)
       VALUES ($1, 1)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING next_number`,
      [userId],
    )

    if (counterResult.rows.length === 0) {
      const existing = await pool.query(
        'SELECT next_number FROM invoice_counters WHERE user_id = $1',
        [userId],
      )
      return res.status(200).json({ next_number: existing.rows[0].next_number })
    }

    return res
      .status(200)
      .json({ next_number: counterResult.rows[0].next_number })
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch invoice counter',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
