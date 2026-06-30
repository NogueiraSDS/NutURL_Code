import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  let filename = searchParams.get('filename') || 'download';

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': new URL(url).origin
        }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
    }

    // Try to get content type
    const contentType = response.headers.get('content-type');
    if (contentType && !filename.includes('.')) {
        if (contentType.includes('video/mp4')) filename += '.mp4';
        else if (contentType.includes('image/jpeg')) filename += '.jpg';
        else if (contentType.includes('image/png')) filename += '.png';
    }

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    if (contentType) {
        headers.set('Content-Type', contentType);
    }
    
    // Pass the content length if available so the browser shows download progress
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
        headers.set('Content-Length', contentLength);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers
    });
  } catch (error: any) {
    console.error("Proxy Download Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
