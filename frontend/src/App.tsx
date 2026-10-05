import { useEffect } from "react";
import { useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import type { RootState } from "./store/store";

function App() {
  const theme = useSelector(
    (state: RootState) => state.theme.theme
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <AppRoutes />;
}

export default App;