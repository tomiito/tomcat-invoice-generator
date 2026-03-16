import type { VercelRequest, VercelResponse } from '@vercel/node'
import pool from '../_lib/db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { auth0_id, email, name } = req.body

  if (!auth0_id || !email) {
    return res.status(400).json({ error: 'auth0_id and email are required' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO profiles (auth0_id, email, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (auth0_id) DO UPDATE SET
         email = EXCLUDED.email,
         name = EXCLUDED.name
       RETURNING id, auth0_id, email, name`,
      [auth0_id, email, name],
    )

    res.status(200).json({ profile: result.rows[0] })
  } catch (error) {
    console.error('Profile sync error:', error)
    res.status(500).json({
      error: 'Failed to sync profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
