/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { 
  Dumbbell, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  History, 
  User as UserIcon,
  Plus,
  ArrowRight,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Settings,
  ArrowUp,
  ArrowDown,
  Check
} from 'lucide-react';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, auth } from './lib/firebase';
import { WORKOUTS, EXERCISE_ALTERNATIVES } from './constants';
import { 
  getLatestWeight, 
  saveWeight, 
  saveSession, 
  getUserProfile,
  getSessions,
  getCustomWorkouts,
  saveCustomWorkouts
} from './lib/firestoreUtils';

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false 
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent',
  className?: string,
  disabled?: boolean
}) => {
  const base = "px-6 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2 active:scale-95";
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800",
    secondary: "bg-zinc-100 text-black hover:bg-zinc-200",
    accent: "bg-[#CFE8E1] text-[#2C2C2E] hover:opacity-90",
    ghost: "bg-transparent text-zinc-500 hover:text-black hover:bg-zinc-50"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick, ...props }: { children: React.ReactNode, className?: string, onClick?: () => void, [key: string]: any }) => (
  <div 
    {...props}
    onClick={onClick}
    className={`bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] ${className} ${onClick ? 'cursor-pointer' : ''}`}
  >
    {children}
  </div>
);

// --- Pages ---

const LoginView = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name.trim());
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      const msg: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/operation-not-allowed': 'Email sign-in is not enabled. Please contact the admin.',
      };
      setError(msg[err.code] ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[#EAEAEA] bg-[#F5F5F7] text-black placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-black/10 text-sm";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
            <img src="/logo.png" alt="LUALU Gym" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-bold tracking-[-0.03em] mb-2">LUALU Gym</h1>
          <p className="text-[#8E8E93] text-base leading-relaxed">
            No Apologies. Train Savage. Tenacity. Energy. Ambition. Motion. Obsession.
          </p>
        </div>

        {!auth ? (
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-sm">
            <p className="font-semibold mb-1">Configuration Needed</p>
            Please complete the Firebase setup to enable authentication.
          </div>
        ) : (
          <>
            {/* Tab toggle */}
            <div className="flex bg-[#F5F5F7] rounded-full p-1 mb-6">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                    mode === m ? 'bg-white text-black shadow-sm' : 'text-[#8E8E93]'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Email/password form */}
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-3 mb-4">
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === 'signup'}
                      className={inputClass}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
              {error && (
                <p className="text-red-500 text-xs text-center">{error}</p>
              )}
              <Button disabled={loading} className="w-full py-3 mt-1">
                {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#EAEAEA]" />
              <span className="text-xs text-[#8E8E93]">or</span>
              <div className="flex-1 h-px bg-[#EAEAEA]" />
            </div>

            {/* Google */}
            <Button onClick={signInWithGoogle} variant="secondary" className="w-full py-3">
              Continue with Google
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};

interface CalendarHistoryViewProps {
  sessions: any[];
  formatSessionDate: (timestamp: any) => string;
}

const CalendarHistoryView: React.FC<CalendarHistoryViewProps> = ({ sessions, formatSessionDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDaySessions, setSelectedDaySessions] = useState<any[]>([]);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const adjustedFirstDayIndex = (firstDayIndex + 6) % 7;

  const sessionsByDate: Record<string, any[]> = {};
  sessions.forEach(session => {
    if (!session.date) return;
    const dateObj = session.date.toDate ? session.date.toDate() : new Date(session.date);
    const dayStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    if (!sessionsByDate[dayStr]) {
      sessionsByDate[dayStr] = [];
    }
    sessionsByDate[dayStr].push(session);
  });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number, dateStr: string, daySessions: any[]) => {
    setSelectedDaySessions(daySessions);
    const dateObj = new Date(year, month, day);
    setSelectedDateLabel(dateObj.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }));
  };

  const getAbbreviation = (name: string) => {
    if (!name) return "";
    const lower = name.toLowerCase();
    if (lower.includes("lower 1")) return "L1";
    if (lower.includes("upper 1")) return "U1";
    if (lower.includes("lower 2")) return "L2";
    if (lower.includes("upper 2")) return "U2";
    if (lower.includes("abs")) return "Abs";
    return name.slice(0, 3);
  };

  const getWorkoutColorClass = (abbr: string) => {
    switch (abbr) {
      case "L1":
      case "L2":
        return "bg-[#CFE8E1] text-[#2C2C2E]";
      case "U1":
      case "U2":
        return "bg-[#F5F5F7] text-zinc-800 border border-[#EAEAEA]";
      case "Abs":
        return "bg-[#2C2C2E] text-white";
      default:
        return "bg-[#F5F5F7] text-zinc-800";
    }
  };

  const dayCells = [];
  for (let i = 0; i < adjustedFirstDayIndex; i++) {
    dayCells.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const daySessions = sessionsByDate[dayStr] || [];
    const hasWorkouts = daySessions.length > 0;

    dayCells.push(
      <div 
        key={`day-${d}`} 
        onClick={() => handleDayClick(d, dayStr, daySessions)}
        className={`aspect-square p-1 flex flex-col justify-between border border-[#F5F5F7] rounded-xl transition-all cursor-pointer select-none active:scale-95 ${hasWorkouts ? 'bg-white hover:border-[#8E8E93]' : 'hover:bg-[#F5F5F7]'}`}
      >
        <div className="flex justify-between items-center w-full">
          <span className={`text-[11px] font-medium leading-none ${hasWorkouts ? 'text-black font-semibold' : 'text-[#8E8E93]'}`}>
            {d}
          </span>
          {hasWorkouts && (
            <span className="w-1.5 h-1.5 bg-[#CFE8E1] rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-auto overflow-hidden max-h-[18px]">
          {daySessions.map((s, idx) => {
            const abbr = getAbbreviation(s.workoutName);
            return (
              <span 
                key={idx} 
                className={`text-[8px] px-1 py-0.5 rounded-md font-bold text-center leading-none ${getWorkoutColorClass(abbr)}`}
                style={{ fontSize: '8px', transform: 'scale(0.9)' }}
              >
                {abbr}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-5 select-none overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-base font-semibold text-black leading-none">
            {monthNames[month]} {year}
          </h4>
          <div className="flex items-center gap-1">
            <button 
              onClick={prevMonth} 
              className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-[#F5F5F7] transition-colors focus:outline-none cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextMonth} 
              className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-[#F5F5F7] transition-colors focus:outline-none cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
            <span key={idx} className="text-[10px] font-semibold text-[#C7C7CC] uppercase tracking-wider py-1">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dayCells}
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {selectedDaySessions.length > 0 ? (
          <motion.div
            key={selectedDateLabel || 'empty'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-1">
              <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8E8E93]">
                {selectedDateLabel}
              </h4>
              <span className="text-[10px] font-medium text-black bg-[#F5F5F7] px-2 py-0.5 rounded-full">
                {selectedDaySessions.length} logged
              </span>
            </div>

            <div className="space-y-4">
              {selectedDaySessions.map((session, sIdx) => (
                <Card key={session.id || sIdx} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#2C2C2E] uppercase tracking-wider bg-[#CFE8E1] px-2.5 py-1 rounded-full">
                        {session.workoutName || 'Workout'}
                      </span>
                      <h5 className="text-lg font-bold mt-2">Logged Session Details</h5>
                    </div>
                    <span className="text-xs font-semibold text-[#8E8E93]">
                      {session.date ? formatSessionDate(session.date) : 'Recently'}
                    </span>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-[#F5F5F7]">
                    {session.exercises?.map((ex: any) => (
                      <div key={ex.exerciseId} className="flex justify-between items-center text-sm py-1">
                        <span className="font-medium text-[#2C2C2E]">{ex.exerciseName}</span>
                        <span className="font-mono text-xs font-bold text-black bg-[#F5F5F7] px-2.5 py-1 rounded-lg">
                          {ex.weight} kg × {ex.reps} reps
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-8 border rounded-2xl border-dashed border-[#EAEAEA] bg-white">
            <Calendar className="w-10 h-10 text-[#C7C7CC] mx-auto mb-3" />
            <p className="font-semibold text-zinc-900 text-sm mb-1">Select a formatted day</p>
            <p className="text-xs text-[#8E8E93] max-w-xs mx-auto">Click on any square with a green dot to view weight loads and completed targets.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface WeightProgressionChartProps {
  sessions: any[];
}

const WeightProgressionChart: React.FC<WeightProgressionChartProps> = ({ sessions }) => {
  const [selectedExId, setSelectedExId] = useState<string>('');

  // Extract exercises that have logged weights
  const uniqueExercisesMap: Record<string, {
    id: string;
    name: string;
    data: Array<{
      weight: number;
      reps: number;
      formattedDate: string;
      fullDate: string;
      rawDate: Date;
    }>;
  }> = {};

  // Sort sessions chronologically (oldest to newest)
  const sortedSessions = [...sessions].sort((a, b) => {
    const tA = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime();
    const tB = b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date).getTime();
    return tA - tB;
  });

  sortedSessions.forEach(session => {
    const d = session.date?.toDate ? session.date.toDate() : new Date(session.date);
    const formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const fullDate = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    session.exercises?.forEach((ex: any) => {
      if (!ex.exerciseId || !ex.exerciseName || ex.weight === undefined || ex.weight <= 0) return;
      
      if (!uniqueExercisesMap[ex.exerciseId]) {
        uniqueExercisesMap[ex.exerciseId] = {
          id: ex.exerciseId,
          name: ex.exerciseName,
          data: []
        };
      }
      
      uniqueExercisesMap[ex.exerciseId].data.push({
        weight: ex.weight,
        reps: ex.reps,
        formattedDate,
        fullDate,
        rawDate: d
      });
    });
  });

  const exerciseList = Object.values(uniqueExercisesMap).filter(ex => ex.data.length >= 1);

  useEffect(() => {
    if (exerciseList.length > 0 && (!selectedExId || !uniqueExercisesMap[selectedExId])) {
      setSelectedExId(exerciseList[0].id);
    }
  }, [sessions, exerciseList]);

  if (exerciseList.length === 0) {
    return null;
  }

  const selectedExercise = uniqueExercisesMap[selectedExId];
  const chartData = selectedExercise ? selectedExercise.data : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 text-white p-3 rounded-xl text-xs font-semibold shadow-xl border border-white/10 select-none">
          <p className="font-mono text-[9px] text-zinc-400 mb-0.5">{data.fullDate}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-[#CFE8E1]">{data.weight} kg</span>
            <span className="text-[10px] text-zinc-400 font-medium">({data.reps} reps)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h4 className="text-sm font-bold text-[#2C2C2E] uppercase tracking-wider">Weight Progression</h4>
          <p className="text-xs text-[#8E8E93] mt-0.5">Track your strength milestones over time.</p>
        </div>
        <div className="relative">
          <select
            value={selectedExId}
            onChange={(e) => setSelectedExId(e.target.value)}
            className="text-xs font-semibold text-black bg-white border border-[#EAEAEA] rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-black cursor-pointer appearance-none shadow-sm hover:border-[#8E8E93] transition-colors w-full sm:w-auto"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238E8E93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
              backgroundSize: "14px"
            }}
          >
            {exerciseList.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWeightProg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#CFE8E1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#CFE8E1" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F7" />
            <XAxis 
              dataKey="formattedDate" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              stroke="#8E8E93"
              dy={10}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              stroke="#8E8E93"
              domain={['dataMin - 2', 'dataMax + 2']}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#C7C7CC', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke="#1C3B32" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorWeightProg)" 
              activeDot={{ r: 5, strokeWidth: 0, fill: '#1C3B32' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

interface SettingsViewProps {
  user: any;
  initialWorkouts: any[];
  onSave: (updated: any[]) => Promise<void>;
  onCancel: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, initialWorkouts, onSave, onCancel }) => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialWorkouts) {
      setWorkouts(JSON.parse(JSON.stringify(initialWorkouts)));
    }
  }, [initialWorkouts]);

  // Find alternative set for any exercise ID
  const findAlternatives = (exerciseId: string) => {
    if (EXERCISE_ALTERNATIVES[exerciseId]) {
      return EXERCISE_ALTERNATIVES[exerciseId];
    }
    for (const key of Object.keys(EXERCISE_ALTERNATIVES)) {
      if (EXERCISE_ALTERNATIVES[key].some(alt => alt.id === exerciseId)) {
        return EXERCISE_ALTERNATIVES[key];
      }
    }
    return null;
  };

  const handleAlternativeChange = (workoutId: string, exIndex: number, newId: string) => {
    const currentWorkout = workouts.find(w => w.id === workoutId);
    if (!currentWorkout) return;
    const currentEx = currentWorkout.exercises[exIndex];
    if (!currentEx) return;

    const alts = findAlternatives(currentEx.id);
    if (!alts) return;
    const selectedAlt = alts.find(a => a.id === newId);
    if (!selectedAlt) return;

    setWorkouts(prev => prev.map(w => {
      if (w.id !== workoutId) return w;
      const updatedExercises = [...w.exercises];
      updatedExercises[exIndex] = {
        ...updatedExercises[exIndex],
        id: selectedAlt.id,
        name: selectedAlt.name
      };
      return {
        ...w,
        exercises: updatedExercises
      };
    }));
  };

  const moveExercise = (workoutId: string, fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0) return;

    setWorkouts(prev => prev.map(w => {
      if (w.id !== workoutId) return w;
      if (toIndex >= w.exercises.length) return w;
      
      const updatedExercises = [...w.exercises];
      const [moved] = updatedExercises.splice(fromIndex, 1);
      updatedExercises.splice(toIndex, 0, moved);

      return {
        ...w,
        exercises: updatedExercises
      };
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(workouts);
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto px-6 py-12">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={onCancel} className="p-2 -ml-2 text-[#8E8E93] hover:text-black transition-colors cursor-pointer rounded-full hover:bg-zinc-100">
          <ChevronLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Customize Workouts</h1>
          <p className="text-[#8E8E93] text-sm">Select alternative exercises or change their default training order.</p>
        </div>
      </header>

      <div className="space-y-6 mb-24">
        {workouts.map((workout) => {
          const isExpanded = expandedWorkoutId === workout.id;
          return (
            <Card key={workout.id} className="p-0 overflow-hidden">
              {/* Accordion Trigger */}
              <div 
                onClick={() => setExpandedWorkoutId(isExpanded ? null : workout.id)}
                className="p-6 flex justify-between items-center cursor-pointer select-none bg-white hover:bg-zinc-50 transition-colors"
              >
                <div>
                  <h4 className="text-lg font-bold">{workout.name}</h4>
                  <p className="text-sm text-[#8E8E93]">{workout.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#2C2C2E] bg-[#CFE8E1] px-2.5 py-1 rounded-full">
                    {workout.exercises.length} Exercises
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronDown size={18} className="text-[#8E8E93]" />
                  </motion.div>
                </div>
              </div>

              {/* Accordion Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[#F5F5F7] overflow-hidden bg-zinc-50/50"
                  >
                    <div className="p-6 space-y-4">
                      {workout.exercises.map((ex: any, idx: number) => {
                        const alts = findAlternatives(ex.id);
                        return (
                          <div 
                            key={ex.id || idx} 
                            className="bg-white rounded-2xl p-4 border border-[#F5F5F7] shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex items-center gap-3">
                              {/* Drag Handles / Position indicators */}
                              <div className="flex flex-col gap-1">
                                <button 
                                  disabled={idx === 0}
                                  onClick={() => moveExercise(workout.id, idx, 'up')}
                                  className={`p-1 rounded hover:bg-zinc-100 transition-colors cursor-pointer ${idx === 0 ? 'text-[#C7C7CC] hover:bg-transparent pointer-events-none' : 'text-[#8E8E93]'}`}
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button 
                                  disabled={idx === workout.exercises.length - 1}
                                  onClick={() => moveExercise(workout.id, idx, 'down')}
                                  className={`p-1 rounded hover:bg-zinc-100 transition-colors cursor-pointer ${idx === workout.exercises.length - 1 ? 'text-[#C7C7CC] hover:bg-transparent pointer-events-none' : 'text-[#8E8E93]'}`}
                                >
                                  <ArrowDown size={14} />
                                </button>
                              </div>

                              <div>
                                <h5 className="font-semibold text-sm text-[#2C2C2E] flex items-center gap-1.5">
                                  <span>{idx + 1}.</span>
                                  <span>{ex.name}</span>
                                </h5>
                                <p className="text-xs text-[#8E8E93] mt-0.5 font-medium">
                                  {ex.sets} Sets × {ex.reps} Reps
                                </p>
                              </div>
                            </div>

                            {/* Alternatives Swap Select dropdown */}
                            {alts && alts.length > 1 && (
                              <div className="flex items-center gap-2 pl-7 md:pl-0">
                                <span className="text-[10px] uppercase tracking-wider text-[#8E8E93] font-semibold">Swap:</span>
                                <select
                                  value={ex.id}
                                  onChange={(e) => handleAlternativeChange(workout.id, idx, e.target.value)}
                                  className="text-xs font-semibold text-black bg-white border border-[#EAEAEA] rounded-xl px-3 py-1.5 pr-8 focus:outline-none focus:border-black cursor-pointer appearance-none relative shadow-sm hover:border-[#8E8E93] transition-colors"
                                  style={{
                                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238E8E93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 8px center",
                                    backgroundSize: "14px"
                                  }}
                                >
                                  {alts.map((altOption) => (
                                    <option key={altOption.id} value={altOption.id}>
                                      {altOption.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Sticky footer actions */}
      <div className="fixed bottom-0 left-0 right-0 py-4 px-6 bg-white/80 backdrop-blur-md border-t border-[#F5F5F7] z-50">
        <div className="max-w-screen-sm mx-auto flex gap-4">
          <Button 
            onClick={onCancel} 
            variant="secondary" 
            className="flex-1 py-4 text-sm"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="primary" 
            className="flex-1 py-4 text-sm flex items-center justify-center gap-2"
            disabled={saving}
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check size={16} />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const HomeView = ({ 
  user, 
  workouts, 
  onSelectWorkout, 
  onGoToSettings 
}: { 
  user: any, 
  workouts: any[], 
  onSelectWorkout: (w: any) => void, 
  onGoToSettings: () => void 
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'workouts' | 'history' | 'analytics'>('workouts');
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setProfile);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setSessionsLoading(true);
      getSessions(user.uid)
        .then((data) => {
          setSessions(data);
        })
        .finally(() => {
          setSessionsLoading(false);
        });
    }
  }, [user]);

  const lastWorkout = workouts.find(w => w.id === profile?.lastWorkoutId);

  const formatSessionDate = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-screen-sm mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.1em] text-[#8E8E93] mb-1">Overview</h2>
          <h1 className="text-3xl font-bold tracking-tight">Hej, {user.displayName?.split(' ')[0]}</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onGoToSettings} 
            className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#2C2C2E] hover:text-black transition-colors focus:outline-none select-none cursor-pointer"
            title="Workout Settings"
          >
            <Settings size={18} />
          </button>
          <button 
            onClick={() => auth.signOut()} 
            className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#2C2C2E] hover:text-black transition-colors focus:outline-none select-none cursor-pointer"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Minimal Modern Tab Control */}
      <div className="flex gap-8 border-b border-[#EAEAEA] pb-4 mb-8">
        <button 
          onClick={() => setActiveTab('workouts')} 
          className={`pb-2 text-sm font-medium relative focus:outline-none cursor-pointer ${activeTab === 'workouts' ? 'text-black font-semibold' : 'text-[#8E8E93] hover:text-black transition-colors'}`}
        >
          Workouts
          {activeTab === 'workouts' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`pb-2 text-sm font-medium relative focus:outline-none cursor-pointer ${activeTab === 'history' ? 'text-black font-semibold' : 'text-[#8E8E93] hover:text-black transition-colors'}`}
        >
          History
          {activeTab === 'history' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`pb-2 text-sm font-medium relative focus:outline-none cursor-pointer ${activeTab === 'analytics' ? 'text-black font-semibold' : 'text-[#8E8E93] hover:text-black transition-colors'}`}
        >
          Progression
          {activeTab === 'analytics' && (
            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'workouts' && (
          <motion.div
            key="workouts-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            {profile?.lastWorkoutId && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#C7C7CC] mb-4">Last Trained</h3>
                <Card className="border-l-4 border-l-[#CFE8E1] hover:border-black/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xl font-bold mb-1">{lastWorkout?.name || 'Previous Session'}</h4>
                      <p className="text-sm text-[#8E8E93]">{lastWorkout?.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#C7C7CC] uppercase tracking-wider">Completed</p>
                      <p className="text-sm font-medium">
                        {profile.lastWorkoutDate?.toDate ? profile.lastWorkoutDate.toDate().toLocaleDateString() : new Date(profile.lastWorkoutDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#C7C7CC]">Choose Path</h3>
              </div>
              <div className="grid gap-4">
                {workouts.map((workout) => (
                  <Card key={workout.id} onClick={() => onSelectWorkout(workout)} className="hover:border-black transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold">{workout.name}</h4>
                        <p className="text-sm text-[#8E8E93]">{workout.subtitle}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                        <Plus size={16} className="text-black" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#C7C7CC]">Training History</h3>
            </div>
 
            {sessionsLoading ? (
              <div className="text-center py-12 text-sm text-[#8E8E93]">Retrieving entries...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-16 border rounded-2xl border-dashed border-[#EAEAEA] bg-white">
                <Calendar className="w-12 h-12 text-[#C7C7CC] mx-auto mb-4" />
                <p className="font-semibold text-zinc-900 mb-1">No completed sessions logged</p>
                <p className="text-sm text-[#8E8E93] max-w-xs mx-auto">Pick a workout on the Workouts tab to begin recording your progression.</p>
                <Button onClick={() => setActiveTab('workouts')} variant="secondary" className="mt-6 mx-auto">
                  View Workouts
                </Button>
              </div>
            ) : (
              <CalendarHistoryView sessions={sessions} formatSessionDate={formatSessionDate} />
            )}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#C7C7CC]">Strength Exploration</h3>
            </div>
            
            {sessionsLoading ? (
              <div className="text-center py-12 text-sm text-[#8E8E93]">Retrieving logs...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-16 border rounded-2xl border-dashed border-[#EAEAEA] bg-white">
                <Dumbbell className="w-12 h-12 text-[#C7C7CC] mx-auto mb-4" />
                <p className="font-semibold text-zinc-900 mb-1">No progression milestones yet</p>
                <p className="text-sm text-[#8E8E93] max-w-xs mx-auto">Log your first workout weights to see them charted automatically here.</p>
                <Button onClick={() => setActiveTab('workouts')} variant="secondary" className="mt-6 mx-auto">
                    View Workouts
                </Button>
              </div>
            ) : (
              <WeightProgressionChart sessions={sessions} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActiveWorkoutView = ({ user, workout, onComplete, onCancel }: { user: any, workout: any, onComplete: () => void, onCancel: () => void }) => {
  const [logs, setLogs] = useState<Record<string, { weight: number, reps: number }>>({});
  const [lastWeights, setLastWeights] = useState<Record<string, { weight: number, reps: number }>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLastWeights = async () => {
      const data: any = {};
      for (const ex of workout.exercises) {
        const last = await getLatestWeight(user.uid, ex.id);
        if (last) {
          data[ex.id] = { weight: last.weight, reps: last.reps };
        }
      }
      setLastWeights(data);
    };
    fetchLastWeights();
  }, [user.uid, workout]);

  const updateLog = (exId: string, field: 'weight' | 'reps', value: string) => {
    const num = parseFloat(value);
    setLogs(prev => ({
      ...prev,
      [exId]: {
        ...(prev[exId] || { weight: lastWeights[exId]?.weight || 0, reps: lastWeights[exId]?.reps || 0 }),
        [field]: isNaN(num) ? 0 : num
      }
    }));
  };

  const handleFinish = async () => {
    setSaving(true);
    const exercisesLog = workout.exercises.map((ex: any) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      weight: logs[ex.id]?.weight !== undefined ? logs[ex.id]?.weight : (lastWeights[ex.id]?.weight || 0),
      reps: logs[ex.id]?.reps !== undefined ? logs[ex.id]?.reps : (lastWeights[ex.id]?.reps || 0)
    }));

    try {
      await saveSession(user.uid, {
        workoutId: workout.id,
        workoutName: workout.name,
        userName: user.displayName,
        exercises: exercisesLog
      });

      // Update individuals weights for future sessions
      for (const log of exercisesLog) {
        if (log.weight > 0) {
          await saveWeight(user.uid, log.exerciseId, log.weight, log.reps);
        }
      }

      onComplete();
    } catch (e) {
      console.error(e);
      alert("Failed to save session. Check rules.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto px-6 py-12">
      <header className="flex items-center gap-4 mb-12">
        <button onClick={onCancel} className="p-2 -ml-2 text-[#8E8E93] hover:text-black">
          <ChevronLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{workout.name}</h1>
          <p className="text-[#8E8E93] text-sm">{workout.subtitle}</p>
        </div>
      </header>

      <div className="space-y-8 mb-12">
        {workout.exercises.map((ex: any) => (
          <div key={ex.id} className="space-y-3">
            <div className="flex justify-between items-end">
              <h4 className="font-semibold text-lg">{ex.name}</h4>
              <span className="text-xs font-bold text-[#C7C7CC] uppercase tracking-wider">{ex.sets} Sets × {ex.reps} Reps</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F5F5F7] rounded-2xl p-4">
                <label className="text-[10px] uppercase tracking-widest text-[#8E8E93] block mb-1">Weight (kg)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    step="0.5"
                    className="bg-transparent text-xl font-bold w-full outline-none"
                    placeholder={lastWeights[ex.id]?.weight?.toString() || "0"}
                    value={logs[ex.id]?.weight || ''}
                    onChange={(e) => updateLog(ex.id, 'weight', e.target.value)}
                  />
                  {lastWeights[ex.id] && (
                    <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-[#8E8E93]">Last: {lastWeights[ex.id].weight}</span>
                  )}
                </div>
              </div>
              <div className="bg-[#F5F5F7] rounded-2xl p-4">
                <label className="text-[10px] uppercase tracking-widest text-[#8E8E93] block mb-1">Reps</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    className="bg-transparent text-xl font-bold w-full outline-none"
                    placeholder={lastWeights[ex.id]?.reps?.toString() || "0"}
                    value={logs[ex.id]?.reps || ''}
                    onChange={(e) => updateLog(ex.id, 'reps', e.target.value)}
                  />
                  {lastWeights[ex.id] && (
                    <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-[#8E8E93]">Last: {lastWeights[ex.id].reps}</span>
                  )}
                </div>
              </div>
            </div>
            {/* Suggested load helper if exercise was already performed before */}
            {lastWeights[ex.id] && (
              <div className="text-xs text-[#8E8E93] font-medium flex items-center gap-1.5 px-1 animate-fade-in">
                <Dumbbell size={12} className="text-[#333]" />
                <span>Suggested weight:</span>
                <span className="text-black font-semibold bg-[#CFE8E1] px-1.5 py-0.5 rounded">{lastWeights[ex.id].weight} kg</span>
                <span>for targets</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button 
        onClick={handleFinish} 
        disabled={saving} 
        variant="primary" 
        className="w-full py-5 text-lg shadow-xl"
      >
        {saving ? 'Saving...' : 'Complete Session'}
      </Button>
    </div>
  );
};

const SuccessView = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center"
    >
      <div className="w-24 h-24 bg-[#CFE8E1] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <CheckCircle2 className="w-12 h-12 text-[#2C2C2E]" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Godt jobbet!</h2>
      <p className="text-[#8E8E93] mb-12">Strength is built in the silence between sessions. See you next time.</p>
      <Button onClick={onBack} variant="secondary" className="px-12">
        Return Home
      </Button>
    </motion.div>
  </div>
);

// --- Main App ---

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'workout' | 'success' | 'settings'>('home');
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>(WORKOUTS);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setWorkoutsLoading(true);
      getCustomWorkouts(user.uid)
        .then((custom) => {
          if (custom && Array.isArray(custom)) {
            const nameUpdates: Record<string, string> = {
              "Walking Lunges": "Inner Thigh Abductors (close)",
              "Standing Face Pulls": "Outer Thigh Abductor (open)",
              "Flat DB Press": "Seated DB Press",
            };
            const migrated = custom.map((w: any) => ({
              ...w,
              exercises: w.exercises.map((ex: any) =>
                nameUpdates[ex.name] ? { ...ex, name: nameUpdates[ex.name] } : ex
              )
            }));
            setWorkouts(migrated);
          } else {
            setWorkouts(WORKOUTS);
          }
        })
        .finally(() => {
          setWorkoutsLoading(false);
        });
    }
  }, [user]);

  const handleSaveWorkouts = async (updated: any[]) => {
    if (user) {
      await saveCustomWorkouts(user.uid, updated);
      setWorkouts(updated);
      setCurrentView('home');
    }
  };

  if (loading) return null;

  if (!user) return <LoginView />;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#CFE8E1]">
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <HomeView 
              user={user} 
              workouts={workouts}
              onSelectWorkout={(w) => {
                setSelectedWorkout(w);
                setCurrentView('workout');
              }} 
              onGoToSettings={() => setCurrentView('settings')}
            />
          </motion.div>
        )}

        {currentView === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SettingsView 
              user={user}
              initialWorkouts={workouts}
              onSave={handleSaveWorkouts}
              onCancel={() => setCurrentView('home')}
            />
          </motion.div>
        )}

        {currentView === 'workout' && selectedWorkout && (
          <motion.div 
            key="workout"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ActiveWorkoutView 
              user={user}
              workout={selectedWorkout}
              onComplete={() => setCurrentView('success')}
              onCancel={() => setCurrentView('home')}
            />
          </motion.div>
        )}

        {currentView === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuccessView onBack={() => setCurrentView('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}

