import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-emerald-500/20 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[160px]" />
      </div>

      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-emerald-400 text-sm uppercase tracking-widest">Next-Gen Financial Infrastructure</p>
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mt-6">
            Your Wealth.<br />
            <span className="text-emerald-400">Secured.</span><br />
            Amplified.
          </h1>
          <p className="mt-8 text-white/70 text-lg max-w-xl">
            Vaultchein is a unified platform for investing, protecting, and scaling capital. Built with institutional-grade security and intelligent automation.
          </p>
          <div className="mt-10 flex gap-4 flex-wrap">
            <Link href="/login" className="bg-emerald-500 px-6 py-3 rounded-full font-semibold">Start Investing</Link>
            <button className="border border-white/20 px-6 py-3 rounded-full">Explore Platform</button>
          </div>
          <div className="mt-10 text-white/50 text-sm">Trusted by investors, funds, and forward-thinking institutions worldwide.</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-sm text-white/60">Portfolio Growth</div>
          <div className="text-4xl font-bold mt-2">+$284,920</div>
          <div className="flex gap-2 mt-6 h-32 items-end">
            {[40, 70, 60, 90, 120].map((h, i) => (
              <div key={i} className="bg-emerald-400 w-full" style={{ height: h }} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-white/50 text-sm">Security Score</p>
              <p className="text-xl font-bold mt-1">99.99%</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <p className="text-white/50 text-sm">Assets Protected</p>
              <p className="text-xl font-bold mt-1">$48B</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-white/10 py-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 text-center text-white/70">
          <div><strong>$48B+</strong><br />Assets Protected</div>
          <div><strong>180+</strong><br />Countries Supported</div>
          <div><strong>Bank-Level</strong><br />Encryption</div>
          <div><strong>3ms</strong><br />Execution Speed</div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <h2 className="text-5xl font-bold">A modern stack for serious wealth</h2>
        <p className="text-white/60 mt-4 max-w-2xl">Everything you need to manage, grow, and protect capital in one unified platform.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
          {[
            { title: 'Smart Investing', desc: 'AI-powered portfolio strategies designed for optimal growth.' },
            { title: 'Digital Vault', desc: 'Secure custody for digital and traditional assets.' },
            { title: 'Global Payments', desc: 'Instant, borderless transfers with minimal friction.' },
            { title: 'Yield Strategies', desc: 'Access modern income streams and diversified returns.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white/5 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-white/60 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-3 gap-8">
        {[
          { title: 'Fortress Security', desc: 'Multi-layer encryption, cold storage, and real-time monitoring.' },
          { title: 'Intelligent Automation', desc: 'AI continuously optimizes your portfolio and risk exposure.' },
          { title: 'Institutional Access', desc: 'Professional-grade tools available to everyone.' },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-white/5 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="text-white/60 mt-3">{desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center py-32">
        <h2 className="text-5xl font-bold">Build Wealth Behind Better Walls.</h2>
        <p className="text-white/60 mt-4">Join Vaultchein and take control of your financial future.</p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link href="/login" className="bg-emerald-500 px-6 py-3 rounded-full">Get Started</Link>
          <button className="border border-white/20 px-6 py-3 rounded-full">Talk to Advisor</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 text-white/50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div><div className="text-white font-bold text-lg">Vaultchein</div><p className="mt-2">Finance secured forward.</p></div>
          <div><p className="text-white mb-2">Products</p><p>Investing</p><p>Vault</p><p>Payments</p></div>
          <div><p className="text-white mb-2">Company</p><p>About</p><p>Careers</p><p>Contact</p></div>
          <div><p className="text-white mb-2">Legal</p><p>Privacy Policy</p><p>Terms of Service</p></div>
        </div>
        <div className="text-center mt-10 text-sm">© 2026 Vaultchein. All rights reserved.</div>
      </footer>
    </>
  );
}
