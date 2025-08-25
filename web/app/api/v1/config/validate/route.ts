import { NextRequest, NextResponse } from 'next/server';
import { validateAPIKey } from '@/lib/setup-validation.ts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, api_key, additional_params } = body;

    if (!service || !api_key) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: service and api_key'
        },
        { status: 400 }
      );
    }

    // Validate the API key
    const validationResult = await validateAPIKey({
      service,
      api_key,
      additional_params
    });
    
    return NextResponse.json({
      success: true,
      data: validationResult
    });
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate API key',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}