"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface Booking {
  id: string;
  date: string;
  status: string;
  value: number;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  timeSlot: {
    startTime: string;
    endTime: string;
  };
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  available: boolean;
}

interface CourtImage {
  id: string;
  url: string;
  title?: string;
  active: boolean;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"home" | "horarios" | "fotos">("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [images, setImages] = useState<CourtImage[]>([]);
  const [newImageTitle, setNewImageTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [savingSlotId, setSavingSlotId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      loadAdminData();
    }
  }, [status]);

  async function loadAdminData() {
    try {
      const [bookingsRes, slotsRes, imagesRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/time-slots"),
        fetch("/api/court-images"),
      ]);

      if (!bookingsRes.ok || !slotsRes.ok || !imagesRes.ok) {
        throw new Error("Falha ao carregar dados do painel");
      }

      const bookingsData = await bookingsRes.json();
      const slotsData = await slotsRes.json();
      const imagesData = await imagesRes.json();

      setBookings(bookingsData);
      setTimeSlots(slotsData);
      setImages(imagesData);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os dados do painel.");
    }
  }

  const totalRevenue = useMemo(
    () => bookings.reduce((sum, booking) => sum + booking.value, 0),
    [bookings],
  );

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return bookings.filter((booking) => new Date(booking.date) >= now).length;
  }, [bookings]);

  const currentMonthRevenue = useMemo(() => {
    const now = new Date();
    return bookings.reduce((sum, booking) => {
      const bookingDate = new Date(booking.date);
      if (
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear()
      ) {
        return sum + booking.value;
      }
      return sum;
    }, 0);
  }, [bookings]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin" });
  };

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error === "CredentialsSignin" ? "Email ou senha inválidos." : result.error);
      }

      setMessage("Login realizado com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no login.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveSlot(slot: TimeSlot) {
    setSavingSlotId(slot.id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/time-slots/${slot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: slot.price, available: slot.available }),
      });
      const updated = await response.json();
      if (!response.ok) {
        throw new Error(updated.error || "Falha ao atualizar horário.");
      }

      setTimeSlots((current) =>
        current.map((item) => (item.id === slot.id ? updated : item)),
      );
      setMessage("Horário atualizado com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar horário.");
    } finally {
      setSavingSlotId(null);
    }
  }

  async function handleAddImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!selectedFile) {
      setError("Selecione uma imagem do seu computador.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", newImageTitle);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Falha ao enviar imagem.");
      }

      setImages((current) => [data.image, ...current]);
      setSelectedFile(null);
      setNewImageTitle("");
      setMessage("Imagem enviada e adicionada com sucesso.");
      
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar imagem.");
    } finally {
      setIsUploading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-primary font-bold animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-surface-variant p-8">
          <h1 className="text-3xl font-extrabold text-primary mb-4">
            Admin Login
          </h1>
          <p className="text-sm text-on-surface-variant mb-8">
            Acesse o painel administrativo com segurança.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-surface-variant bg-surface-container-high px-4 py-3 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
                placeholder="admin@tennishouse.com"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                Senha
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-surface-variant bg-surface-container-high px-4 py-3 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
                placeholder="********"
                required
              />
            </label>

            {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
            {message ? (
              <p className="text-sm text-emerald-700 font-medium">{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Entrando..." : "Entrar com Segurança"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden">
      
      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-surface-variant transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:w-0 md:border-none md:overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-surface-variant h-[88px]">
          <h2 className="text-xl font-extrabold text-primary tracking-tight">Painel Admin</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => {
              setActiveTab("home");
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`w-full text-left rounded-2xl px-5 py-3 text-sm font-semibold transition flex items-center gap-3 ${
              activeTab === "home"
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="opacity-80">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Visão Geral
          </button>
          
          <button
            onClick={() => {
              setActiveTab("horarios");
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`w-full text-left rounded-2xl px-5 py-3 text-sm font-semibold transition flex items-center gap-3 ${
              activeTab === "horarios"
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="opacity-80">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Horários
          </button>

          <button
            onClick={() => {
              setActiveTab("fotos");
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`w-full text-left rounded-2xl px-5 py-3 text-sm font-semibold transition flex items-center gap-3 ${
              activeTab === "fotos"
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="opacity-80">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Galeria de Fotos
          </button>
        </nav>

        <div className="p-4 border-t border-surface-variant">
           <button
              onClick={handleLogout}
              className="w-full rounded-2xl bg-surface-variant/30 px-5 py-3 text-sm font-bold text-on-surface transition hover:bg-red-50 hover:text-red-700 flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-white border-b border-surface-variant shadow-sm z-10 flex-shrink-0 h-[88px] flex items-center px-6">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 -ml-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition"
              title="Alternar Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-secondary hidden sm:block">
                Administração
              </p>
              <h1 className="text-xl md:text-2xl font-extrabold text-primary">
                Bem-vindo, {session?.user?.name || "Admin"}
              </h1>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-3">
            <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-2 text-xs font-bold">
              {session?.user?.email}
            </span>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface">
          <div className="max-w-6xl mx-auto">
            
            {(error || message) && (
              <div className="mb-6 rounded-3xl border border-surface-variant bg-white p-6 shadow-sm">
                {error && <p className="text-sm text-red-600">{error}</p>}
                {message && <p className="text-sm text-emerald-700">{message}</p>}
              </div>
            )}

            {/* HOME TAB */}
            {activeTab === "home" && (
              <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
                <section className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-surface-variant">
                      <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                        Total de reservas
                      </span>
                      <p className="mt-4 text-4xl font-extrabold text-primary">
                        {bookings.length}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-surface-variant">
                      <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                        Faturamento mensal
                      </span>
                      <p className="mt-4 text-4xl font-extrabold text-primary">
                        R$ {currentMonthRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-surface-variant">
                      <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                        Próximas partidas
                      </span>
                      <p className="mt-4 text-4xl font-extrabold text-primary">
                        {upcomingCount}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-surface-variant">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-on-surface-variant">
                          Visão geral
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-primary">
                          Gestão de Reservas
                        </h2>
                      </div>
                      <span className="rounded-full bg-secondary/10 px-3 py-2 text-sm font-semibold text-secondary">
                        R$ {totalRevenue.toFixed(2)} no total
                      </span>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                        <thead>
                          <tr className="text-on-surface-variant">
                            <th className="pb-3 font-semibold px-4">Cliente</th>
                            <th className="pb-3 font-semibold px-4">Data</th>
                            <th className="pb-3 font-semibold px-4">Horário</th>
                            <th className="pb-3 font-semibold px-4">Valor</th>
                            <th className="pb-3 font-semibold px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr
                              key={booking.id}
                              className="rounded-3xl bg-surface-container-high border border-surface-variant"
                            >
                              <td className="px-4 py-4 font-semibold text-primary rounded-l-3xl">
                                {booking.client.name}
                              </td>
                              <td className="px-4 py-4 text-on-surface-variant">
                                {new Date(booking.date).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-4 text-on-surface-variant">
                                {booking.timeSlot.startTime} -{" "}
                                {booking.timeSlot.endTime}
                              </td>
                              <td className="px-4 py-4 font-semibold text-primary">
                                R$ {booking.value.toFixed(2)}
                              </td>
                              <td className="px-4 py-4 rounded-r-3xl">
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${booking.status === "confirmed" ? "bg-emerald-100 text-emerald-900" : booking.status === "pending" ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-900"}`}
                                >
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <aside className="space-y-6">
                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-surface-variant">
                    <p className="text-sm uppercase tracking-[0.3em] text-on-surface-variant flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Nota rápida
                    </p>
                    <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                      Use este painel para revisar reservas, atualizar horários,
                      editar preços e gerenciar as imagens da quadra.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-surface-variant">
                    <p className="text-sm uppercase tracking-[0.3em] text-on-surface-variant">
                      Resumo
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-on-surface-variant font-medium">
                      <div className="flex justify-between p-3 rounded-2xl bg-surface-container-high">
                        <span>Reservas</span>
                        <span className="text-primary font-bold">{bookings.length}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-2xl bg-surface-container-high">
                        <span>Horários cadastrados</span>
                        <span className="text-primary font-bold">{timeSlots.length}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-2xl bg-surface-container-high">
                        <span>Imagens na galeria</span>
                        <span className="text-primary font-bold">{images.length}</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}

            {/* HORÁRIOS TAB */}
            {activeTab === "horarios" && (
              <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-surface-variant">
                <h3 className="text-2xl font-bold text-primary">
                  Tabela de Horários
                </h3>
                <p className="text-sm text-on-surface-variant mt-1 mb-8">
                  Edite preço e disponibilidade por horário.
                </p>

                {/* Grid layout for Time Slots */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex flex-col justify-between rounded-3xl bg-surface-container-high p-5 border border-surface-variant shadow-sm hover:shadow-md transition"
                    >
                      <div className="mb-4 border-b border-surface-variant pb-4">
                        <p className="text-lg font-extrabold text-primary">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-widest">
                          Status: <span className={slot.available ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>{slot.available ? "Aberto" : "Fechado"}</span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-semibold text-on-surface-variant">Preço (R$)</label>
                        <input
                          type="number"
                          value={slot.price}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            setTimeSlots((current) =>
                              current.map((item) =>
                                item.id === slot.id
                                  ? { ...item, price: value }
                                  : item,
                              ),
                            );
                          }}
                          className="w-full rounded-xl border border-surface-variant bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-secondary-container outline-none"
                        />
                        
                        <label className="inline-flex items-center gap-2 text-sm font-medium mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={slot.available}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setTimeSlots((current) =>
                                current.map((item) =>
                                  item.id === slot.id
                                    ? { ...item, available: checked }
                                    : item,
                                ),
                              );
                            }}
                            className="h-5 w-5 rounded border-surface-variant text-primary focus:ring-primary cursor-pointer"
                          />
                          Quadra Disponível
                        </label>

                        <button
                          onClick={() => handleSaveSlot(slot)}
                          disabled={savingSlotId === slot.id}
                          className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-60"
                        >
                          {savingSlotId === slot.id ? "Salvando..." : "Salvar Alteração"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FOTOS TAB */}
            {activeTab === "fotos" && (
              <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-surface-variant">
                <h3 className="text-2xl font-bold text-primary">Galeria</h3>
                <p className="text-sm text-on-surface-variant mt-1 mb-8">
                  Gerencie as imagens que aparecem na quadra.
                </p>

                <form onSubmit={handleAddImage} className="mb-10 max-w-2xl bg-surface-container-high p-6 md:p-8 rounded-3xl border border-surface-variant">
                  <h4 className="font-bold text-primary mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Adicionar Nova Foto
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant">
                        Foto (do seu PC)
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          if (event.target.files && event.target.files.length > 0) {
                            setSelectedFile(event.target.files[0]);
                          }
                        }}
                        className="mt-2 w-full rounded-2xl border border-surface-variant bg-white px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90 file:cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant">
                        Título (opcional)
                      </label>
                      <input
                        type="text"
                        value={newImageTitle}
                        onChange={(event) => setNewImageTitle(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-surface-variant bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-secondary-container outline-none"
                        placeholder="Ex: Quadra central"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full sm:w-auto rounded-2xl bg-secondary px-8 py-3.5 text-sm font-bold text-primary transition hover:bg-secondary/90 disabled:opacity-60"
                    >
                      {isUploading ? "Enviando Imagem..." : "Fazer Upload"}
                    </button>
                  </div>
                </form>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-3xl border border-surface-variant bg-surface-container-high shadow-sm transition hover:shadow-md flex flex-col"
                    >
                      <img
                        src={image.url}
                        alt={image.title || "Imagem da quadra"}
                        className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <p className="font-bold text-primary line-clamp-2">
                          {image.title || "Sem título"}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${image.active ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-surface-variant text-on-surface-variant border border-gray-300'}`}>
                            {image.active ? "Visível" : "Oculta"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
