import { useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { usePocketBase } from "./pocketbase";


const AuthContext = createContext<{
	isInitialized?: boolean,
	isLoggedIn?: boolean,
	logIn?: (email: string, password: string) => Promise<{ user?: {} | null, error?: { message?: string | unknown } }>,
	logOut?: () => Promise<{ user?: {} | null, error?: { message?: string | unknown } }>,
	createAccount?: (email: string, password: string, passwordConfirm: string) => Promise<{ user?: {} | null, error?: { message?: string | unknown } }>,
	user?: object | null
}>({});

export function useAuth() {
	return useContext(AuthContext);
}

function useProtectedRoute(user: object | null, isInitialized: boolean) {
	const router = useRouter();
	const segments = useSegments();

	const [isNavigationReady, setIsNavigationReady] = useState(false);
	const rootNavRef = useNavigationContainerRef();

	useEffect(() => {
		const unsubscribe = rootNavRef?.addListener('state', (_event) => {
			setIsNavigationReady(true);
		})

		return function cleanup() {
			if (unsubscribe) {
				unsubscribe();
			}
		}
	}, [rootNavRef.current])

	useEffect(() => {
		if (!isNavigationReady || !isInitialized) {
			return;
		}

		const inAuthGroup = segments[0] === '(auth)';
		if (!user && !inAuthGroup) {
			router.replace("/(auth)/login")
		}
		if (user && inAuthGroup) {
			router.replace("/(main)/home")
		}

	}, [user, segments, isNavigationReady, isInitialized]);
}

export const AuthProvider = ({ children }: { children: [] }) => {
	const { pb } = usePocketBase();
	const [isInitialized, setIsInitialized] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<object | null>(null);

	useEffect(() => {
		const checkAuthStatus = async () => {
			if (pb) {
				const isLoggedIn = pb.authStore.isValid;
				setIsLoggedIn(isLoggedIn);
				setUser(isLoggedIn ? pb.authStore.record : null);
				setIsInitialized(true);
			}
		}

		checkAuthStatus();
	}, [pb])

	const appSignIn = async (email: string, password: string): Promise<{ user?: {} | null, error?: { message?: string | unknown } }> => {
		if (!pb) {
			return { error: { message: 'PocketBase not initialized' } };
		}

		try {
			const resp = await pb?.collection('users').authWithPassword(email, password);
			setUser(pb?.authStore.isValid ? pb.authStore.record : null)
			setIsLoggedIn(pb?.authStore.isValid ?? false)
			return { user: resp.record };
		} catch (e) {
			return { error: { message: e } }
		}
	};

	const appSignOut = async (): Promise<{ user?: {} | null, error?: { message?: string | unknown } }> => {
		if (!pb) {
			return { error: { message: 'PocketBase not initialized' } }
		}

		try {
			pb?.authStore.clear();
			setUser(null)
			setIsLoggedIn(false)
			return { user: null };
		} catch (e) {
			return { error: { message: e } }
		}
	};

	const createAccount = async (email: string, password: string, passwordConfirm: string): Promise<{ user?: {} | null, error?: { message?: string | unknown } }> => {
		if (!pb) {
			return { error: { message: 'PocketBase not initialized' } }
		}

		try {
			const resp = await pb.collection('users').create({
				email, password, passwordConfirm
			})
			return { user: resp };
		} catch (e) {
			return { error: { message: e } }
		}
	};

	useProtectedRoute(user, isInitialized);


	return (
		<AuthContext.Provider
			value={{
				logIn: (email: string, password: string) => appSignIn(email, password),
				logOut: () => appSignOut(),
				createAccount: (email: string, password: string, passwordConfirm: string) =>
					createAccount(email, password, passwordConfirm),
				isLoggedIn,
				isInitialized,
				user
			}}>
			{children}
		</AuthContext.Provider>
	);

}
