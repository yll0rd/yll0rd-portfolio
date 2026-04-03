import type { MetadataRoute } from 'next'

const BASE_URL = 'https://yll0rd.me'

/**
 * Generate sitemap for SEO
 * Includes main pages and sections with appropriate priority and change frequency
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Home page - highest priority
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    
    // About/Hero section
    {
      url: `${BASE_URL}#about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    
    // Skills section
    {
      url: `${BASE_URL}#skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    
    // Projects section - important for showcasing work
    {
      url: `${BASE_URL}#projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    
    // Experience section
    {
      url: `${BASE_URL}#experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Education section
    {
      url: `${BASE_URL}#education`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    
    // Certifications section
    {
      url: `${BASE_URL}#certificates`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    
    // Contact section
    {
      url: `${BASE_URL}#contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
