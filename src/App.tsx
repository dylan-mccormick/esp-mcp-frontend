import { BrowserRouter, Route, Routes } from "react-router/internal/react-server-client";

import Chat from "./pages/Chat";
import ConnectionManager from "./pages/ConnectionManager";
import PageNotFound from "./pages/PageNotFound";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Chat />}></Route>
                    <Route
                        path="/connections"
                        element={<ConnectionManager />}></Route>
                    <Route
                        path="/*"
                        element={<PageNotFound />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
