"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import { motion } from "framer-motion";
import { Calendar, Clock, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [servicesRes, appointmentsRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/appointments"),
      ]);
      const [servicesData, appointmentsData] = await Promise.all([
        servicesRes.json(),
        appointmentsRes.json(),
      ]);
      setServices(servicesData);
      setAppointments(appointmentsData);
      setLoading(false);
    }
    if (session) fetchData();
  }, [session]);

  const bookAppointment = async (slotId: string) => {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId }),
    });
    if (res.ok) {
      // Refresh data
      const appointmentsRes = await fetch("/api/appointments");
      const appointmentsData = await appointmentsRes.json();
      setAppointments(appointmentsData);
    } else {
      const data = await res.json();
      alert(data.error || "Booking failed");
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Student Dashboard</h1>
          <p className="text-white/50">Welcome back, {session?.user?.name || "Student"}</p>
        </div>
        <Button variant="ghost" onClick={() => signOut()} className="gap-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Appointments Section */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-semibold text-white/90 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Your Current Queues
          </h2>
          {appointments.length === 0 ? (
            <Card className="p-8 text-center text-white/40">
              No active appointments.
            </Card>
          ) : (
            appointments.map((apt: any) => (
              <Card key={apt.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{apt.slot.service.name}</h3>
                    <p className="text-sm text-white/50">
                      {new Date(apt.slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold ring-1 ring-indigo-500/30">
                    #{apt.queuePosition} in Queue
                  </div>
                </div>
                <div className="pt-2">
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                    apt.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"
                  )}>
                    {apt.status}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Services Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-white/90 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service: any) => (
              <Card key={service.id} className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">{service.name}</h3>
                  <p className="text-white/50 text-sm mt-2">{service.description}</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/30">Available Slots</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {service.slots.map((slot: any) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-white/30" />
                          <span className="text-sm font-medium">
                            {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <button 
                          onClick={() => bookAppointment(slot.id)}
                          className="px-4 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white text-xs font-bold transition-all"
                        >
                          Book Slot
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
