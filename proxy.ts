import { type NextRequest, NextResponse } from 'next/server';
import { DataDomeMiddleware, DEFAULT_SERVER_SIDE_URL, DEFAULT_TIMEOUT } from '@datadome/module-nextjs';

export const config = {
    /**
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     *
     * It avoids to send those requests to the DataDome's Middleware.
     * @see {@link https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher}
     */
    matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

const ddProxy = new DataDomeMiddleware(process.env.DATADOME_SERVER_SIDE_KEY ?? '', {
    endpointHost: process.env.DATADOME_ENDPOINT ?? DEFAULT_SERVER_SIDE_URL,
    timeout: process.env.DATADOME_TIMEOUT ? parseInt(process.env.DATADOME_TIMEOUT, 10) : DEFAULT_TIMEOUT,
    enableGraphQLSupport: process.env.DATADOME_ENABLE_GRAPHQL_SUPPORT
        ? Boolean(process.env.DATADOME_ENABLE_GRAPHQL_SUPPORT)
        : false,
    graphQLEndpoint: process.env.DATADOME_GRAPHQL_ENDPOINT ?? '/graphql',
});

async function datadomeProxy(req: NextRequest, res?: NextResponse) {
    const { pathname } = req.nextUrl;

    if (pathname === '/omit') {
        return NextResponse.next();
    }

    // Force the page to be blocked by DataDome
    if (pathname === '/blocked') {
        req.headers.set('user-agent', 'BLOCKUA');
    }
    // `datadome.handleRequest(req)` returns a promise that resolves to
    // a respones (NextResponse) or undefined
    //
    // If there's a response, we made a Datadome request.
    //
    // If the response has a rewrite, it means the request
    // was blocked and we should return it, this would
    // rewrite to the captcha page of Datadome
    //
    // If there's no rewrite, you're not a bot and we
    // send the response that includes Datadome's headers.
    return ddProxy.handleRequest(req, res);
}

export default async function proxy(req: NextRequest) {
    return datadomeProxy(req);
}
