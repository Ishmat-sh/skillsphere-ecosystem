import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { glassCard, btnPrimary, btnGhost } from '../../styles/dashboardStyles';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_SLOTS = ['09:00 - 12:00', '13:00 - 17:00', '18:00 - 21:00'];

export default function AvailabilityScheduler() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/freelancer/availability')
      .then((res) => {
        setAvailability(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleToggleSlot = (day, slot) => {
    setAvailability((prev) => {
      const dayIndex = prev.findIndex((d) => d.day === day);
      if (dayIndex === -1) {
        // Day not registered yet, add it with the slot
        return [...prev, { day, slots: [slot] }];
      }

      const next = [...prev];
      const slots = [...next[dayIndex].slots];
      const slotIndex = slots.indexOf(slot);
      if (slotIndex === -1) {
        slots.push(slot);
      } else {
        slots.splice(slotIndex, 1);
      }

      next[dayIndex] = { day, slots };
      return next;
    });
  };

  const handleSave = async () => {
    setMsg('');
    setError('');
    try {
      await api.patch('/api/freelancer/availability', { availability });
      setMsg('Availability saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError('Failed to save availability');
    }
  };

  const isSlotSelected = (day, slot) => {
    const dayData = availability.find((d) => d.day === day);
    return dayData ? dayData.slots.includes(slot) : false;
  };

  if (loading) {
    return (
      <div className={`${glassCard} p-5`}>
        <h3 className="text-white font-semibold mb-2">Availability Scheduler</h3>
        <p className="text-xs text-[#A2A2D0]/50">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className={`${glassCard} p-5 space-y-4`}>
      <div>
        <h3 className="text-white font-semibold">Weekly Availability</h3>
        <p className="text-[10px] text-[#A2A2D0]/60">Select the hours you are active for hyperlocal client bookings</p>
      </div>

      {msg && <p className="text-emerald-400 text-xs font-semibold">{msg}</p>}
      {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
        {DAYS.map((day) => (
          <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5 last:border-b-0 gap-2">
            <span className="text-xs font-medium text-white/95 w-24 shrink-0">{day}</span>
            <div className="flex flex-wrap gap-1.5 flex-1 justify-start">
              {DEFAULT_SLOTS.map((slot) => {
                const active = isSlotSelected(day, slot);
                return (
                  <button
                    key={slot}
                    onClick={() => handleToggleSlot(day, slot)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${active ? 'bg-[#7B61FF]/20 border-[#7B61FF] text-white' : 'border-white/5 bg-white/5 text-[#A2A2D0]/50 hover:bg-white/10'}`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className={`${btnPrimary} w-full mt-2`}>
        Save Availability Slots
      </button>
    </div>
  );
}
