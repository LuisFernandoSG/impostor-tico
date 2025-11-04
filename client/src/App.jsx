import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.jsx';
import { GroupHostPage } from './pages/GroupHostPage.jsx';
import { ParticipantPage } from './pages/ParticipantPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-b from-pine-950 via-brand-900/40 to-pine-950 text-white">
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
      <header className="flex flex-col items-center gap-2 pb-6 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-white/70">Amigo secreto</span>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Navidad entre amigos</h1>
        <p className="text-sm text-white/75">Organiza, comparte deseos y mantén la sorpresa desde tu celular.</p>
      </header>
      <main className="flex flex-1 flex-col gap-6 pb-10">{children}</main>
      <footer className="pt-6 text-center text-xs text-white/60">
        Hecho con cariño navideño 🎄
      </footer>
    </div>
  </div>
);

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/grupos/:code" element={<GroupHostPage />} />
      <Route path="/grupos/:code/participantes/:participantId" element={<ParticipantPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  </Layout>
);

export default App;
