import { Routes, Route } from "react-router-dom";
import Resume from "./pages/Resume";
import AllProjects from "./pages/AllProject";

export default function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Resume />} />
        <Route path="/projects" element={<AllProjects />} />
      </Routes>
    
  );
}