import "./index.css";
import { Toaster } from "sonner";
import { Login } from "./features/Login";
import { Counter } from "./features/Counter";
import { UsersTable } from "./features/Table";

function App() {
  return (
    <div className="h-screen bg-gray-100 w-full p-6 ">
      <Toaster position="top-right" closeButton richColors />

      <div className="grid grid-cols-2 gap-4 content-evenly">
        <Counter />
        <Login />
      </div>
      <div className="p-10 bg-gray-50 min-h-screen flex justify-center">
        <div className="w-full max-w-5xl">
          <UsersTable />
        </div>
      </div>
    </div>
  );
}

export default App;
