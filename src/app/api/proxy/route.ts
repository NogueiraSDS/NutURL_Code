import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  let rawFilename = searchParams.get('filename') || 'download';
  // Sanitize filename: allow only letters, numbers, spaces, dots, dashes, and underscores.
  // This removes emojis, special characters, and invalid filesystem characters.
  let filename = rawFilename.replace(/[^a-zA-Z0-9 .\-_]/g, '').trim() || 'download';

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const fetchHeaders: any = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': new URL(url).origin
    };

    // Repassar o cabeçalho Range para suportar downloads grandes e vídeos longos
    const rangeHeader = req.headers.get('range');
    if (rangeHeader) {
        fetchHeaders['Range'] = rangeHeader;
    }

    const response = await fetch(url, {
        headers: fetchHeaders
    });

    if (!response.ok && response.status !== 206) {
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
    // Encode filename to avoid ByteString conversion errors with emojis/special characters
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    if (contentType) {
        headers.set('Content-Type', contentType);
    }
    
    // Pass the content length if available so the browser shows download progress
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
        headers.set('Content-Length', contentLength);
    }

    const contentRange = response.headers.get('content-range');
    if (contentRange) {
        headers.set('Content-Range', contentRange);
    }
    
    const acceptRanges = response.headers.get('accept-ranges');
    if (acceptRanges) {
        headers.set('Accept-Ranges', acceptRanges);
    }

    return new NextResponse(response.body, {
      status: response.status === 206 ? 206 : 200,
      headers
    });
  } catch (error: any) {
    console.error("Proxy Download Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
