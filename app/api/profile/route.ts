import { asText, runStatement, serviceFailure } from '@/lib/platform-db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    // Try to get userId from query param or from cookie
    let userId = searchParams.get('userId')
    
    if (!userId) {
      const cookieHeader = request.headers.get('cookie') || ''
      const match = cookieHeader.match(/user_id=(\d+)/)
      userId = match ? match[1] : '1'
    }

    const sql = `
      SELECT id, username, password, role, full_name, nic, email 
      FROM users 
      WHERE id = ${userId}
      LIMIT 1
    `
    const result = await runStatement(sql)

    if (!result.rows[0]) {
      return Response.json(
        { ok: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return Response.json({
      ok: true,
      user: result.rows[0]
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const userId = asText(body.userId || '1')
    const fullName = asText(body.fullName).replace(/'/g, "''")
    const email = asText(body.email).replace(/'/g, "''")
    const nic = asText(body.nic).replace(/'/g, "''")
    const password = asText(body.password).replace(/'/g, "''")

    let sql = `
      UPDATE users
      SET full_name = '${fullName}', email = '${email}', nic = '${nic}'
    `
    
    if (password.trim() !== '') {
      sql += `, password = '${password}'`
    }
    
    sql += ` WHERE id = ${userId}`

    await runStatement(sql)

    // Fetch updated user
    const selectSql = `
      SELECT id, username, role, full_name, nic, email 
      FROM users 
      WHERE id = ${userId}
      LIMIT 1
    `
    const selectResult = await runStatement(selectSql)

    return Response.json({
      ok: true,
      message: 'Profile updated successfully.',
      user: selectResult.rows[0]
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}
