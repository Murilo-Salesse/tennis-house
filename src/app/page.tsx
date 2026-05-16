"use client";

import React, { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import Header from "@/components/Header";

const BENEFITS = [
  {
    icon: "cardiology",
    title: "Saúde Cardiovascular",
    description:
      "O tênis é um dos melhores exercícios aeróbicos. Melhora a circulação, fortalece o coração e aumenta a resistência física de forma divertida.",
    color: "from-rose-500 to-red-600",
    bgGlow: "bg-rose-500/10",
  },
  {
    icon: "psychology",
    title: "Foco e Estratégia",
    description:
      "Desenvolva raciocínio rápido, tomada de decisão e concentração. Cada ponto é um desafio mental que fortalece sua agilidade cognitiva.",
    color: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-500/10",
  },
  {
    icon: "groups",
    title: "Vida Social",
    description:
      "Faça parte de uma comunidade vibrante. Conheça pessoas, participe de torneios e crie amizades duradouras dentro e fora das quadras.",
    color: "from-amber-500 to-orange-600",
    bgGlow: "bg-amber-500/10",
  },
  {
    icon: "fitness_center",
    title: "Condicionamento Completo",
    description:
      "Trabalhe todo o corpo: pernas, braços, core e agilidade. O tênis queima até 600 calorias por hora com movimentos explosivos e dinâmicos.",
    color: "from-emerald-500 to-teal-600",
    bgGlow: "bg-emerald-500/10",
  },
];

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
  period: "morning" | "afternoon" | "night";
  price: number;
}

const TIME_SLOTS: TimeSlot[] = [
  {
    time: "05:00",
    endTime: "06:00",
    available: true,
    period: "morning",
    price: 150,
  },
  {
    time: "06:00",
    endTime: "07:00",
    available: true,
    period: "morning",
    price: 150,
  },
  {
    time: "07:00",
    endTime: "08:00",
    available: true,
    period: "morning",
    price: 150,
  },
  {
    time: "08:00",
    endTime: "09:00",
    available: true,
    period: "morning",
    price: 150,
  },
  {
    time: "09:00",
    endTime: "10:00",
    available: false,
    period: "morning",
    price: 150,
  },
  {
    time: "10:00",
    endTime: "11:00",
    available: true,
    period: "morning",
    price: 150,
  },
  {
    time: "11:00",
    endTime: "12:00",
    available: true,
    period: "morning",
    price: 150,
  },
  {
    time: "12:00",
    endTime: "13:00",
    available: true,
    period: "afternoon",
    price: 150,
  },
  {
    time: "13:00",
    endTime: "14:00",
    available: true,
    period: "afternoon",
    price: 150,
  },
  {
    time: "14:00",
    endTime: "15:00",
    available: true,
    period: "afternoon",
    price: 150,
  },
  {
    time: "15:00",
    endTime: "16:00",
    available: true,
    period: "afternoon",
    price: 150,
  },
  {
    time: "16:00",
    endTime: "17:00",
    available: true,
    period: "afternoon",
    price: 150,
  },
  {
    time: "17:00",
    endTime: "18:00",
    available: true,
    period: "night",
    price: 150,
  },
  {
    time: "18:00",
    endTime: "19:00",
    available: false,
    period: "night",
    price: 150,
  },
  {
    time: "19:00",
    endTime: "20:00",
    available: true,
    period: "night",
    price: 150,
  },
  {
    time: "20:00",
    endTime: "21:00",
    available: true,
    period: "night",
    price: 150,
  },
  {
    time: "21:00",
    endTime: "22:00",
    available: true,
    period: "night",
    price: 150,
  },
  {
    time: "22:00",
    endTime: "23:00",
    available: true,
    period: "night",
    price: 150,
  },
];

function formatDateLong(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month}, ${year}`;
}

export default function Home() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstDayWeekday = calendarDays[0].getDay();

  const selectedSlot = selectedTime
    ? TIME_SLOTS.find((s) => s.time === selectedTime)
    : null;

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isSelected = (date: Date) =>
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  const morningSlots = TIME_SLOTS.filter((s) => s.period === "morning");
  const afternoonSlots = TIME_SLOTS.filter((s) => s.period === "afternoon");
  const nightSlots = TIME_SLOTS.filter((s) => s.period === "night");

  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const renderSlotGroup = (label: string, icon: string, slots: TimeSlot[]) => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-secondary text-lg">
          {icon}
        </span>
        <span className="text-sm font-bold text-on-surface-variant">
          {label}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {slots.map((slot) =>
          !slot.available ? (
            <div
              key={slot.time}
              className="p-3 rounded-xl bg-surface-container-high opacity-40 cursor-not-allowed text-center"
            >
              <span className="block text-base font-bold text-on-surface-variant/40">
                {slot.time}
              </span>
              <span className="text-[10px] text-on-surface-variant/40 line-through">
                Reservado
              </span>
            </div>
          ) : (
            <button
              key={slot.time}
              onClick={() => setSelectedTime(slot.time)}
              className={`group p-3 rounded-xl text-center transition-all duration-200 ${
                selectedTime === slot.time
                  ? "bg-primary text-white ring-4 ring-secondary-container/30 scale-[1.03]"
                  : "border border-surface-variant hover:border-secondary-container hover:bg-secondary-container/10"
              }`}
            >
              <span
                className={`block text-base font-bold ${
                  selectedTime === slot.time
                    ? "text-white"
                    : "text-primary group-hover:text-on-secondary-container"
                }`}
              >
                {slot.time}
              </span>
              <span
                className={`text-[10px] ${
                  selectedTime === slot.time
                    ? "text-secondary-container"
                    : "text-on-surface-variant"
                }`}
              >
                {selectedTime === slot.time ? "Selecionado ✓" : "Disponível"}
              </span>
            </button>
          ),
        )}
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden">
      <Header />

      {/* Hero Compacto - Introdução rápida */}
      <section className="relative min-h-[480px] md:min-h-[520px] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/40 z-10"></div>
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
            <motion.span
              variants={fadeInVariants}
              className="inline-block px-4 py-1.5 bg-secondary-container text-primary font-bold text-xs tracking-widest uppercase rounded-full mb-4"
            >
              Reserve sua Quadra
            </motion.span>
            <motion.h1
              variants={fadeInVariants}
              className="text-white text-4xl md:text-6xl font-extrabold tracking-tight leading-[0.95] mb-5"
            >
              Tennis House - Próximo a fazenda da vovó
            </motion.h1>
            <motion.p
              variants={fadeInVariants}
              className="text-white/80 text-lg md:text-xl mb-8 max-w-xl font-body leading-relaxed"
            >
              Agende seu horário agora e garanta sua quadra. Rápido, fácil e
              direto.
            </motion.p>
            <motion.div variants={fadeInVariants}>
              <a
                className="bg-secondary-container text-primary px-10 py-4 rounded-lg font-bold text-lg transition-transform hover:-translate-y-1 shadow-xl shadow-secondary-container/30 inline-flex items-center gap-2"
                href="#reservar"
              >
                <span className="material-symbols-outlined">
                  calendar_month
                </span>
                Ver Horários Disponíveis
              </a>
            </motion.div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/50"
        >
          <span className="material-symbols-outlined text-3xl">
            keyboard_arrow_down
          </span>
        </motion.div>
      </section>

      {/* =====================================================
          SEÇÃO PRINCIPAL: CALENDÁRIO DE RESERVAS
          ===================================================== */}
      <section
        className="py-16 md:py-20 bg-surface-container-lowest"
        id="reservar"
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInVariants}
            className="mb-10 text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-secondary-container text-primary font-bold text-xs tracking-widest uppercase rounded-full mb-4">
              Agendamento Online
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tighter mb-3 uppercase">
              Reserve Sua Quadra
            </h2>
            <p className="text-on-surface-variant max-w-lg mx-auto">
              Escolha a data e horário que melhor se encaixam na sua agenda.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Calendário + Horários */}
            <div className="lg:col-span-8 space-y-8">
              {/* Passo 1: Calendário */}
              <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-primary/5">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm">
                    1
                  </span>
                  <h3 className="text-lg font-bold text-primary">
                    Escolha a Data
                  </h3>
                </div>
                <div className="grid grid-cols-7 gap-1.5 md:gap-2 text-center">
                  {WEEKDAY_LABELS.map((label) => (
                    <div
                      key={label}
                      className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-50 py-2"
                    >
                      {label}
                    </div>
                  ))}
                  {Array.from({ length: firstDayWeekday }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-12 md:h-14" />
                  ))}
                  {calendarDays.map((date, i) => {
                    const selected = isSelected(date);
                    const todayFlag = isToday(date);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                        className={`h-12 md:h-14 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                          selected
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : todayFlag
                              ? "bg-secondary/20 text-primary ring-2 ring-secondary hover:bg-primary hover:text-white"
                              : "bg-surface-container-high text-primary hover:bg-primary/10"
                        }`}
                      >
                        <span className="text-base md:text-lg font-bold">
                          {date.getDate()}
                        </span>
                        <span className="text-[8px] uppercase tracking-wide">
                          {todayFlag
                            ? "Hoje"
                            : MONTH_NAMES[date.getMonth()].substring(0, 3)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passo 2: Horários */}
              <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-primary/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm">
                      2
                    </span>
                    <h3 className="text-lg font-bold text-primary">
                      Escolha o Horário
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest hidden sm:block">
                    {formatDateLong(selectedDate)}
                  </span>
                </div>

                <div className="space-y-6">
                  {renderSlotGroup("Manhã", "sunny", morningSlots)}
                  {renderSlotGroup("Tarde", "wb_twilight", afternoonSlots)}
                  {renderSlotGroup("Noite", "dark_mode", nightSlots)}
                </div>
              </div>
            </div>

            {/* Sidebar Resumo */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-primary text-white rounded-2xl overflow-hidden shadow-2xl">
                <div
                  className="relative h-36 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDu9ky3MZRnTJrcmNjRX-sfsrlU6Pfhp8Ov0mDBN0oz6lngPxPwuctpNlBxy8iPw-dCa0ZiV_9GH6gyVDyKKXnx-wtkFoYoIixMBNeXnb2mHwBB_1a3XAIibf6nK1kepelPuY2ncn09mhhPTb1KOSqVDsfiAlSrmVXMBCimbhuGoyMJNGZSX3FssCHZ9xfbIO4YVQxksU5wux6-fFmEXNtqHgq4JcAC49uH3R4OoBHL1J0lZaNelA5LfDed06XjXIVTfkaDRvjuAlg')`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-6">
                    <span className="inline-block px-2 py-1 bg-secondary-container text-primary text-[10px] font-bold uppercase tracking-widest rounded mb-1">
                      Resumo
                    </span>
                    <h3 className="text-lg font-bold leading-tight">
                      Sua Reserva
                    </h3>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                          calendar_today
                        </span>
                        Data
                      </span>
                      <span className="font-bold">
                        {formatDateLong(selectedDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                          schedule
                        </span>
                        Horário
                      </span>
                      <span className="font-bold">
                        {selectedSlot
                          ? `${selectedSlot.time} - ${selectedSlot.endTime}`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                          timer
                        </span>
                        Duração
                      </span>
                      <span className="font-bold">60 min</span>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-white/10">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                          Valor
                        </span>
                        <div className="text-3xl font-black text-secondary-container mt-1">
                          R$ 150,00
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedTime ? (
                    <a
                      href="/reservar"
                      className="w-full bg-secondary-container hover:brightness-110 text-primary font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-lg shadow-secondary-container/30"
                    >
                      <span>Confirmar Reserva</span>
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </a>
                  ) : (
                    <div className="w-full bg-white/10 text-white/40 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 cursor-not-allowed">
                      <span className="material-symbols-outlined text-lg">
                        touch_app
                      </span>
                      <span>Selecione data e horário</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 p-4 bg-secondary/10 rounded-xl flex items-start space-x-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                  info
                </span>
                <p className="text-xs text-primary/70 leading-relaxed">
                  Cancelamento grátis até 24h antes. Equipamentos podem ser
                  alugados na recepção.
                </p>
              </div>
            </aside>
          </motion.div>
        </div>
      </section>

      {/* Benefícios do Tênis - Curiosidades */}
      <section
        className="py-20 bg-surface-container-low overflow-hidden"
        id="detalhes"
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariants}
            className="mb-14 text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-secondary-container text-primary font-bold text-xs tracking-widest uppercase rounded-full mb-4">
              Você Sabia?
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tighter mb-3 uppercase">
              Benefícios do Tênis
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Descubra como o tênis pode transformar seu corpo, mente e vida
              social.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInVariants}
                className="relative group rounded-2xl p-7 bg-white dark:bg-white/5 border border-primary/5 shadow-md shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${benefit.bgGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <span className="material-symbols-outlined text-white text-2xl">
                    {benefit.icon}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-primary tracking-tight mb-2">
                  {benefit.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {benefit.description}
                </p>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                ></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-surface-container-lowest" id="localizacao">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-16 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1 flex flex-col justify-center"
            >
              <h2 className="text-3xl md:text-4xl font-black text-primary mb-6">
                Onde a Paixão Encontra o Jogo
              </h2>
              <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
                Estamos estrategicamente localizados no bairro Urbanova,
                oferecendo um refúgio premium para esportistas que buscam
                qualidade e exclusividade.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">
                    location_on
                  </span>
                  <div>
                    <h4 className="font-bold text-primary">Endereço</h4>
                    <p className="text-on-surface-variant">
                      Av Jarbas Vaz de Lima, 1962 - Urbanova
                      <br />
                      São José dos Campos - SP, 12244-014
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">
                    schedule
                  </span>
                  <div>
                    <h4 className="font-bold text-primary">
                      Horário de Funcionamento
                    </h4>
                    <p className="text-on-surface-variant">
                      Segunda a Sábado: 06:00 - 23:00
                      <br />
                      Domingo: 07:00 - 20:00
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <a
                  className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-secondary pb-1 hover:text-secondary transition-colors"
                  href="#"
                >
                  Ver no Google Maps{" "}
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex-1 min-h-[400px] rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <img
                alt="Localização Tennis House Urbanova"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv9j9SrD7hmCKaB13UBO61BkHT1VVdCQ0VVylx3-63pU5ovKo9ouH8kOudpBTg1RcdUAnMmD6ggHfpXJQZ-w3uGaGuF3EXDNzYC1WzuZajedQO1QGNA8UZTz7BVojjq2bO5IOtmblUhuSo56jZf3yTjeeAKNvd3aRZiP9o9ozV9fBlUiCAFwjFFrKnnFV_TqDDxEPmLBNA7g0Iz8IAPIoLswqYAq8_muWgrHx7vwpg3FRx2QvIUE05-8Wc53aVbLkO8VfRJoQgo9g"
              />
              <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">
                    Ponto de Referência
                  </p>
                  <p className="text-primary font-bold">
                    Próximo ao Parque Ribeirão Vermelho
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">
                    directions_car
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-50 dark:bg-primary text-emerald-900 dark:text-emerald-100 font-['Inter'] text-sm leading-relaxed w-full py-10 border-t border-emerald-900/10 dark:border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-[1440px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-3">
                <img
                  alt="Tennis House Urbanova Logo"
                  className="h-8 w-auto rounded-lg"
                  src="/logo.jpeg"
                />
                <span className="font-['Manrope'] font-black text-primary dark:text-secondary text-xl">
                  Tennis House Urbanova
                </span>
              </div>
              <p className="opacity-60 text-center md:text-left">
                © 2026 Tennis House Urbanova. The Modern Heritage Club.
              </p>
            </div>
            <div className="flex gap-8">
              <a
                className="opacity-60 hover:opacity-100 transition-opacity hover:text-[#5b6300] dark:hover:text-[#dfec60]"
                href="#"
              >
                Termos de Uso
              </a>
              <a
                className="opacity-60 hover:opacity-100 transition-opacity hover:text-[#5b6300] dark:hover:text-[#dfec60]"
                href="#"
              >
                Privacidade
              </a>
              <a
                className="opacity-60 hover:opacity-100 transition-opacity hover:text-[#5b6300] dark:hover:text-[#dfec60]"
                href="#"
              >
                Contato
              </a>
            </div>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full bg-[#c3eccf] flex items-center justify-center hover:bg-secondary transition-colors text-primary"
                href="#"
              >
                <span className="material-symbols-outlined">share</span>
              </a>
              <a
                className="w-10 h-10 rounded-full bg-[#c3eccf] flex items-center justify-center hover:bg-secondary transition-colors text-primary"
                href="#"
              >
                <span className="material-symbols-outlined">
                  alternate_email
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
