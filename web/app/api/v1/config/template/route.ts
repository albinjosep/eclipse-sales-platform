import { NextRequest, NextResponse } from 'next/server';
import { getSetupRequirements } from '@/lib/setup-validation';

export async function GET(request: NextRequest) {
  try {
    // Get setup requirements template
    const requirements = await getSetupRequirements();
    
    return NextResponse.json({
      success: true,
      data: requirements
    });
  } catch (error) {
    console.error('Error getting setup template:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get setup template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}