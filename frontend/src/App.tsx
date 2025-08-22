import { Routes, Route } from "react-router-dom";
import { myRoutes } from "./utils/routes";

export default function App() {
  return (
    <>
      <Routes>
        {myRoutes.map((route) => (
          <Route path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
}
