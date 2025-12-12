import React, { useState } from 'react';
import Image from "next/image";

const certificates = [
    {
        title: "Python & Django REST API Bootcamp - Build A Python Web API",
        type: "Professional Certificate",
        issuer: "Udemy",
        date: "2024",
        link: "https://www.udemy.com/certificate/UC-fb43df2f-3568-4e64-a709-d1b598824bc0/",
        providers: [
            { name: "Udemy", url: "https://udemy.com", icon: "https://media.licdn.com/dms/image/v2/D560BAQEf_NHzN2yVQg/company-logo_100_100/company-logo_100_100/0/1723593046388/udemy_logo?e=1766620800&v=beta&t=MDQ91-Gf8dlhTSsAgM0g5Dl4-busATcAugZqMixev3A" },
        ]
    },
    {
        title: "Building Production-Ready React Apps: Setup to Deployment with Firebase",
        type: "Professional Certificate",
        issuer: "LinkedIn and Microsoft",
        date: "2024",
        link: "https://www.linkedin.com/learning/certificates/36b70fde07fa7c8facc8d9798f5f4500d02c0d9f5162931ba78fa4759f0bfa3b?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BRgRxaei%2FRs6jCWUMvlcNFw%3D%3D",
        providers: [
            { name: "Microsoft", url: "https://microsoft.com", icon: "/microsoft-logo.png" },
            { name: "LinkedIn", url: "https://linkedin.com", icon: "/linkedin-logo.png" }
        ]
    },
    {
        title: "Intermediate Next.js",
        type: "Professional Certificate",
        issuer: "Frontend Masters",
        date: "2025",
        link: "https://static.frontendmasters.com/ud/c/2d3b1b4a2c/CyZKLbetbW/intermediate-next-js.pdf",
        providers: [
            { name: "Frontend Masters", url: "https://frontendmasters.com/", icon: "/frontendmasters-logo.jpeg" }
        ]
    },
    {
        title: "React - Complete Developer Course with Hands-On Projects",
        type: "Professional Certificate",
        issuer: "Udemy",
        date: "Dec 2023",
        link: "https://www.udemy.com/certificate/UC-6f551155-00ef-48d0-8115-018ae2604df8/",
        providers: [
            { name: "Udemy", url: "https://udemy.com", icon: "https://media.licdn.com/dms/image/v2/D560BAQEf_NHzN2yVQg/company-logo_100_100/company-logo_100_100/0/1723593046388/udemy_logo?e=1766620800&v=beta&t=MDQ91-Gf8dlhTSsAgM0g5Dl4-busATcAugZqMixev3A" },
        ]
    },
    {
        title: "JavaScript Algorithms and Data Structures",
        type: "Professional Certificate",
        issuer: "freeCodeCamp",
        date: "Sep 2023",
        link: "https://www.freecodecamp.org/certification/Leo-Youmbi/javascript-algorithms-and-data-structures",
        providers: [
            { name: "freeCodeCamp", url: "https://www.freecodecamp.org", icon: "/free_code_camp_logo.jpeg" }
        ]
    }
] as const;

const CertificatesSection = ({ className="" }: { className?: string }) => {
    const [showMoreCerts, setShowMoreCerts] = useState(false);
    const [visibleCertCount, setVisibleCertCount] = useState(4);

    const handleShowMoreCerts = () => {
        if (visibleCertCount >= 12) { // Total number of certificates
            setVisibleCertCount(4) // Reset to initial count
        } else {
            setVisibleCertCount(prev => Math.min(prev + 4, 12))
        }
    }

    const showingAllCerts = visibleCertCount >= 12;

    return (
        <section id="certifications" className={`animate-fade-in ${className}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">License && Certifications</h2>
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First 4 certificates are always visible */}
                    {/* Additional certificates are shown based on visibleCertCount */}
                    {certificates.slice(0, visibleCertCount).map((cert, index) => (
                        <div key={index} className={`card-spotify p-4 rounded-lg hover-lift animate-scale-in delay-${(index % 4 + 1) * 100} flex flex-col`}>
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-foreground">{cert.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-muted-foreground text-[0.6em]">{cert.type}</p>
                                    <span className="text-muted-foreground text-[0.6em]">•</span>
                                    <p className="text-muted-foreground text-[0.6em]">{cert.issuer}</p>
                                    <span className="text-muted-foreground text-[0.6em]">•</span>
                                    <p className="text-muted-foreground text-[0.6em]">{cert.date}</p>
                                </div>
                            </div>
                            <div className="mt-auto pt-4 flex justify-between items-center">
                                <a
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground inline-flex items-center space-x-1 transition-colors group text-[0.75em]"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">View Certificate</span>
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                                </a>
                                <div className="flex gap-2">
                                    {cert.providers.map((provider, i) => (
                                        <a
                                            key={i}
                                            href={provider.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center"
                                        >
                                            <Image
                                                src={provider.icon}
                                                alt={`${provider.name} logo`}
                                                width={24}
                                                height={24}
                                                className="w-6 h-6 object-contain"
                                                quality={100}
                                                unoptimized
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show More/Less Certificates Button */}
                {visibleCertCount < 12 && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleShowMoreCerts}
                            className="text-muted-foreground hover:text-foreground inline-flex items-center space-x-2 transition-colors group"
                        >
                            <div className="flex items-center space-x-2 group-hover:translate-y-[-2px] transition-transform duration-200">
                                <span>Show More</span>
                                <span className="transform transition-transform duration-200">↓</span>
                            </div>
                        </button>
                    </div>
                )}

                {/* Show Less Button - only visible when all certificates are shown */}
                {showingAllCerts && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleShowMoreCerts}
                            className="text-muted-foreground hover:text-foreground inline-flex items-center space-x-2 transition-colors group"
                        >
                            <div className="flex items-center space-x-2 group-hover:translate-y-[-2px] transition-transform duration-200">
                                <span>Show Less</span>
                                <span className="transform transition-transform duration-200 rotate-180">↓</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default CertificatesSection