"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import { motion } from "framer-motion";
import { Settings, Users, ArrowRight, CheckCircle, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [servicesRes, appointmentsRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/appointments/admin"), // I need to create this API
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

  const advanceQueue = async (slotId: string) => {
    const res = await fetch("/api/appointments/advance", { // I need to create this API
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId }),
    });
    if (res.ok) {
      // Refresh
      const appointmentsRes = await fetch("/api/appointments/admin");
      const appointmentsData = await appointmentsRes.json();
      setAppointments(appointmentsData);
    }
  };

  if (loading) return <div className="text-white">Loading Admin Console...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-10 px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white text-gradient">Admin Console</h1>
          <p className="text-white/50">Manage lab services and monitor live queues.</p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Service Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-indigo-500/10 border-indigo-500/20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2">Total Services</h3>
            <div className="text-4xl font-bold">{services.length}</div>
          </Card>
          <Card className="p-6 bg-purple-500/10 border-purple-500/20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-2">Active Appointments</h3>
            <div className="text-4xl font-bold">{appointments.filter((a: any) => a.status === "PENDING").length}</div>
          </Card>
        </div>

        {/* Live Queue Control */}
        <div className="lg:col-span-3 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Live Queue Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service: any) => (
              <Card key={service.id} className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{service.name}</h3>
                    <p className="text-white/40 text-sm">{service.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {service.slots.map((slot: any) => {
                    const activeApt = (appointments as any[])
                      .filter((a: any) => a.slotId === slot.id && a.status === "PENDING")
                      .sort((a: any, b: any) => a.queuePosition - b.queuePosition)[0];

                    return (
                      <div key={slot.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white/40 uppercase">
                            Slot: {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-xs font-bold text-indigo-400">
                            {appointments.filter((a: any) => a.slotId === slot.id && a.status === "PENDING").length} Waiting
                          </span>
                        </div>
                        
                        {activeApt ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                                {activeApt.queuePosition}
                              </div>
                              <div className="text-sm">
                                <p className="font-bold text-white/90">{activeApt.user.name}</p>
                                <p className="text-[10px] text-white/40 uppercase">Current Turn</p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => advanceQueue(slot.id)}
                              className="px-4 py-2 rounded-xl h-fit text-sm bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white transition-all border border-green-500/20"
                            >
                              Complete
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="py-2 text-center text-xs text-white/20 italic">
                            Waiting for bookings...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
