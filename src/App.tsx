import { Navigate, Route, Routes } from "react-router-dom";
import StartView from "./views/StartView";
import NotFoundView from "./views/NotFoundView";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/start" />} />
      <Route path="/start" element={<StartView />} />

      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default App;
