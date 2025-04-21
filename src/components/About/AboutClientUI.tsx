// src/components/About/AboutClientUI.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionContainer from '@/components/Layout/SectionContainer';
import Heading from '@/components/Common/Heading';
import Paragraph from '@/components/Common/Paragraph';
import Button from '@/components/Common/Button';

// Icons (Placeholders - consider replacing with actual SVGs or an icon library like lucide-react)
const PlaceholderIcon = ({ char }: { char: string }) => (
  <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-blue-300 text-3xl font-semibold font-poppins">
    {char}
  </div>
);

interface AboutClientUIProps {
  aboutData: any; // Prop kept for structure, but currently unused in this design
}

export const AboutClientUI: React.FC<AboutClientUIProps> = ({ aboutData }) => {
  // Note: aboutData is ignored in this redesigned version.
  // Content is hardcoded for a more personal/creative approach.

  return (
    <main className="bg-background dark:bg-neutral-950">
      {/* --- Hero Section --- */}
      <SectionContainer className="pt-20 pb-16 text-center">
        <Image
          src="/theo_keith.png"
          alt="Keith Williams - Cartoon Profile"
          width={240} // Increased size for prominence
          height={240}
          className="rounded-full mx-auto mb-8 shadow-lg border-4 border-white dark:border-neutral-800"
          priority
        />
        <Heading
          level={1}
          className="font-poppins font-semibold text-4xl sm:text-5xl mb-4 text-neutral-900 dark:text-neutral-100"
        >
          Transform AI Complexity into <span className="text-primary dark:text-primary-light">Strategic Confidence</span>
        </Heading>
        <Paragraph className="text-xl max-w-3xl mx-auto text-neutral-800 dark:text-neutral-200">
          TheoForge helps enterprise leaders navigate the AI landscape through integrated expertise in strategy, implementation, and education. We bridge the gap between AI's potential and practical business value.
        </Paragraph>
      </SectionContainer>

      {/* --- Inspired by Theophrastus Section --- */}
      <SectionContainer>
        <div className="max-w-3xl mx-auto text-center md:text-left"> {/* Center on small, left-align on medium+ */}
          <Heading level={2} className="text-2xl md:text-3xl font-semibold mb-4 font-poppins text-neutral-900 dark:text-neutral-100">
            Meet Theophrastus: Our AI Philosophy in Action
          </Heading>
          <Paragraph className="mb-4 text-lg text-neutral-800 dark:text-neutral-200">
            When you interact with our AI assistant Theophrastus, you're experiencing our philosophy in action. Named after the ancient Greek philosopher who succeeded Aristotle, our Theophrastus embodies the spirit of practical wisdom, keen observation, and clear communication that defines our approach.
          </Paragraph>
          <Paragraph className="text-lg text-neutral-800 dark:text-neutral-200 mb-6">
            Theophrastus isn't just a chatbot—he's a practical demonstration of how we apply our expertise internally. He represents our philosophy of making AI accessible, valuable, and aligned with organizational goals. Through Theophrastus, we showcase our ability to help you implement AI solutions that truly serve your business objectives while maintaining your unique brand identity.
          </Paragraph>
        </div>
      </SectionContainer>

      {/* --- Genesis Engine Technology --- */}
      <SectionContainer className="bg-gradient-to-br from-secondary/5 via-background to-primary/5 dark:from-secondary/10 dark:via-background-dark dark:to-primary/10">
        <div className="max-w-4xl mx-auto">
          <Heading level={2} className="text-center text-3xl font-semibold mb-6 font-poppins text-neutral-900 dark:text-neutral-100">
            The Genesis Engine: Our R&D Initiative
          </Heading>
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Paragraph className="text-lg text-neutral-800 dark:text-neutral-200 mb-4">
                While our primary focus is on providing strategic advisory services, we're also investing in our own R&D through the Genesis Engine. This internal initiative explores how <span className="text-secondary font-medium">AI personalities can enhance enterprise interactions</span> and create more meaningful experiences.
              </Paragraph>
              <Paragraph className="text-lg text-neutral-800 dark:text-neutral-200">
                The insights we gain from this research directly inform our advisory services, ensuring our recommendations are grounded in practical experience, not just theory. This hands-on approach to AI research exemplifies our commitment to bridging the gap between AI's potential and practical business applications.
              </Paragraph>
            </div>
            
            <div className="bg-card dark:bg-card-dark p-6 rounded-xl border border-border shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-primary dark:text-primary-light">Our Services Portfolio:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center mr-2">
                    <span className="text-secondary text-sm">01</span>
                  </div>
                  <span className="text-neutral-800 dark:text-neutral-200">Technology Strategy and Leadership</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center mr-2">
                    <span className="text-secondary text-sm">02</span>
                  </div>
                  <span className="text-neutral-800 dark:text-neutral-200">AI Driven Modernisation Advisory</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center mr-2">
                    <span className="text-secondary text-sm">03</span>
                  </div>
                  <span className="text-neutral-800 dark:text-neutral-200">Future Ready Workforce Training</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center mr-2">
                    <span className="text-secondary text-sm">04</span>
                  </div>
                  <span className="text-neutral-800 dark:text-neutral-200">Custom AI Solution Implementation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* --- Core Philosophy Section --- */}
      <SectionContainer className="bg-muted/30 dark:bg-muted/10">
        <Heading level={2} className="text-center mb-12 font-poppins font-semibold text-3xl text-neutral-900 dark:text-neutral-100">
          Our Philosophy: Clarity, Capability, Confidence
        </Heading>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Strategy Block */}
          <div className="text-center">
            <PlaceholderIcon char="S" />
            <Heading level={3} className="text-xl font-medium mb-2 text-neutral-900 dark:text-neutral-100">
              Strategic Clarity
            </Heading>
            <Paragraph className="text-neutral-800 dark:text-neutral-200">
              We help you cut through the AI hype, defining a strategy aligned precisely with your business goals and organizational context. Our focus is on practical applications that drive measurable value.
            </Paragraph>
          </div>
          {/* Engineering Block */}
          <div className="text-center">
            <PlaceholderIcon char="E" />
            <Heading level={3} className="text-xl font-medium mb-2 text-neutral-900 dark:text-neutral-100">
              Pragmatic Engineering
            </Heading>
            <Paragraph className="text-neutral-800 dark:text-neutral-200">
              We focus on building reliable, high-impact AI solutions—like RAG systems, LLM integrations, and knowledge graphs—that deliver tangible results, not just experimental showcases.
            </Paragraph>
          </div>
          {/* Education Block */}
          <div className="text-center">
            <PlaceholderIcon char="Ed" /> 
            <Heading level={3} className="text-xl font-medium mb-2 text-neutral-900 dark:text-neutral-100">
              Empowering Education
            </Heading>
            <Paragraph className="text-neutral-800 dark:text-neutral-200">
              We build your team's internal capabilities, providing training in AI fundamentals, prompt engineering, and domain-specific applications so you can confidently own and scale your AI initiatives.
            </Paragraph>
          </div>
        </div>
      </SectionContainer>

      {/* --- Unique Blend Section --- */}
      <SectionContainer>
        <Heading level={2} className="text-center mb-6 font-poppins font-semibold text-3xl text-neutral-900 dark:text-neutral-100">
          Led by Keith Williams: Engineer, Educator, AI Strategist
        </Heading>
        <Paragraph className="max-w-3xl mx-auto text-center text-lg text-neutral-800 dark:text-neutral-200">
          With <span className="text-foreground dark:text-foreground-dark font-medium">30 years in engineering leadership</span> and <span className="text-foreground dark:text-foreground-dark font-medium">20 years teaching at the university level</span>, Keith brings a unique perspective to AI implementation. His diverse background allows him to translate complex technical concepts into practical business strategies while effectively building your team's capabilities—a rare combination that makes AI accessible and impactful.
        </Paragraph>
      </SectionContainer>

      {/* --- Brand Break Section --- */}
      <SectionContainer className="py-10">
        <Link href="/" className="flex justify-center">
          <Image
            src="/logo.png"
            alt="TheoForge Logo"
            width={100} // Smaller logo as a divider
            height={27} // Maintain aspect ratio (approx 120:32 -> 100:26.6)
            className="dark:invert opacity-80 hover:opacity-100 transition-opacity"
          />
        </Link>
      </SectionContainer>

      {/* --- CTA Section --- */}
      <SectionContainer className="text-center bg-muted/30 dark:bg-muted/10">
        <Heading level={2} className="mb-4 text-3xl font-poppins font-semibold text-neutral-900 dark:text-neutral-100">
          Ready to Transform AI Complexity into Confidence?
        </Heading>
        <Paragraph className="text-lg max-w-2xl mx-auto text-neutral-800 dark:text-neutral-200 mb-6">
          Let's discuss how TheoForge can help you navigate the AI landscape and build the strategic clarity, technical capabilities, and organizational confidence you need to succeed.
        </Paragraph>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/contact" variant="secondary" size="lg">
            Chat with Theophrastus
          </Button>
          <Button href="/contact" variant="primary" size="lg">
            Schedule a Consultation
          </Button>
        </div>
      </SectionContainer>
    </main>
  );
};

export default AboutClientUI;
