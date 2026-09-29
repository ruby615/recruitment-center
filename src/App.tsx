import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecruitmentCenter } from "./pages/RecruitmentCenter";
import { TaskDetail } from "./pages/TaskDetail";
import { CandidateProvider } from "./store";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "")

export default function App() {
  return (
    <CandidateProvider>
      <BrowserRouter basename={basename || undefined}>
        <div className="app">
          <div className="accent-bar" />
          <Routes>
            <Route path="/" element={<RecruitmentCenter />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CandidateProvider>
  );
}
