import PocketBase, { AsyncAuthStore } from "pocketbase";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PocketBaseContext = createContext<{ pb: PocketBase | undefined }>({ pb: undefined });

export const usePocketBase = () => useContext(PocketBaseContext);

export const PocketBaseProvider = ({ children }: { children: [] }) => {
	const [pb, setPb] = useState<PocketBase>();

	useEffect(() => {
		const initializePocketBase = async () => {
			const store = new AsyncAuthStore({
				save: async (serialized) => AsyncStorage.setItem('pb_auth', serialized),
				initial: await AsyncStorage.getItem('pb_auth') ?? undefined,
				clear: async () => AsyncStorage.removeItem('pb_auth')
			})

			const pbInstance = new PocketBase('http://127.0.0.1:8090', store);
			setPb(pbInstance);
		};

		initializePocketBase();
	}, [])

	return (
		<PocketBaseContext.Provider value={{ pb }}>
			{children}
		</PocketBaseContext.Provider>
	)

}
