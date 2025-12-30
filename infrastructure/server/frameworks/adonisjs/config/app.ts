import env from "#start/env.js";

export default {
    appKey: env.get('APP_KEY'),
    http: {
        allowMethodSpoofing: false,
        subdomainOffset: 2,
        generateRequestId: true,
        trustProxy: false,
        etag: false,
        jsonpCallbackName: 'callback',
        cookie: {
            domain: '',
            maxAge: '2h',
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        },
    }
}
