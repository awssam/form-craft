import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon, CheckCircle2, Sparkles, Layers, Database, BarChart3, Zap, Wand2 } from 'lucide-react';
import FeatureCard from './feature-card';
import TemplateShowcase from './template-showcase';
import Link from 'next/link';

const LINKS = {
  githubProfile: 'https://github.com/Varadarajan-M',
  linkedinProfile: 'https://www.linkedin.com/in/varadarajan-m-724512164/',
  projectRepo: 'https://github.com/Varadarajan-M/form-craft',
  signin: '/sign-in',
  templates: '/templates',
  signup: '/sign-up',
  portfolio: 'https://varadarajan-m.vercel.app',
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white scroll-smooth">
      {/* Navbar */}
      <header className="container mx-auto py-6 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-600"></div>
          <span className="font-bold text-xl">FormCraft</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#templates" className="text-gray-300 hover:text-white transition-colors">
            Templates
          </a>
          <a href={LINKS.projectRepo} className="text-gray-300 hover:text-white transition-colors">
            Github
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-zinc-800 to-zinc-600 hover:from-zinc-700 hover:to-zinc-500 text-white">
            <Link href={LINKS.signin}>Log in</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-black/0 pointer-events-none"></div>
        <div className="absolute top-40 -left-64 w-96 h-96 bg-zinc-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-80 -right-64 w-96 h-96 bg-zinc-900/20 rounded-full filter blur-3xl"></div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-zinc-500/50 bg-zinc-500/10 text-white">
              <Sparkles className="mr-1 h-3 w-3 text-yellow-650" /> Visual Form Builder
            </Badge>
            <h1 className="text-3xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
              Build Beautiful Forms Without Code
            </h1>
            <p className="text-base md:text-xl text-gray-300 mb-8">
              FormCraft is a powerful no code drag-and-drop form builder that helps you create stunning, responsive
              forms with advanced features in minutes, not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 border border-zinc-400/50 rounded-full text-white"
              >
                <Link href={LINKS.signin}>Start Building for Free</Link>
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-black bg-gray-300 border-gray-700 rounded-full hover:bg-gray-800"
              >
                <Link href={'#demo'}>Watch Demo</Link>
              </Button>
            </div>
          </div>

          <div
            id="demo"
            className="relative mx-auto max-w-5xl mt-16 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900/70"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black to-zinc-500/10 pointer-events-none"></div>
            <div className="p-8 md:p-12 flex flex-col items-center">
              <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center mb-6 relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/5 to-zinc-500/5"></div>
                <div className="h-20 w-20 rounded-full bg-zinc-500/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white ml-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">Watch how FormCraft transforms your form building experience</p>
                </div>
              </div>
              <div className="relative z-50">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                  See FormCraft in Action
                </h3>
                <p className="text-gray-300/90 text-center max-w-2xl relative z-50">
                  Watch our quick demo to see how easy it is to create beautiful, functional forms with our
                  drag-and-drop builder, conditional logic, and powerful integrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-gradient-to-b from-black to-zinc-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 -right-40 w-96 h-96 bg-zinc-900/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-slate-900/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 border border-zinc-500/50 bg-zinc-500/10 text-zinc-300 rounded-full text-sm font-medium">
              <Sparkles className="inline-block mr-2 h-3.5 w-3.5 text-purple-400" />
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
              Everything You Need to Create Perfect Forms
            </h2>
            <p className="text-zinc-300">
              Design forms that convert with an intuitive builder, intelligent logic, and seamless integrations. Whether
              you’re starting with our templates or building from scratch, FormCraft has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layers className="h-6 w-6 text-purple-400" />}
              title="Drag & Drop Builder"
              description="Easily add, remove, and rearrange form fields with our intuitive drag-and-drop interface."
              gradient="from-zinc-900/80 to-slate-950/20"
              status="completed"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-blue-400" />}
              title="Conditional Logic"
              description="Create dynamic forms that adjust in real time based on user inputs."
              gradient="from-zinc-900/80 to-black/20"
              status="completed"
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-6 w-6 text-green-400" />}
              title="Advanced Validation"
              description="Built-in validation for common use cases and custom validation with regex support."
              gradient="from-zinc-900/80 to-green-950/20"
              status="completed"
            />
            <FeatureCard
              icon={<Database className="h-6 w-6 text-amber-400" />}
              title="Seamless Integrations"
              description="Connect with Google Sheets, Airtable, and webhooks to automate your workflows."
              gradient="from-zinc-900/80 to-amber-950/20"
              status="completed"
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-rose-400" />}
              title="Real-Time Analytics"
              description="Track form views, submissions, completion rates, and other key metrics."
              gradient="from-zinc-900/80 to-rose-950/20"
              status="completed"
            />
            <FeatureCard
              icon={<Wand2 className="h-6 w-6 text-indigo-400" />}
              title="AI Form Generator"
              description="Generate forms from prompts and customize them to your needs with AI assistance."
              gradient="from-zinc-900/80 to-indigo-950/20"
              status="upcoming"
            />
          </div>

          <div className="mt-16 text-center">
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white"
            >
              <Link href={LINKS.signin}>Explore All Features</Link>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-3 py-1 border border-zinc-500/50 bg-zinc-500/10 text-zinc-300 rounded-full text-sm font-medium">
              Templates
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Start with Pre-built Templates</h2>
            <p className="text-zinc-300">
              Choose from a diverse range of professionally designed templates and customize them to fit your unique
              needs.
            </p>
          </div>

          <TemplateShowcase />
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-24 bg-gradient-to-b from-black to-zinc-900">
        <Testimonials />
      </section> */}

      {/* Pricing Section
      // <section id="pricing" className="py-24 bg-gradient-to-b from-zinc-900 to-black">
      //   <PricingSection />
      // </section> */}

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/20 to-zinc-900/20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(60,60,60,0.1),transparent_70%)]"></div>
        <div className="absolute top-20 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        <div className="absolute bottom-20 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Form Experience?</h2>
            <p className="text-base md:text-xl text-zinc-300 mb-10 leading-relaxed">
              Create beautiful forms that convert better, save time, and provide a seamless experience for your users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-zinc-800 to-zinc-600 hover:from-zinc-700 hover:to-zinc-500 text-white">
                  Get Started for Free
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-zinc-500">No credit card required. Free plan available forever.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-zinc-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#templates" className="text-zinc-400 hover:text-white transition-colors">
                    Templates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href={LINKS.linkedinProfile} className="text-zinc-400 hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={LINKS.githubProfile} className="text-zinc-400 hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-600"></div>
                <span className="font-bold text-white">FormCraft</span>
              </div>
              <span className="text-muted-foreground/60 text-sm">
                Built by{' '}
                <a href={LINKS.portfolio} target="_blank" className="underline">
                  Varadarajan M
                </a>
                . The source code is available on{' '}
                <a className="underline" href={LINKS.projectRepo} target="_blank">
                  Github
                </a>
                .
              </span>
            </div>

            <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} FormCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
