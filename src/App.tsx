import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteShell } from './components/SiteShell';
import { HomePage } from './pages/HomePage';
import { PersonalityDetailPage } from './pages/PersonalityDetailPage';
import { PersonalitiesPage } from './pages/PersonalitiesPage';
import { QuizPage } from './pages/QuizPage';
import { ResultPage } from './pages/ResultPage';

function App() {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/personalities" element={<PersonalitiesPage />} />
        <Route path="/personalities/:code" element={<PersonalityDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
