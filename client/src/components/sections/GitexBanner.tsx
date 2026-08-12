import { Tag, Ticket } from 'lucide-react';
import { FeaturedSlider, FeaturedSlide } from './FeaturedSlider';

type SocialLink = {
  href: string;
  label: string;
  icon: string;
};

const createPartnershipFooter = (
  eventName: string,
  socialLinks: SocialLink[],
  label: string,
  organizer: string,
  host?: string,
) => (
  <div className="border-t border-white/10 mt-8 pt-6">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-xs text-slate-500 mr-1">Follow:</span>
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${eventName} ${social.label}`}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-orange-500/20 hover:border-orange-500/50 hover:text-orange-300 transition-all text-xs font-bold"
          >
            {social.icon}
          </a>
        ))}
      </div>

      <div className="text-xs text-slate-500 text-center sm:text-right">
        {label}: <span className="text-slate-400 font-semibold">{organizer}</span>
        {host && (
          <>
            {' '}
            - Hosted by: <span className="text-slate-400 font-semibold">{host}</span>
          </>
        )}
      </div>
    </div>
  </div>
);

const partnershipSlides: FeaturedSlide[] = [
  {
    image: '/gitex_banner.jpg',
    imageAlt: 'GITEX AI KAZAKHSTAN 2026, 4-5 May 2026, Atakent IEC, Almaty, Kazakhstan',
    badge: 'FutureGPT - Official Community Partner',
    title: 'GITEX AI KAZAKHSTAN 2026',
    subtitle: '20 Global Leaders. 1 Room. Zero Second Chances.',
    description:
      'From governments to global tech giants, the world is landing in Almaty. On 4-5 May 2026, Atakent IEC, Almaty, Kazakhstan will bring together global leaders, investors and senior decision makers shaping the future of AI, digital economies and startup growth across Central Asia and the Caucasus as part of the GITEX GLOBAL network.',
    location: 'Atakent IEC, Almaty, Kazakhstan',
    date: '4-5 May 2026',
    primaryCta: {
      label: 'Register to Visit',
      href: 'https://visit.gitexcac.com/',
      icon: <Ticket className="w-4 h-4" />,
    },
    secondaryCta: {
      label: 'Book a Stand',
      href: 'https://event.gitexcac.com/enterprise-enquiry-2026',
      icon: <Tag className="w-4 h-4" />,
      variant: 'secondary',
    },
    tags: ['#GITEXAIKAZAKHSTAN', '#GitexKazakhstan2026', '#AIKazakhstan', '#CentralAsiaTech'],
    footer: createPartnershipFooter(
      'GITEX AI Kazakhstan',
      [
        { href: 'https://www.linkedin.com/company/gitexaikazakhstan/', label: 'LinkedIn', icon: 'in' },
        { href: 'https://www.instagram.com/gitexaikazakhstan/', label: 'Instagram', icon: 'IG' },
        { href: 'https://www.threads.com/@gitexaikazakhstan', label: 'Threads', icon: '@' },
        { href: 'https://www.facebook.com/gitexaikazakhstan', label: 'Facebook', icon: 'f' },
      ],
      'Accelerated by',
      'GITEX GLOBAL',
      'Ministry of AI & Digital Development, Kazakhstan',
    ),
  },
  {
    image: '/bsides_banner.png',
    imageAlt: 'BSides Bangalore 2026, Annual Cyber Security Conference',
    badge: 'FutureGPT - Official Community Partner',
    title: 'BSides Bangalore 2026',
    subtitle: 'Annual Cyber Security Conference',
    description:
      'BSides Bangalore is a community-driven cybersecurity conference bringing together security researchers, ethical hackers, students, industry experts, and technology leaders to exchange knowledge, showcase research, and discuss emerging security challenges.',
    venue: 'Bangalore, India',
    date: '9 July 2026',
    time: '9:00 AM - 6:00 PM',
    primaryCta: {
      label: 'Register Now',
      // TODO: Replace with the production BSides Bangalore registration URL.
      href: '#',
      icon: <Ticket className="w-4 h-4" />,
    },
    secondaryCta: {
      label: 'Conference Details',
      // TODO: Replace with the production BSides Bangalore conference details URL.
      href: '#',
      icon: <Tag className="w-4 h-4" />,
      variant: 'secondary',
    },
    tags: ['#BSidesBangalore', '#CyberSecurity', '#SecurityResearch', '#EthicalHacking'],
    footer: createPartnershipFooter(
      'BSides Bangalore',
      [
        // TODO: Replace placeholder social URLs with production BSides Bangalore links.
        { href: '#', label: 'LinkedIn', icon: 'in' },
        { href: '#', label: 'Instagram', icon: 'IG' },
        { href: '#', label: 'Website', icon: 'www' },
      ],
      'Organized by',
      'BSides Bangalore',
    ),
  },
  {
    image: '/gisec_banner.png',
    imageAlt: 'GISEC GLOBAL 2026, Middle East and Africa largest cybersecurity event',
    badge: 'FutureGPT - Official Community Partner',
    title: 'GISEC GLOBAL 2026',
    subtitle: "Middle East & Africa's Largest Cybersecurity Event",
    description:
      "GISEC GLOBAL is a premier cybersecurity exhibition and conference in Dubai, connecting cybersecurity professionals, government agencies, global enterprises, CISOs, ethical hackers, startups, investors, and innovators to explore emerging threats and the future of AI-driven security.",
    venue: 'Dubai Exhibition Centre (DEC), Expo City, Dubai, UAE',
    date: '16-18 September 2026',
    time: '10:00 AM - 6:00 PM, subject to organizer schedule',
    primaryCta: {
      label: 'Register Now',
      // TODO: Replace with the production GISEC GLOBAL registration URL.
      href: '#',
      icon: <Ticket className="w-4 h-4" />,
    },
    secondaryCta: {
      label: 'Conference Details',
      // TODO: Replace with the production GISEC GLOBAL conference details URL.
      href: '#',
      icon: <Tag className="w-4 h-4" />,
      variant: 'secondary',
    },
    tags: ['#GISECGLOBAL', '#CyberSecurity', '#AISecurity', '#Dubai'],
    footer: createPartnershipFooter(
      'GISEC GLOBAL',
      [
        // TODO: Replace placeholder social URLs with production GISEC GLOBAL links.
        { href: '#', label: 'LinkedIn', icon: 'in' },
        { href: '#', label: 'Instagram', icon: 'IG' },
        { href: '#', label: 'Website', icon: 'www' },
      ],
      'Organized by',
      'GISEC GLOBAL',
      'Dubai Exhibition Centre, Expo City Dubai',
    ),
  },
  {
    image: '/WorldsummitAI_banner.png',
    imageAlt: 'World Summit AI 2026 - FutureGPT Community Partnership',
    badge: 'FutureGPT - Official Community Partner',
    title: 'World Summit AI 2026',
    subtitle: 'FutureGPT x World Summit AI 2026 | Community Partnership',
    description:
      "We're excited to announce that FutureGPT is joining World Summit AI 2026 as a Community Partner!\n\nWorld Summit AI is one of the leading global gatherings for the AI ecosystem, bringing together 10,000+ attendees, 300+ speakers, 100+ exhibitors, founders, researchers, investors, enterprises, policymakers, and AI innovators under one roof.\n\nThis year marks the 10th Anniversary of World Summit AI, with discussions spanning AI innovation, enterprise adoption, AI safety, governance, startups, emerging technologies, and the future of AI.\n\nAs a FutureGPT community, we're excited to connect our members with a global AI ecosystem, new ideas, meaningful collaborations, and the people shaping what comes next in artificial intelligence.\n\nFutureGPT Community Offer: Use code FUTUREGPT20 for 20% OFF your ticket.\n\nLet's connect, collaborate and shape the future of AI together.",
    location: 'Taets Art & Event Park, Amsterdam',
    date: '7-8 October 2026',
    primaryCta: {
      label: 'Learn More & Register',
      href: 'https://ti.to/inspiredminds/world-summit-ai-2026/discount/FUTUREGPT20',
      icon: <Ticket className="w-4 h-4" />,
    },
  },
];

export function GitexBanner() {
  return (
    <FeaturedSlider
      title="Community Partnership Highlights"
      subtitle="We are proud to be a Community Partner of GITEX AI KAZAKHSTAN 2026. As our member, you get exclusive access to discounted passes and early registration."
      slides={partnershipSlides}
    />
  );
}
