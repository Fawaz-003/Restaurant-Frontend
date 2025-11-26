const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-slate-500 sm:flex-row sm:justify-between sm:text-left">
      <p>© {new Date().getFullYear()} Resto Marketplace. Crafted for demo use.</p>
      <p className="text-slate-400">
        Dummy data only • No live orders processed
      </p>
    </div>
  </footer>
);

export default Footer;

