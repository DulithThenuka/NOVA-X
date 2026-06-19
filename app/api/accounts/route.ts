import { asText, runStatement, serviceFailure } from '@/lib/platform-db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = asText(searchParams.get('userId') || '1')
    const includePins =
      asText(searchParams.get('includePins') || 'false') === 'true'
    const columns = includePins
      ? 'a.*, u.username, u.full_name, u.email'
      : 'a.id, a.user_id, a.account_number, a.account_name, a.balance, u.username, u.full_name'

    const sql = `
      SELECT ${columns}
      FROM accounts a
      JOIN users u ON u.id = a.user_id
      WHERE a.user_id = ${userId}
      ORDER BY a.id
    `
    const result = await runStatement(sql)

    return Response.json({
      ok: true,
      note: 'Account list prepared.',
      accounts: result.rows
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const userId = asText(body.userId || '1')
    const accountNumber = asText(body.accountNumber)
    const accountName = asText(body.accountName || 'Savings Account').replace(
      /'/g,
      "''"
    )
    const balance = asText(body.balance || '50000.00')

    const sql = `
      INSERT INTO accounts (user_id, account_number, account_name, balance)
      VALUES (${userId}, '${accountNumber}', '${accountName}', ${balance})
      RETURNING *
    `
    const result = await runStatement(sql)

    return Response.json({
      ok: true,
      message: 'Account connected.',
      account: result.rows[0]
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const accountNumber = asText(body.accountNumber)
    const nickname = asText(body.nickname || body.accountName).replace(
      /'/g,
      "''"
    )

    const sql = `
      UPDATE accounts
      SET account_name = '${nickname}'
      WHERE account_number = '${accountNumber}'
      RETURNING *
    `
    const result = await runStatement(sql)

    return Response.json({
      ok: true,
      message: 'Account name updated.',
      account: result.rows[0]
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const accountNumber = asText(searchParams.get('accountNumber'))

    const sql = `
      DELETE FROM accounts
      WHERE account_number = '${accountNumber}'
    `
    await runStatement(sql)

    return Response.json({
      ok: true,
      message: 'Account disconnected successfully.'
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}
