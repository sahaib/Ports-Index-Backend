export default {
  async fetch(request: Request, env: any) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com' 
        : 'http://localhost:3001',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl || !targetUrl.startsWith('https://service.unece.org')) {
      return new Response('Invalid target URL', { status: 400, headers: corsHeaders });
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'User-Agent': 'PortIndex/1.0',
        },
      });

      const data = await response.text();
      return new Response(data, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html;charset=UTF-8',
        },
      });
    } catch (error) {
      return new Response('Proxy error', { 
        status: 500,
        headers: corsHeaders
      });
    }
  },
};
