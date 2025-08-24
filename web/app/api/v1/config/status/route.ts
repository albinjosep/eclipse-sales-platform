import { NextRequest, NextResponse } from 'next/server';
import { validateSetup } from '@/lib/setup-validation';

export async function GET(request: NextRequest) {
  try {
    // Get setup validation status
    const validationResult = await validateSetup();
    
    return NextResponse.json({
      success: true,
      data: {
        setup_ready: validationResult.data.setup_ready,
        summary: validationResult.data.summary,
        timestamp: validationResult.timestamp
      }
    });
  } catch (error) {
    console.error('Error checking setup status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check setup status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}