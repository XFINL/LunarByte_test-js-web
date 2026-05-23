import { GalaxyScene } from '../components/GalaxyScene';
import { Navigation } from '../components/Navigation';
import { ServiceCard } from '../components/ServiceCard';
import { Footer } from '../components/Footer';
import { useScrollProgress } from '../hooks/useScrollProgress';

export default function Home() {
  const scrollProgress = useScrollProgress();

  const services = [
    {
      title: '软件开发',
      description: '定制化软件开发服务，从需求分析到部署上线，为您提供完整的解决方案。我们的团队精通多种技术栈，确保项目高质量交付。'
    },
    {
      title: '服务托管',
      description: '专业的云服务托管，提供稳定可靠的基础设施支持。24/7监控，自动扩展，让您的应用始终保持最佳性能。'
    },
    {
      title: '游戏开发帮助',
      description: '游戏开发技术支持与咨询，助力您打造精彩的游戏体验。从引擎选择到性能优化，我们全程陪伴。'
    },
    {
      title: 'AI Agents帮助',
      description: '智能代理开发与集成服务，利用前沿AI技术提升业务效率。定制化AI解决方案，驱动业务创新。'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <GalaxyScene scrollProgress={scrollProgress} />
      <Navigation />
      
      <section id="hero" className="h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            LUNARBYTE
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
            探索无限可能，创造未来科技
          </p>
          <div className="animate-bounce">
            <svg className="w-8 h-8 mx-auto text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      <section className="h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            从地球出发
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            每一次创新都始于一个想法，我们将您的愿景变为现实
          </p>
        </div>
      </section>

      <section className="h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            穿越太阳系
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            持续探索，不断突破，我们始终走在技术前沿
          </p>
        </div>
      </section>

      <section className="h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            飞跃银河系
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            广阔的技术宇宙中，我们是您可靠的导航者
          </p>
        </div>
      </section>

      <section id="services" className="min-h-screen flex items-center justify-center py-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            我们的服务
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="min-h-screen flex items-center justify-center py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            关于我们
          </h2>
          <p className="text-xl text-white/70 leading-relaxed mb-8">
            LunarByte 是一家专注于前沿技术的科技公司。我们汇聚了一群对技术充满热情的专业人才，
            致力于通过创新的解决方案帮助客户实现业务目标。
          </p>
          <p className="text-xl text-white/70 leading-relaxed">
            从软件开发到人工智能，从游戏开发到云服务，我们在多个领域拥有深厚的积累和丰富的经验。
            我们相信，技术的力量可以改变世界，而我们正在为此努力。
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
