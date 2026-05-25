"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const WHATSAPP_NUMBER = "5512981322748";
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

interface ReservationData {
  date: Date;
  time: string;
  endTime: string;
  price: number;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  notes: string;
}

function formatDateLong(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month}, ${year}`;
}

function parseLocalDate(value: string | null): Date {
  if (!value) {
    return new Date();
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getInitialReservation(): ReservationData {
  const fallback = {
    date: new Date(),
    time: "18:00",
    endTime: "19:00",
    price: 150,
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  const params = new URLSearchParams(window.location.search);

  return {
    date: parseLocalDate(params.get("date")),
    time: params.get("time") || fallback.time,
    endTime: params.get("endTime") || fallback.endTime,
    price: Number(params.get("price") || fallback.price),
  };
}

export default function ResumoPage() {
  const [reservation] = useState<ReservationData>(() =>
    getInitialReservation(),
  );
  const [customer, setCustomer] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    notes: "",
  });

  function handleCustomerChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = [
      `Olá, gostaria de fazer uma reserva no dia ${formatDateLong(reservation.date)} das ${reservation.time} às ${reservation.endTime}.`,
      "",
      `Nome: ${customer.name}`,
      `Email: ${customer.email}`,
      `Telefone: ${customer.phone}`,
      `WhatsApp: ${customer.whatsapp}`,
      customer.notes ? `Observações: ${customer.notes}` : null,
      "",
      `Valor total: ${formatCurrency(reservation.price)}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const formattedDate = formatDateLong(reservation.date);
  const formattedPrice = formatCurrency(reservation.price);

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col pb-24 md:pb-0">
      <Header />

      <main className="flex-grow pt-28 pb-12 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <header className="mb-10">
              <Link
                href="/reservar"
                className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 group"
              >
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
                <span className="font-semibold text-sm">
                  Voltar para seleção
                </span>
              </Link>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4 leading-tight">
                Finalize sua Reserva
              </h1>
              <p className="text-on-surface-variant text-lg max-w-2xl">
                Preencha seus dados para enviar a solicitação direto para o
                WhatsApp da Tennis House.
              </p>
            </header>

            <section className="bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-on-primary-fixed-variant"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    person
                  </span>
                </div>
                <h2 className="font-headline text-2xl font-bold text-primary">
                  Dados do Atleta
                </h2>
              </div>

              <form
                id="reservation-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label
                    className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant px-1"
                    htmlFor="name"
                  >
                    Nome completo
                  </label>
                  <input
                    required
                    className="w-full bg-surface-container border-none focus:ring-2 focus:ring-secondary-container/40 rounded-sm py-4 px-5 text-on-surface font-body transition-all"
                    id="name"
                    name="name"
                    value={customer.name}
                    onChange={handleCustomerChange}
                    placeholder="Digite seu nome"
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant px-1"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    required
                    className="w-full bg-surface-container border-none focus:ring-2 focus:ring-secondary-container/40 rounded-sm py-4 px-5 text-on-surface font-body transition-all"
                    id="email"
                    name="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    placeholder="voce@email.com"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant px-1"
                    htmlFor="phone"
                  >
                    Telefone
                  </label>
                  <input
                    required
                    className="w-full bg-surface-container border-none focus:ring-2 focus:ring-secondary-container/40 rounded-sm py-4 px-5 text-on-surface font-body transition-all"
                    id="phone"
                    name="phone"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    placeholder="(12) 99999-9999"
                    type="tel"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant px-1"
                    htmlFor="whatsapp"
                  >
                    WhatsApp
                  </label>
                  <input
                    required
                    className="w-full bg-surface-container border-none focus:ring-2 focus:ring-secondary-container/40 rounded-sm py-4 px-5 text-on-surface font-body transition-all"
                    id="whatsapp"
                    name="whatsapp"
                    value={customer.whatsapp}
                    onChange={handleCustomerChange}
                    placeholder="(12) 99999-9999"
                    type="tel"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label
                    className="font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant px-1"
                    htmlFor="notes"
                  >
                    Observações (opcional)
                  </label>
                  <textarea
                    className="w-full bg-surface-container border-none focus:ring-2 focus:ring-secondary-container/40 rounded-sm py-4 px-5 text-on-surface font-body transition-all"
                    id="notes"
                    name="notes"
                    value={customer.notes}
                    onChange={handleCustomerChange}
                    placeholder="Alguma solicitação especial?"
                    rows={3}
                  />
                </div>
              </form>
            </section>

            <div className="flex items-start gap-4 p-6 bg-secondary-container/20 rounded-xl border-l-4 border-secondary-container">
              <span
                className="material-symbols-outlined text-on-secondary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                info
              </span>
              <div>
                <h4 className="font-headline font-bold text-on-secondary-fixed mb-1">
                  Envio pelo WhatsApp
                </h4>
                <p className="text-on-secondary-fixed-variant text-sm leading-relaxed">
                  Ao clicar em enviar, abriremos uma conversa no WhatsApp com
                  todos os dados da reserva preenchidos.
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 sticky top-32">
            <div className="bg-primary text-white rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
              <div className="h-48 relative">
                <img
                  alt="Tennis Court"
                  className="w-full h-full object-cover opacity-60"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrZGzO7Dq36s8g92_aI2N5HqKw7iOnBiU777QTnw3D7s6Zg1rU0T5pFsnpdgs89vrm8Ipjmsx6YifK2-1m2-MtsNZo5sEnl99IEJNVvCuwAVc9gmRsefgyPCX53Dt6RDRmcYbDPsbJpSlWwI96oQQcBkL6fUpRuZ3qU-UANHgNbxNmB4rOeQ6odinF0wCKmSrTyy94yWBokwmb0xPfBjQ-p_EB4gVG6A3FU84_M4sv-7Gl4dPOlDDPZmiic9_1o4N3AobkA8ob34o"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-8">
                  <span className="inline-block px-3 py-1 bg-secondary-container text-primary font-label text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                    Resumo da Reserva
                  </span>
                  <h3 className="font-headline text-2xl font-bold">
                    Quadra Saibro Pro #1
                  </h3>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-on-primary-container">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary-container">
                        calendar_month
                      </span>
                      <span className="text-sm">Data</span>
                    </div>
                    <span className="font-semibold text-white text-right">
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-on-primary-container">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary-container">
                        schedule
                      </span>
                      <span className="text-sm">Horário</span>
                    </div>
                    <span className="font-semibold text-white">
                      {reservation.time} - {reservation.endTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-on-primary-container">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary-container">
                        pin_drop
                      </span>
                      <span className="text-sm">Localização</span>
                    </div>
                    <span className="font-semibold text-white text-right">
                      Próximo à Fazenda da Vovó
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-lg font-medium opacity-80">Total</span>
                    <span className="text-3xl font-headline font-extrabold text-secondary-container">
                      {formattedPrice}
                    </span>
                  </div>
                  <button
                    form="reservation-form"
                    type="submit"
                    className="w-full py-5 bg-secondary-container text-primary font-headline font-black text-lg rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-secondary-container/10 flex items-center justify-center gap-3 group"
                  >
                    <span
                      className="material-symbols-outlined group-hover:animate-bounce"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      send
                    </span>
                    Enviar Reserva no WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-on-surface-variant text-xs font-medium flex items-center justify-center gap-2">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              Reserva enviada para a Tennis House Urbanova
            </p>
          </aside>
        </div>
      </main>

      <footer className="w-full py-12 bg-emerald-50 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 border-t border-emerald-900/10 pt-12 max-w-[1440px] mx-auto">
          <div className="mb-6 md:mb-0">
            <span className="font-['Manrope'] font-black text-emerald-950 text-xl">
              Tennis House Urbanova.
            </span>
            <p className="font-['Inter'] text-sm leading-relaxed text-emerald-900 opacity-60 mt-1">
              2026 The Modern Heritage Club.
            </p>
          </div>
          <div className="flex gap-8">
            <a
              className="font-['Inter'] text-sm text-emerald-900 opacity-60 hover:opacity-100 transition-opacity"
              href="#"
            >
              Termos de Uso
            </a>
            <a
              className="font-['Inter'] text-sm text-emerald-900 opacity-60 hover:opacity-100 transition-opacity"
              href="#"
            >
              Privacidade
            </a>
            <a
              className="font-['Inter'] text-sm text-emerald-900 opacity-60 hover:opacity-100 transition-opacity"
              href="#"
            >
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
