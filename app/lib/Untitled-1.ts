// lib/db.ts
// @ts-ignore
import mysql from 'mysql2/promise'

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // XAMPP default user
  password: '', // XAMPP default password (හිස්)
  database: 'novabank',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
