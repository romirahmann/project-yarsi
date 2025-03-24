import { RouterProvider } from "@tanstack/react-router";
import { router } from "./components/routes/Routes";
import { ApiUrl } from "./context/Urlapi";

function App() {
  const baseUrl = "http://192.168.9.192:3001/api";
  // const baseUrl = "http://localhost:3000/api";
  return (
    <>
      <ApiUrl.Provider value={baseUrl}>
        <RouterProvider router={router} />
      </ApiUrl.Provider>
    </>
  );
}

export default App;
