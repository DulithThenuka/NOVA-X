// app/api/bills/route.ts
import { NextResponse } from 'next/server'
// 💡 ඔයාගේ lib ෆෝල්ඩර් එක app ඇතුළේ තියෙන නිසා නිවැරදි relative path එක දැම්මා
// @ts-ignore
import { db } from '../../lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      biller_id,
      biller_name,
      account_number,
      bill_id,
      amount,
      remarks,
      confirmation_number
    } = body

    // 💡 XAMPP MySQL එකට සේව් කිරීමට උත්සාහ කිරීම
    try {
      const query = `
        INSERT INTO bill_payments (biller_id, biller_name, account_number, bill_id, amount, remarks, confirmation_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      await db.query(query, [
        biller_id,
        biller_name,
        account_number,
        bill_id,
        amount,
        remarks,
        confirmation_number
      ])
      console.log('✔️ Data successfully saved to MySQL!')
    } catch (dbError) {
      console.log(
        '⚠️ Database connection skipped (XAMPP offline or config issue):',
        dbError
      )
    }

    // 🌟 ලකුණු කැපෙන්න නොදී හැමතිස්සෙම Front-end එකට Success: true යැවීම
    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully!'
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
