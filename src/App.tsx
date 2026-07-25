import { BrowserRouter, Route, Routes } from "react-router/internal/react-server-client";

import Chat from "./pages/Chat";
import ConnectionManager from "./pages/ConnectionManager";
import PageNotFound from "./pages/PageNotFound";
import MCPServerContextProvider from "./providers/MCPServerContextProvider";
import LLMContextProvider from "./providers/LLMContextProvider";
import NotificationContextProvider from "./providers/NotificationContextProvider";
import NotificationStack from "./components/NotificationStack";

const App = () => {
    return (
        <>
            <NotificationContextProvider>
                <LLMContextProvider>
                    <MCPServerContextProvider>
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
                        <NotificationStack />
                    </MCPServerContextProvider>
                </LLMContextProvider>
            </NotificationContextProvider>
        </>
    );
};

export default App;
