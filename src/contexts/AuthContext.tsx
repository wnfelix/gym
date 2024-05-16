import { UserDto } from "@dtos/UserDto";
import { api } from "@services/api";
import {
	storageAuthTokenGet,
	storageAuthTokenRemove,
	storageAuthTokenSave,
} from "@storage/storageAuthToken";
import {
	storageUserGet,
	storageUserSave,
	storageUserRemove,
} from "@storage/storageUser";
import { createContext, useEffect, useState } from "react";

export type AuthContextDataProps = {
	user: UserDto;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	isLoadingUserStorageData: boolean;
	updateUserProfile: (userUpdated: UserDto) => Promise<void>;
};

const AuthContext = createContext<AuthContextDataProps>(
	{} as AuthContextDataProps
);
AuthContext.displayName = "Contexto com autenticação";

type AuthContextProviderProps = {
	children: React.ReactNode;
};
export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [user, setUser] = useState({} as UserDto);
	const [isLoadingUserStorageData, setIsLoadingUserStorage] = useState(true);

	async function userAndTokenUpdate(userData: UserDto, token: string) {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		setUser(userData);
	}

	async function storageUserAndTokenSave(userData: UserDto, token: string) {
		await storageUserSave(userData);
		await storageAuthTokenSave(token);
	}

	async function signIn(email: string, password: string) {
		const { data } = await api.post("/sessions", { email, password });
		try {
			if (data.user && data.token) {
				setIsLoadingUserStorage(true);

				await storageUserAndTokenSave(data.user, data.token);
				userAndTokenUpdate(data.user, data.token);
			}
		} catch (error) {
			throw error;
		} finally {
			setIsLoadingUserStorage(false);
		}
	}

	async function signOut() {
		try {
			setIsLoadingUserStorage(true);
			setUser({} as UserDto);
			await storageUserRemove();
			await storageAuthTokenRemove();
		} catch (error) {
			throw error;
		} finally {
			setIsLoadingUserStorage(false);
		}
	}

	async function updateUserProfile(userUpdated: UserDto) {
		try {
			setUser(userUpdated);
			await storageUserSave(userUpdated);
		} catch (error) {
			throw error;
		}
	}

	async function loadUserData() {
		try {
			setIsLoadingUserStorage(true);

			const userLogged = await storageUserGet();
			const token = await storageAuthTokenGet();

			if (token && userLogged) {
				userAndTokenUpdate(userLogged, token);
			}
		} catch (error) {
			throw error;
		} finally {
			setIsLoadingUserStorage(false);
		}
	}

	useEffect(() => {
		loadUserData();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				signIn,
				isLoadingUserStorageData,
				signOut,
				updateUserProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export { AuthContext };
