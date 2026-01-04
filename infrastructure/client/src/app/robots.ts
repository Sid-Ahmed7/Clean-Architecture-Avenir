import { MetadataRoute } from "next";

export default function robots() : MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/'],
                disallow:[
                    '/client/',
                    '/advisor/',
                    '/director/',
                    '/manager/',
                    '/create-admin/',
                    '/create-manager/',
                    '/stock/',
                    '/order-book/',
                    '/feed/',
                    '/api/'
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,

    }
}