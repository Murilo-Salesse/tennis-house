"use client";

import { motion, Variants } from "framer-motion";
import Header from "@/components/Header";

const BENEFITS = [
  {
    icon: "cardiology",
    title: "Saúde Cardiovascular",
    description: "O tênis é um dos melhores exercícios aeróbicos. Melhora a circulação, fortalece o coração e aumenta a resistência física de forma divertida.",
    color: "from-rose-500 to-red-600",
    bgGlow: "bg-rose-500/10"
  },
  {
    icon: "psychology",
    title: "Foco e Estratégia",
    description: "Desenvolva raciocínio rápido, tomada de decisão e concentração. Cada ponto é um desafio mental que fortalece sua agilidade cognitiva.",
    color: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-500/10"
  },
  {
    icon: "groups",
    title: "Vida Social",
    description: "Faça parte de uma comunidade vibrante. Conheça pessoas, participe de torneios e crie amizades duradouras dentro e fora das quadras.",
    color: "from-amber-500 to-orange-600",
    bgGlow: "bg-amber-500/10"
  },
  {
    icon: "fitness_center",
    title: "Condicionamento Completo",
    description: "Trabalhe todo o corpo: pernas, braços, core e agilidade. O tênis queima até 600 calorias por hora com movimentos explosivos e dinâmicos.",
    color: "from-emerald-500 to-teal-600",
    bgGlow: "bg-emerald-500/10"
  }
];

export default function Home() {
  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[921px] flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10"></div>
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            alt="Tennis House Urbanova Court" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh_mhuU5QqCkDVd1Clk6pXCpEDoGNgGYBmzlZbfFy17InjJx2HVfreXiSwTEaNdWE5bdAtcilEnDQm9pP_tNFJBYp5Ozmyadww_1Ku2JnOjgNb09pPJpoxGrBbMO5URBf9V6A4UUCr-wUMq7QFAVxhJCDsarIG9qa3yX1hskI61dfPayxw12DLRl7twdGS0c2UixsLxqiZwK6_62y7PGKxM2ZZqGP-3l-Q6nN-om8CwpTj66gCza-EVt1f8qDf_hRC9c9KoHKFj-U" 
          />
        </div>
        <div className="container mx-auto px-6 relative z-20 max-w-7xl">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.span variants={fadeInVariants} className="inline-block px-4 py-1.5 bg-secondary text-primary font-bold text-xs tracking-widest uppercase rounded-full mb-6">Premium Tennis Experience</motion.span>
            <motion.h1 variants={fadeInVariants} className="text-white text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.9] mb-8">Excelência em Cada Match</motion.h1>
            <motion.p variants={fadeInVariants} className="text-white/80 text-lg md:text-xl mb-10 max-w-xl font-body leading-relaxed">
              Sinta a atmosfera dos grandes torneios em nossas quadras profissionais de saibro e piso rápido. Tecnologia de ponta e infraestrutura de elite no coração de Urbanova.
            </motion.p>
            <motion.div variants={fadeInVariants} className="flex flex-wrap gap-4">
              <a className="bg-secondary text-primary px-10 py-5 rounded-lg font-bold text-lg transition-transform hover:-translate-y-1 shadow-xl shadow-secondary/20" href="/reservar">Agende sua Quadra</a>
              <a className="border border-white/30 text-white backdrop-blur-md px-10 py-5 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors" href="#detalhes">Conheça o Clube</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefícios do Tênis */}
      <section className="py-24 bg-surface-container-lowest overflow-hidden" id="detalhes">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInVariants}
            className="mb-16 text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-secondary text-primary font-bold text-xs tracking-widest uppercase rounded-full mb-6">Por Que Jogar Tênis?</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter mb-4 uppercase">Benefícios Para Sua Vida</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">Descubra como o tênis pode transformar seu corpo, mente e vida social.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInVariants}
                className={`relative group rounded-3xl p-8 bg-white dark:bg-white/5 border border-primary/5 shadow-lg shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
              >
                {/* Glow effect */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${benefit.bgGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <span className="material-symbols-outlined text-white text-3xl">{benefit.icon}</span>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-extrabold text-primary tracking-tight mb-3">{benefit.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{benefit.description}</p>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-outline-variant/30 pt-16"
          >
            {[
              { title: "Pisos Profissionais", val: "Saibro & Hard Court", desc: "Padrões ITF com camadas Cushion para absorção de impacto e regularidade no quique." },
              { title: "Iluminação", val: "LED High Definition", desc: "Refletores de 800 lux projetados para evitar sombras e ofuscamento durante o jogo." },
              { title: "Dimensões", val: "Recuo Padrão Tour", desc: "Áreas de fundo e laterais amplas que permitem o jogo defensivo e transições rápidas." },
              { title: "Manutenção", val: "Drenagem Sifonada", desc: "Sistema de escoamento rápido que permite retorno imediato após chuvas leves." }
            ].map((spec, i) => (
              <motion.div key={i} variants={fadeInVariants}>
                <h4 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4">{spec.title}</h4>
                <p className="text-primary font-bold text-lg mb-2">{spec.val}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{spec.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section - Modified */}
      <section className="py-32 bg-primary" id="reservar">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInVariants}
            className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8"
          >
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black text-white mb-6 uppercase leading-none tracking-tighter">Planeje seu Próximo Match</h2>
              <p className="text-white/70 text-lg">Escolha o melhor horário para vivenciar a experiência Tennis House Urbanova.</p>
            </div>
          </motion.div>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInVariants}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="py-6 px-4 text-xs font-black text-secondary uppercase tracking-widest">Período</th>
                  <th className="py-6 px-4 text-xs font-black text-secondary uppercase tracking-widest">Horários</th>
                  <th className="py-6 px-4"></th>
                </tr>
              </thead>
              <tbody className="text-white">
                {/* Morning */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-10 px-4">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-white/40 group-hover:text-secondary transition-colors">sunny</span>
                      <span className="font-bold text-xl">Matutino</span>
                    </div>
                  </td>
                  <td className="py-10 px-4 text-white/60">Seg - Sex | 06:00 - 12:00</td>
                  <td className="py-10 px-4 text-right">
                    <button className="bg-white text-primary px-10 py-3.5 rounded-lg font-bold text-sm hover:bg-secondary transition-all active:scale-95">RESERVAR</button>
                  </td>
                </tr>
                {/* Prime */}
                <tr className="border-b border-white/5 bg-white/5 group relative">
                  <td className="py-10 px-4">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-secondary">star</span>
                      <div>
                        <span className="font-bold text-xl block">Prime Time</span>
                        <span className="text-[10px] text-secondary font-black uppercase tracking-widest">Mais Procurado</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-10 px-4 text-white/60">Seg - Sex | 17:00 - 22:00</td>
                  <td className="py-10 px-4 text-right">
                    <button className="bg-secondary text-primary px-10 py-3.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-secondary/20 active:scale-95">AGENDAR AGORA</button>
                  </td>
                </tr>
                {/* Weekend */}
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-10 px-4">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-white/40 group-hover:text-secondary transition-colors">weekend</span>
                      <span className="font-bold text-xl">Final de Semana</span>
                    </div>
                  </td>
                  <td className="py-10 px-4 text-white/60">Sáb - Dom | 08:00 - 20:00</td>
                  <td className="py-10 px-4 text-right">
                    <button className="bg-white text-primary px-10 py-3.5 rounded-lg font-bold text-sm hover:bg-secondary transition-all active:scale-95">RESERVAR</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-surface-container-low" id="localizacao">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-16 items-stretch">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
              className="flex-1 flex flex-col justify-center"
            >
              <h2 className="text-4xl font-black text-primary mb-6">Onde a Paixão Encontra o Jogo</h2>
              <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
                Estamos estrategicamente localizados no bairro Urbanova, oferecendo um refúgio premium para esportistas que buscam qualidade e exclusividade.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">location_on</span>
                  <div>
                    <h4 className="font-bold text-primary">Endereço</h4>
                    <p className="text-on-surface-variant">Av Jarbas Vaz de Lima, 1962 - Urbanova<br/>São José dos Campos - SP, 12244-014</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">schedule</span>
                  <div>
                    <h4 className="font-bold text-primary">Horário de Funcionamento</h4>
                    <p className="text-on-surface-variant">Segunda a Sábado: 06:00 - 23:00<br/>Domingo: 07:00 - 20:00</p>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <a className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-secondary pb-1 hover:text-secondary transition-colors" href="#">
                  Ver no Google Maps <span className="material-symbols-outlined">open_in_new</span>
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
              className="flex-1 min-h-[450px] rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <img alt="Localização Tennis House Urbanova" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv9j9SrD7hmCKaB13UBO61BkHT1VVdCQ0VVylx3-63pU5ovKo9ouH8kOudpBTg1RcdUAnMmD6ggHfpXJQZ-w3uGaGuF3EXDNzYC1WzuZajedQO1QGNA8UZTz7BVojjq2bO5IOtmblUhuSo56jZf3yTjeeAKNvd3aRZiP9o9ozV9fBlUiCAFwjFFrKnnFV_TqDDxEPmLBNA7g0Iz8IAPIoLswqYAq8_muWgrHx7vwpg3FRx2QvIUE05-8Wc53aVbLkO8VfRJoQgo9g" />
              <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Ponto de Referência</p>
                  <p className="text-primary font-bold">Próximo ao Parque Ribeirão Vermelho</p>
                </div>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">directions_car</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-50 dark:bg-primary text-emerald-900 dark:text-emerald-100 font-['Inter'] text-sm leading-relaxed w-full py-12 border-t border-emerald-900/10 dark:border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-[1440px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <img alt="Tennis House Urbanova Logo" className="h-8 w-auto rounded-lg" src="/logo.jpeg" />
                <span className="font-['Manrope'] font-black text-primary dark:text-secondary text-xl">Tennis House Urbanova</span>
              </div>
              <p className="opacity-60 text-center md:text-left">© 2026 Tennis House Urbanova. The Modern Heritage Club.</p>
            </div>
            <div className="flex gap-8">
              <a className="opacity-60 hover:opacity-100 transition-opacity hover:text-[#5b6300] dark:hover:text-[#dfec60]" href="#">Termos de Uso</a>
              <a className="opacity-60 hover:opacity-100 transition-opacity hover:text-[#5b6300] dark:hover:text-[#dfec60]" href="#">Privacidade</a>
              <a className="opacity-60 hover:opacity-100 transition-opacity hover:text-[#5b6300] dark:hover:text-[#dfec60]" href="#">Contato</a>
            </div>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-[#c3eccf] flex items-center justify-center hover:bg-secondary transition-colors text-primary" href="#">
                <span className="material-symbols-outlined">share</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-[#c3eccf] flex items-center justify-center hover:bg-secondary transition-colors text-primary" href="#">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}
