import { asText, runStatement, serviceFailure } from '@/lib/platform-db'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const accountNumber = asText(body.accountNumber)
    const accountName = asText(body.accountName).replace(/'/g, "''")
    const email = asText(body.email).replace(/'/g, "''")
    const password = asText(body.password).replace(/'/g, "''")

    // Derive a unique username from email
    const username =
      email.split('@')[0] || accountName.toLowerCase().replace(/\s+/g, '')

    // 1. Insert User
    const userResult = await runStatement(`
      INSERT INTO users (username, password, full_name, email)
      VALUES ('${username}', '${password}', '${accountName}', '${email}')
      RETURNING id, username, full_name, email, role
    `)

    const user = userResult.rows[0]

    // 2. Insert Default Account
    await runStatement(`
      INSERT INTO accounts (user_id, account_number, account_name, balance)
      VALUES (${user.id}, '${accountNumber}', '${accountName} Savings', 50000.00)
    `)

    return Response.json({
      ok: true,
      message: 'Registration successful.',
      user
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}
