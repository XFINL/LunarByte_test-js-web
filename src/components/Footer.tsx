export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white font-bold text-xl tracking-wider">
            LUNARBYTE
          </div>
          <div className="text-white/50 text-sm">
            © 2024 LunarByte. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
