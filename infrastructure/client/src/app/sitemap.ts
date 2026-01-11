import { MetadataRoute } from "next";

const locales = ['en','fr'];
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const staticRoutes = [
  { path: '', priority: 1, changeFrequency: 'daily' as const },
  { path: 'about', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: 'contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: 'help', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: 'legal', priority: 0.6, changeFrequency: 'yearly' as const },
  { path: 'login', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: 'register', priority: 0.5, changeFrequency: 'monthly' as const },
]

export default async function sitemap() : Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = []
    
    staticRoutes.forEach((route) => {
        locales.forEach((locale) => {
            const url = route.path   ? `${baseUrl}/${locale}/${route.path}` : `${baseUrl}/${locale}`;
    
            entries.push({
                url,
                lastModified: new Date(),
                changeFrequency: route.changeFrequency,
                priority: route .priority,
            })
        })
    })
    return entries;
}

