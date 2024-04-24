import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {
	Center,
	ScrollView,
	VStack,
	Skeleton,
	Text,
	Heading,
	useToast,
} from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const PHOTO_SIZE = 33;

export function Profile() {
	const [photoIsLoading, setPhotoIsLoading] = useState(false);
	const [userPhoto, setUserPhoto] = useState("https://github.com/wnfelix.png");
	const toast = useToast();

	async function handleUserPhotoSelect() {
		setPhotoIsLoading(true);

		try {
			const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
				aspect: [4, 4],
				allowsEditing: true,
			});

			if (!selectedPhoto.canceled) {
				const asset = selectedPhoto.assets[0];
				const photoInfo = await FileSystem.getInfoAsync(asset.uri);

				if (photoInfo.size && photoInfo.size / 1024 / 1024 > 1)
					return toast.show({
						title: "Essa imagem é muito grande, o limite é de 3mb.",
						placement: "top",
						bgColor: "red.500",
					});

				setUserPhoto(asset.uri);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setPhotoIsLoading(false);
		}
	}

	return (
		<VStack flex={1}>
			<ScreenHeader title="Perfil" />
			<ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
				<Center mt={6} px={10}>
					{photoIsLoading ? (
						<Skeleton
							w={PHOTO_SIZE}
							h={PHOTO_SIZE}
							rounded="full"
							startColor="gray.400"
							endColor="gray.300"
						/>
					) : (
						<UserPhoto
							source={{ uri: userPhoto }}
							size={PHOTO_SIZE}
							alt="Foto do usuário"
						/>
					)}
					<TouchableOpacity onPress={handleUserPhotoSelect}>
						<Text
							color="green.500"
							fontWeight="bold"
							fontSize="md"
							mt={2}
							mb={8}
						>
							Alterar Foto
						</Text>
					</TouchableOpacity>
					<Input placeholder="Nome" bg="gray.600" />
					<Input placeholder="E-mail" bg="gray.600" isDisabled />
				</Center>
				<VStack px={10} mt={12} mb={9}>
					<Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading">
						Alterar senha
					</Heading>
					<Input bg="gray.600" placeholder="Senha antiga" secureTextEntry />
					<Input bg="gray.600" placeholder="Nova Senha" secureTextEntry />
					<Input
						bg="gray.600"
						placeholder="Confirme nova senha"
						secureTextEntry
					/>
					<Button title="Atualizar" mt={4} />
				</VStack>
			</ScrollView>
		</VStack>
	);
}
