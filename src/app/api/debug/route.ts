import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Test connection
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('id, slug, name, active')
      .limit(10);

    if (error) {
      return Response.json(
        { 
          success: false, 
          error: error.message,
          details: error
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      businessCount: businesses?.length || 0,
      businesses: businesses || [],
      envVars: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      }
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: String(error)
      },
      { status: 500 }
    );
  }
}
