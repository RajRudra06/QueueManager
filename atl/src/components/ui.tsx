import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "glass glass-hover p-6 rounded-3xl relative overflow-hidden group",
        className
      )}
      {...props}
    >
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      {children}
    </div>
  );
}

export function Button({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary' | 'ghost',
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
    secondary: "glass glass-hover text-white",
    ghost: "text-white/60 hover:text-white hover:bg-white/5"
  };

  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
