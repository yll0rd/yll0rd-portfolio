import React from 'react';
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ALL_LOGOS } from "@/lib/constants";

const EducationSection = ({ className="" }: { className?: string }) => {
    return (
        <section id="education" className={`mb-24 animate-fade-in ${className}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Knowledge Acquisition</h2>
            <div className="space-y-6">

                <Card className="hover-lift">
                    <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                                <a
                                    href="https://www.linkedin.com/school/104648904"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                >
                                    <Image
                                        src={ALL_LOGOS.africanLeadershipExperience}
                                        alt="African Leadership Experience Logo"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </a>
                            </div>
                            <div>
                                <a
                                    href="https://www.linkedin.com/school/vtasrilanka"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    <CardTitle>Software Engineering Program</CardTitle>
                                </a>
                                <CardDescription>
                                    <span className="block text-muted-foreground">African Leadership Experience</span>
                                    <span className="block text-sm text-muted-foreground/60">Feb 2023 - Jun 2024</span>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Master's Degree */}
                {/* <Card className="hover-lift">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                      <a 
                        href="https://www.uclan.ac.uk/postgraduate/courses/mba-master-of-business-administration" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      >
                        <Image 
                          src="/uclan-logo.jpg" 
                          alt="University of Central Lancashire Logo" 
                          width={48}
                          height={48}
                          className="w-full h-full object-contain p-1" 
                        />
                      </a>
                    </div>
                    <div>
                      <a 
                        href="https://www.uclan.ac.uk/postgraduate/courses/mba-master-of-business-administration" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        <CardTitle>Master's degree: Business Administration and Management</CardTitle>
                      </a>
                      <CardDescription>
                        <span className="block text-muted-foreground">University of Central Lancashire</span>
                        <span className="block text-sm text-muted-foreground/60">Jan 2023 - Jan 2024</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card> */}

                {/* Bachelor's degree Course */}
                <Card className="hover-lift">
                    <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-card">
                                <a
                                    href="https://nahpi.cm/departments/computer"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                >
                                    <Image
                                        src={ALL_LOGOS.nahpi}
                                        alt="University of Bamenda Logo"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </a>
                            </div>
                            <div>
                                <a
                                    href="https://nahpi.cm/departments/computer"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    <CardTitle>Bachelor's degree: Computer Engineering</CardTitle>
                                </a>
                                <CardDescription>
                                    <span className="block text-muted-foreground">University of Bamenda</span>
                                    <span className="block text-sm text-muted-foreground/60">In Progress</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-success/10 text-success">
                                        Currently Studying
                                    </span>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>


            </div>
        </section>
    )
}

export default EducationSection;