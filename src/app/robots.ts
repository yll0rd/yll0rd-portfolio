import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/dashboard", "/api/"],
		},
		sitemap: "https://yll0rd.me/sitemap.xml",
		host: "https://yll0rd.me",
	};
}
