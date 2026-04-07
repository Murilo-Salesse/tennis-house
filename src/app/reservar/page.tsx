"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from "@/components/Header";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
}

const MORNING_SLOTS: TimeSlot[] = [
  { time: "07:00", endTime: "08:00", available: true },
  { time: "08:00", endTime: "09:00", available: true },
  { time: "09:00", endTime: "10:00", available: false },
  { time: "10:00", endTime: "11:00", available: true },
  { time: "11:00", endTime: "12:00", available: true },
];

const AFTERNOON_SLOTS: TimeSlot[] = [
  { time: "14:00", endTime: "15:00", available: true },
  { time: "15:00", endTime: "16:00", available: true },
  { time: "16:00", endTime: "17:00", available: true },
  { time: "17:00", endTime: "18:00", available: true },
  { time: "18:00", endTime: "19:00", available: false },
  { time: "19:00", endTime: "20:00", available: true },
  { time: "20:00", endTime: "21:00", available: true },
];

function formatDateLong(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month}, ${year}`;
}

export default function ReservarPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate 28 days starting from today
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  // Calculate leading empty cells so the first day falls on the correct weekday
  const firstDayWeekday = calendarDays[0].getDay();

  const selectedSlot = selectedTime
    ? [...MORNING_SLOTS, ...AFTERNOON_SLOTS].find(s => s.time === selectedTime)
    : null;

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isSelected = (date: Date) =>
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      <Header />
      <main className="pt-28 pb-12 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Selection Canvas */}
          <div className="lg:col-span-8 space-y-10">
            <header>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-2">Agende seu horário</h1>
              <p className="text-on-surface-variant max-w-xl">Selecione uma data e escolha entre os horários disponíveis para sua partida na Tennis House.</p>
            </header>

            {/* Step 1: Calendar */}
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <span className="bg-secondary-container text-on-secondary-container w-8 h-8 flex items-center justify-center rounded-full font-bold">1</span>
                <h2 className="text-xl font-bold text-primary">Escolha a Data</h2>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {/* Calendar Header */}
                {WEEKDAY_LABELS.map((label) => (
                  <div key={label} className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-50 py-2">{label}</div>
                ))}

                {/* Leading empty cells */}
                {Array.from({ length: firstDayWeekday }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-12 md:h-16" />
                ))}

                {/* Calendar Days */}
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
                      className={`h-12 md:h-16 flex flex-col items-center justify-center rounded-lg transition-all duration-200 ${
                        selected
                          ? "bg-secondary-container text-on-secondary-container ring-2 ring-secondary-container ring-offset-2 scale-105"
                          : "bg-surface-container-high text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      <span className="text-lg font-bold">{date.getDate()}</span>
                      <span className="text-[8px] uppercase">
                        {todayFlag ? "Hoje" : MONTH_NAMES[date.getMonth()].substring(0, 3)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Time Slots */}
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="bg-secondary-container text-on-secondary-container w-8 h-8 flex items-center justify-center rounded-full font-bold">2</span>
                  <h2 className="text-xl font-bold text-primary">Horários Disponíveis</h2>
                </div>
                <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">Sessões de 60 min</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Morning */}
                <div className="col-span-full border-b border-surface-variant pb-2 mb-2">
                  <span className="text-sm font-bold text-on-surface-variant">Manhã</span>
                </div>
                {MORNING_SLOTS.map((slot) =>
                  !slot.available ? (
                    <div key={slot.time} className="p-4 rounded-xl bg-surface-container-high opacity-50 cursor-not-allowed">
                      <span className="block text-lg font-bold text-on-surface-variant/40">{slot.time}</span>
                      <span className="text-xs text-on-surface-variant/40 line-through">Reservado</span>
                    </div>
                  ) : (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`group p-4 rounded-xl text-left transition-all duration-200 ${
                        selectedTime === slot.time
                          ? "bg-primary text-white ring-4 ring-secondary-container/30"
                          : "border border-surface-variant hover:border-secondary-container"
                      }`}
                    >
                      <span className={`block text-lg font-bold ${selectedTime === slot.time ? "text-white" : "text-primary group-hover:text-on-secondary-container"}`}>
                        {slot.time}
                      </span>
                      <span className={`text-xs ${selectedTime === slot.time ? "text-secondary-container" : "text-on-surface-variant"}`}>
                        {selectedTime === slot.time ? "Selecionado" : "Disponível"}
                      </span>
                    </button>
                  )
                )}

                {/* Afternoon */}
                <div className="col-span-full border-b border-surface-variant pb-2 mt-4 mb-2">
                  <span className="text-sm font-bold text-on-surface-variant">Tarde / Noite</span>
                </div>
                {AFTERNOON_SLOTS.map((slot) =>
                  !slot.available ? (
                    <div key={slot.time} className="p-4 rounded-xl bg-surface-container-high opacity-50 cursor-not-allowed">
                      <span className="block text-lg font-bold text-on-surface-variant/40">{slot.time}</span>
                      <span className="text-xs text-on-surface-variant/40 line-through">Reservado</span>
                    </div>
                  ) : (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`group p-4 rounded-xl text-left transition-all duration-200 ${
                        selectedTime === slot.time
                          ? "bg-primary text-white ring-4 ring-secondary-container/30"
                          : "border border-surface-variant hover:border-secondary-container"
                      }`}
                    >
                      <span className={`block text-lg font-bold ${selectedTime === slot.time ? "text-white" : "text-primary group-hover:text-on-secondary-container"}`}>
                        {slot.time}
                      </span>
                      <span className={`text-xs ${selectedTime === slot.time ? "text-secondary-container" : "text-on-surface-variant"}`}>
                        {selectedTime === slot.time ? "Selecionado" : "Disponível"}
                      </span>
                    </button>
                  )
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-primary text-white rounded-xl overflow-hidden shadow-2xl">
              <div
                className="relative h-40 bg-cover bg-center"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDu9ky3MZRnTJrcmNjRX-sfsrlU6Pfhp8Ov0mDBN0oz6lngPxPwuctpNlBxy8iPw-dCa0ZiV_9GH6gyVDyKKXnx-wtkFoYoIixMBNeXnb2mHwBB_1a3XAIibf6nK1kepelPuY2ncn09mhhPTb1KOSqVDsfiAlSrmVXMBCimbhuGoyMJNGZSX3FssCHZ9xfbIO4YVQxksU5wux6-fFmEXNtqHgq4JcAC49uH3R4OoBHL1J0lZaNelA5LfDed06XjXIVTfkaDRvjuAlg')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <span className="inline-block px-2 py-1 bg-secondary-container text-primary text-[10px] font-bold uppercase tracking-widest rounded mb-1">Premium</span>
                  <h3 className="text-xl font-bold leading-tight">Quadra Central Clay</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-primary-container">Data Selecionada</span>
                    <span className="font-bold">{formatDateLong(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-primary-container">Horário</span>
                    <span className="font-bold">
                      {selectedSlot ? `${selectedSlot.time} - ${selectedSlot.endTime}` : "Selecione um horário"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-primary-container">Duração</span>
                    <span className="font-bold">60 Minutos</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-on-primary-container font-bold">Total a pagar</span>
                      <div className="text-3xl font-black text-secondary-container mt-1">R$ 120,00</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/50">*Taxas inclusas</span>
                    </div>
                  </div>
                </div>
                {selectedTime ? (
                  <Link href="/reservar/resumo" className="w-full bg-secondary-container hover:bg-[#c9d456] text-primary font-bold py-4 rounded-lg transition-all active:scale-95 flex items-center justify-center space-x-2">
                    <span>Próximo Passo</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                ) : (
                  <div className="w-full bg-white/10 text-white/40 font-bold py-4 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed">
                    <span>Selecione data e horário</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg flex items-start space-x-3">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-xs text-primary/80 leading-relaxed">Cancelamento grátis até 24h antes do horário agendado. Os equipamentos podem ser alugados separadamente na recepção.</p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-50 py-12 border-t border-emerald-900/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-[1440px] mx-auto space-y-6 md:space-y-0">
          <span className="font-['Manrope'] font-black text-emerald-950 text-xl">Tennis House.</span>
          <div className="flex space-x-8">
            <a className="font-['Inter'] text-sm text-emerald-900/60 hover:text-emerald-900 transition-opacity" href="#">Termos de Uso</a>
            <a className="font-['Inter'] text-sm text-emerald-900/60 hover:text-emerald-900 transition-opacity" href="#">Privacidade</a>
            <a className="font-['Inter'] text-sm text-emerald-900/60 hover:text-emerald-900 transition-opacity" href="#">Contato</a>
          </div>
          <p className="font-['Inter'] text-sm text-emerald-900/60">© 2026 Tennis House Urbanova. The Modern Heritage Club.</p>
        </div>
      </footer>
    </div>
  );
}
