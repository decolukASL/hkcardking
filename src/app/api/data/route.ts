import { NextResponse } from 'next/server';
import { execSPSys } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Payload should match the SP_SYS format:
    // { "FUNC_TYPE": "...", "FUNC_LANG": "...", "FUNC_DATA": {}, "FUNC_EXEC": "..." }
    if (!payload.FUNC_TYPE || !payload.FUNC_EXEC) {
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
    }

    const result = await execSPSys(payload);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}