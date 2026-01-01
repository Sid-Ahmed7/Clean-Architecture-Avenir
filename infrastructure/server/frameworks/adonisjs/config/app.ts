import env from "#start/env";

export default {
    appKey: env.get('APP_KEY'),
    http: {
        allowMethodSpoofing: false,
        subdomainOffset: 2,
        generateRequestId: true,
        trustProxy: false,
        etag: false,
        jsonpCallbackName: 'callback',
        qs: {
            parse: {},
        },
        cookie: {
            domain: '',
            maxAge: '2h',
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        },
    }
}
