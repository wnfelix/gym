import { VStack, Image, Text, Center, Heading, ScrollView } from "native-base";
import { useNavigation } from "@react-navigation/native";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { AuthNatigatorRoutesProps } from "@routes/auth.routes";

export function Signin() {
	const navigator = useNavigation<AuthNatigatorRoutesProps>();

	function handleNewAccount() {
		navigator.navigate("signUp");
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
					<Input
						placeholder="E-mail"
						keyboardType="email-address"
						autoCapitalize="none"
					/>
					<Input placeholder="Senha" secureTextEntry />
					<Button title="Acessar" />
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
