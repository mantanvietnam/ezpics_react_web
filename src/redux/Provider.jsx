'use client'
import { Provider } from "react-redux";
import { store } from "./store";
import { SessionProvider } from "next-auth/react";

function Providers({ children }) {
    return <Provider store={store}>
        <SessionProvider>
            {children}
        </SessionProvider>
    </Provider>;
}

export default Providers;