import { useState, useEffect, createContext, useContext } from 'react';

// ============ THEME CONTEXT ============
type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme') as Theme;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============ THEME TOGGLE BUTTON ============
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun icon (shown in light mode) */}
      <svg className="icon sun-icon w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      {/* Moon icon (shown in dark mode) */}
      <svg className="icon moon-icon w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  );
}

// ============ NAVIGATION ============
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Contact'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'py-5 bg-transparent'}`} style={{ background: scrolled ? 'var(--nav-bg-scrolled)' : undefined }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="font-mono text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          {'<SJ />'}
        </a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link text-sm transition-colors font-medium" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#06b6d4')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {link}
            </a>
          ))}
          <ThemeToggle />
          <a href="https://drive.google.com/file/d/1FxBXlgxlisxxlWl1MYnGQ6rcaXOfQwx1/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Resume
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-2xl" style={{ color: 'var(--text-muted)' }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-xl p-6">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="block py-3 transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#06b6d4')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {link}
            </a>
          ))}
          <a href="https://drive.google.com/file/d/1FxBXlgxlisxxlWl1MYnGQ6rcaXOfQwx1/view?usp=sharing" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="block mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold text-center hover:opacity-90 transition-opacity">
            Resume
          </a>
        </div>
      )}
    </nav>
  );
}

// ============ HERO SECTION ============
function Hero() {
  const [text, setText] = useState('');
  const fullText = 'DevOps & Cloud Engineer';
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 grid-bg opacity-50"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-float" style={{ background: 'var(--orb-1)' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float" style={{ background: 'var(--orb-2)', animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl animate-float" style={{ background: 'var(--orb-3)', animationDelay: '1.5s' }}></div>

      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
        />
      ))}

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Terminal-style intro */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>Available for opportunities</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 animate-slide-up" style={{ animationDelay: '0.2s', color: 'var(--text-primary)' }}>
          <span>Sandeep</span>{' '}
          <span className="gradient-text">Jadhav</span>
        </h1>

        <div className="h-12 md:h-16 flex items-center justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <span className="font-mono text-xl md:text-2xl text-cyan-400 terminal-cursor">
            {text}
          </span>
        </div>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ color: 'var(--text-muted)', animationDelay: '0.6s' }}>
          IIT Bombay graduate building resilient cloud infrastructure and automated pipelines 
          that power data platforms for 100+ enterprise clients.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <a href="#projects" className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:-translate-y-1">
            View Projects
          </a>
          <a href="#contact" className="px-8 py-3 rounded-xl border font-semibold transition-all hover:-translate-y-1" style={{ borderColor: 'var(--border-hover)', color: '#06b6d4' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Get in Touch
          </a>
          <a href="https://drive.google.com/file/d/1FxBXlgxlisxxlWl1MYnGQ6rcaXOfQwx1/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="md:hidden px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:-translate-y-1">
            Resume
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '1s' }}>
          {[
            { value: '3+', label: 'Years Exp' },
            { value: '100+', label: 'Clients Served' },
            { value: 'IIT', label: 'Bombay' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-2" style={{ borderColor: 'var(--border-hover)' }}>
          <div className="w-1.5 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

// ============ ABOUT SECTION ============
function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="About Me" subtitle="Who I am" />
        
        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
          {/* Terminal card */}
          <div className="glass-card rounded-2xl p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--divider)' }}>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs" style={{ color: 'var(--text-dim)' }}>~/sandeep/about.sh</span>
            </div>
            <div className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p><span className="text-cyan-400">$</span> cat profile.json</p>
              <p style={{ color: 'var(--text-dim)' }}>{'{'}</p>
              <p className="pl-4"><span className="text-violet-400">"name"</span>: <span className="text-green-400">"Sandeep Jadhav"</span>,</p>
              <p className="pl-4"><span className="text-violet-400">"education"</span>: <span className="text-green-400">"IIT Bombay"</span>,</p>
              <p className="pl-4"><span className="text-violet-400">"degree"</span>: <span className="text-green-400">"Dual Degree (B.Tech + M.Tech)"</span>,</p>
              <p className="pl-4"><span className="text-violet-400">"focus"</span>: <span className="text-green-400">"Cloud & DevOps"</span>,</p>
              <p className="pl-4"><span className="text-violet-400">"experience"</span>: <span className="text-yellow-400">3</span>,</p>
              <p className="pl-4"><span className="text-violet-400">"company"</span>: <span className="text-green-400">"GIST Impact"</span>,</p>
              <p className="pl-4"><span className="text-violet-400">"passions"</span>: [<span className="text-green-400">"Automation"</span>, <span className="text-green-400">"Reliability"</span>, <span className="text-green-400">"AI"</span>]</p>
              <p style={{ color: 'var(--text-dim)' }}>{'}'}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I'm a <span className="text-cyan-400 font-semibold">DevOps & Cloud Engineer</span> at GIST Impact, 
              where I architect and maintain the infrastructure that powers data platforms serving 
              100+ enterprise clients across the globe.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              With a Dual Degree from IIT Bombay in Environmental Science & Engineering, I bring 
              a unique analytical perspective to infrastructure challenges. My work spans the full 
              cloud lifecycle — from provisioning secure VPCs and automating CI/CD pipelines to 
              implementing observability stacks and optimizing costs.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              I'm passionate about building systems that are not just functional but 
              <span className="text-violet-400 font-semibold"> resilient, observable, and cost-efficient</span>. 
              When I'm not wrangling containers, I'm exploring AI-powered tools and building 
              projects that merge DevOps with machine learning.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-4">
              {['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium border" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ SKILLS SECTION ============
function Skills() {
  const skillCategories = [
    {
      title: 'DevOps & Cloud',
      icon: '☁️',
      skills: ['Docker', 'Kubernetes (EKS)', 'Terraform', 'GitHub Actions', 'ArgoCD', 'AWS', 'GCP', 'Cloud Run', 'Linux'],
      gradient: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'rgba(6, 182, 212, 0.2)',
    },
    {
      title: 'AWS Services',
      icon: '🔧',
      skills: ['EC2', 'S3', 'IAM', 'VPC', 'API Gateway', 'CloudWatch', 'CloudFront', 'Auto Scaling', 'Lambda', 'SNS', 'SQS', 'RDS', 'Secrets Manager'],
      gradient: 'from-orange-500/20 to-orange-500/5',
      borderColor: 'rgba(249, 115, 22, 0.2)',
    },
    {
      title: 'Monitoring & Backend',
      icon: '📊',
      skills: ['Grafana', 'Prometheus', 'FastAPI', 'Flask', 'Django', 'Streamlit', 'Chainlit', 'Postman'],
      gradient: 'from-green-500/20 to-green-500/5',
      borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    {
      title: 'Databases & Languages',
      icon: '💾',
      skills: ['PostgreSQL', 'Snowflake', 'MongoDB', 'Redis', 'Python', 'SQL', 'Bash', 'C++'],
      gradient: 'from-violet-500/20 to-violet-500/5',
      borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    {
      title: 'AI & Vector DBs',
      icon: '🤖',
      skills: ['RAG', 'pgvector', 'Gemini Embeddings', 'LangChain', 'LLM Orchestration'],
      gradient: 'from-pink-500/20 to-pink-500/5',
      borderColor: 'rgba(236, 72, 153, 0.2)',
    },
    {
      title: 'Libraries & Tools',
      icon: '📦',
      skills: ['Pandas', 'NumPy', 'Plotly', 'Selenium', 'Pytest', 'Pydantic'],
      gradient: 'from-yellow-500/20 to-yellow-500/5',
      borderColor: 'rgba(234, 179, 8, 0.2)',
    },
  ];

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Technical Skills" subtitle="My toolkit" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${category.gradient}`}
              style={{ borderColor: category.borderColor }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map(skill => (
                  <span key={skill} className="skill-badge px-3 py-1.5 rounded-lg text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ EXPERIENCE SECTION ============
function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Experience" subtitle="Where I've worked" />
        
        <div className="mt-12 space-y-12">
          {/* Current role */}
          <div className="relative pl-8 md:pl-12 border-l-2" style={{ borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full timeline-dot"></div>
            
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>DevOps & Cloud Engineer</h3>
                  <p className="text-cyan-400 font-semibold">GIST Impact</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-medium border" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                    Current
                  </span>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>Jan 2024 — Present</p>
                  <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Noida, India</p>
                </div>
              </div>
              
              <ul className="space-y-3 mt-4">
                {[
                  'Built GitHub Actions CI/CD pipelines for Dockerized microservices, cutting release times from 30m to 3m.',
                  'Configured event-driven EC2 Auto Scaling (ASG) via CloudWatch and Lambda, cutting compute costs by 30%.',
                  'Managed high-availability AWS RDS databases with multi-AZ failovers, automated snapshots, and IAM roles.',
                  'Secured application credentials and infrastructure state utilizing AWS Secrets Manager and IAM roles.',
                  'Led incident response for APIs and data pipelines; deployed Prometheus/Grafana alerting, cutting MTTR by 40%.',
                  'Provisioned cloud infrastructure for a Snowflake-to-PostgreSQL pipeline processing data for 18,000+ companies.',
                  'Architected secure VPCs (public/private subnets, NAT) and configured CloudFront/API Gateway for 100+ clients.',
                  'Automated pull request code reviews via GitHub Actions and Claude AI, enforcing baseline security standards.',
                  'Integrated automated Pytest suites into CI pipelines, eliminating regressions across 26 backend modules.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <span className="text-cyan-400 mt-1 flex-shrink-0">▹</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Internship */}
          <div className="relative pl-8 md:pl-12 border-l-2" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}>
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50"></div>
            
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Developer Intern</h3>
                  <p className="text-violet-400 font-semibold">GIST Impact</p>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Sept 2022 — Dec 2022</p>
                  <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Mumbai, India</p>
                </div>
              </div>
              
              <ul className="space-y-3 mt-4">
                {[
                  'Built a GitHub Actions CI/CD pipeline to automate Docker container deployments to Google Cloud Platform (GCP).',
                  'Developed and containerized a Python document translation API, managing its GCP deployment for 50+ users.',
                  'Integrated automated linting and unit testing into CI pipelines to enforce code quality before deployment.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <span className="text-violet-400 mt-1 flex-shrink-0">▹</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ PROJECTS SECTION ============
function Projects() {
  const projects = [
    {
      title: 'Laya: AI Stock Analysis Agent',
      description: 'Dual-AI system using Laya for candidate scoring and Gemini for deep trade reasoning. Concurrent scanner analyzing 750+ NSE equities with TOON compression for 70% token reduction.',
      tags: ['Python', 'Gemini AI', 'LangChain', 'Telegram Bot', 'TOON'],
      links: [
        { label: 'GitHub', url: 'https://github.com/sandeepj15/laya-stock-analysis-agent' },
        { label: 'Telegram', url: 'https://t.me/+7ArKtR7hOM5hMjA1' },
      ],
      date: 'Sep 2026',
      icon: '📈',
    },
    {
      title: 'CloudGuard AI: Security Auditor',
      description: 'Docker Compose stack using Llama-3.3 to scan Terraform and Dockerfiles against CIS Benchmarks. Chainlit frontend with FastAPI backend delivering instant security scores.',
      tags: ['Docker', 'Llama-3.3', 'FastAPI', 'Chainlit', 'Terraform'],
      links: [
        { label: 'GitHub', url: 'https://github.com/sandeepj15/cloudguard-ai' },
      ],
      date: 'Apr 2026',
      icon: '🛡️',
    },
    {
      title: 'TradingView Recommendations Platform',
      description: 'Async data ingestion platform processing 40K+ daily data points. Deployed via GitHub Actions to self-managed k3s cluster with Prometheus/Grafana monitoring.',
      tags: ['Kubernetes', 'Prometheus', 'Grafana', 'GitHub Actions', 'Python'],
      links: [
        { label: 'GitHub', url: 'https://github.com/sandeepj15/Tradingview-recommendations' },
      ],
      date: 'May 2022',
      icon: '📊',
    },
  ];

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Projects" subtitle="What I've built" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {projects.map((project) => (
            <div key={project.title} className="project-card glass-card rounded-2xl p-6 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{project.icon}</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>{project.date}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{project.title}</h3>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--text-muted)' }}>{project.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 rounded-md text-xs font-medium border" style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)', borderColor: 'var(--tag-border)' }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--divider)' }}>
                {project.links.map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ EDUCATION SECTION ============
function Education() {
  return (
    <section id="education" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Education" subtitle="Academic background" />
        
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-bl-full"></div>
            
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-2xl flex-shrink-0">
                  🎓
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Indian Institute of Technology Bombay</h3>
                  <p className="text-cyan-400 font-medium mt-1">Dual Degree (B.Tech + M.Tech)</p>
                  <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Environmental Science & Engineering</p>
                  <p className="text-sm mt-2 font-mono" style={{ color: 'var(--text-dim)' }}>2018 — 2023</p>
                </div>
              </div>

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--divider)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Completed a rigorous 5-year dual degree program at one of India's premier technical institutes, 
                  developing strong analytical and problem-solving skills that translate directly to 
                  designing efficient, scalable infrastructure systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ CONTACT SECTION ============
function Contact() {
  const { theme } = useTheme();
  
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <SectionTitle title="Get in Touch" subtitle="Let's connect" />
        
        <p className="text-lg mt-8 max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          I'm always interested in hearing about new opportunities, interesting projects, 
          or just connecting with fellow engineers.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {/* Email */}
          <a href="mailto:jadhavsandeep1919@gmail.com" className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors" style={{ background: 'rgba(6, 182, 212, 0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)')}
            >
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Email</span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>jadhavsandeep1919@gmail.com</span>
          </a>

          {/* Phone */}
          <a href="tel:+919542817345" className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors" style={{ background: 'rgba(34, 197, 94, 0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)')}
            >
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Phone</span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>+91-9542817345</span>
          </a>

          {/* LinkedIn */}
          <a href="https://linkedin.com/in/jadhavsandeep15" target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors" style={{ background: 'rgba(59, 130, 246, 0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)')}
            >
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>LinkedIn</span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>jadhavsandeep15</span>
          </a>

          {/* GitHub */}
          <a href="https://github.com/sandeepj15" target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors" style={{ background: theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(100, 116, 139, 0.1)' }}
              onMouseEnter={e => (e.currentTarget.style.background = theme === 'dark' ? 'rgba(156, 163, 175, 0.2)' : 'rgba(100, 116, 139, 0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(100, 116, 139, 0.1)')}
            >
              <svg className="w-6 h-6" style={{ color: theme === 'dark' ? '#d1d5db' : '#475569' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>GitHub</span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>sandeepj15</span>
          </a>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <a
            href="mailto:jadhavsandeep1919@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:-translate-y-1 animate-gradient"
          >
            Say Hello
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className="py-8 px-6" style={{ borderTop: '1px solid var(--divider)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-mono" style={{ color: 'var(--text-dim)' }}>
          © 2026 Sandeep Jadhav. Built with React & Tailwind.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/sandeepj15" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan-400" style={{ color: 'var(--text-dim)' }}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/jadhavsandeep15" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan-400" style={{ color: 'var(--text-dim)' }}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

// ============ SECTION TITLE COMPONENT ============
function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-sm text-cyan-400 mb-2">{subtitle}</p>
      <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"></div>
    </div>
  );
}

// ============ MAIN APP ============
function AppContent() {
  const { theme } = useTheme();

  useEffect(() => {
    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
