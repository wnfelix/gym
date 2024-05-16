import {
	VStack,
	Image,
	Text,
	Center,
	Heading,
	ScrollView,
	useToast,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { AuthNatigatorRoutesProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppError } from "@utils/AppError";
import { useState } from "react";

interface IFormDataProps {
	email: string;
	password: string;
}

const signUpSchema = yup.object({
	email: yup.string().required("Informe o email").email("Email inválido"),
	password: yup.string().required("Informe a senha"),
});

export function Signin() {
	const [isLoading, setIsLoading] = useState(false);
	const navigator = useNavigation<AuthNatigatorRoutesProps>();
	const { signIn } = useAuth();
	const toast = useToast();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormDataProps>({
		resolver: yupResolver(signUpSchema),
	});

	function handleNewAccount() {
		navigator.navigate("signUp");
	}

	async function handleSignIn(data: IFormDataProps) {
		try {
			setIsLoading(true);
			await signIn(data.email, data.password);
		} catch (error) {
			const isAppError = error instanceof AppError;

			const title = isAppError
				? error.message
				: "Não foi possível entrar, tente mais tarde";

			toast.show({ title: title, placement: "top", bgColor: "red.500" });
			setIsLoading(false);
		}
	}

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			showsVerticalScrollIndicator={false}
		>
			<VStack flex={1} bg="gray.700" px={10} pb={16}>
				<Image
					source={BackgroundImg}
					defaultSource={BackgroundImg}
					alt="pessoas treinando"
					resizeMode="contain"
					position="absolute"
				/>
				<Center my={24}>
					<LogoSvg />
					<Text color="gray.100" fontSize="sm">
						Treine sua mente e seu corpo
					</Text>
				</Center>
				<Center>
					<Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
						Acesse sua conta
					</Heading>
					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="E-mail"
								keyboardType="email-address"
								autoCapitalize="none"
								onChangeText={onChange}
								value={value}
								errorMessage={errors.email?.message}
							/>
						)}
					/>
					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Senha"
								secureTextEntry
								onChangeText={onChange}
								value={value}
								errorMessage={errors.password?.message}
							/>
						)}
					/>
					<Button
						title="Acessar"
						onPress={handleSubmit(handleSignIn)}
						isLoading={isLoading}
					/>
				</Center>
				<Center mt={24}>
					<Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
						Ainda não tenho acesso?
					</Text>
				</Center>
				<Button
					title="Criar conta"
					variant="outline"
					onPress={handleNewAccount}
				/>
			</VStack>
		</ScrollView>
	);
}
