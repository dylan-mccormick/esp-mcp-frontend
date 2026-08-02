import { BrowserRouter, Route, Routes } from "react-router/internal/react-server-client";

import Chat from "./pages/Chat";
import ConnectionManager from "./pages/ConnectionManager";
import PageNotFound from "./pages/PageNotFound";
import ChatContextProvider from "./providers/ChatContextProvider";
import ComposeProviders from "./providers/ComposeProviders";
import LLMContextProvider from "./providers/LLMContextProvider";
import MCPServerContextProvider from "./providers/MCPServerContextProvider";
import NotificationContextProvider from "./providers/NotificationContextProvider";
import NotificationStack from "./components/NotificationStack";

const App = () => {
    return (
        <>
            <ComposeProviders
                providers={[
                    NotificationContextProvider,
                    LLMContextProvider,
                    MCPServerContextProvider,
                    ChatContextProvider
                ]}>
                <NotificationStack />
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
            </ComposeProviders>
        </>
    );
};

export default App;
