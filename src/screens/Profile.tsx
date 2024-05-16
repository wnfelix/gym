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
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppError } from "@utils/AppError";
import defaultUserPhoto from "@assets/userPhotoDefault.png";

const PHOTO_SIZE = 33;

interface IFormDataProps {
	name: string;
	password: string;
	old_password: string;
	confirm_Password: string;
	email: string;
}

const profileSchema = yup.object({
	name: yup.string().required("Informe o nome"),
	password: yup
		.string()
		.min(6, "é obrigatório ter 6 dígitos")
		.nullable()
		.transform(value => (!!value ? value : null)),
	confirm_Password: yup
		.string()
		.oneOf([yup.ref("password")], "A confirmação de senha não confere")
		.nullable()
		.transform(value => (!!value ? value : null))
		.when("password", {
			is: (field: any) => field,
			then: schema =>
				schema
					.required("informe a confirmação da senha")
					.transform(value => (!!value ? value : null)),
		}),
});

export function Profile() {
	const [isUpdating, setIsUpdating] = useState(false);
	const [photoIsLoading, setPhotoIsLoading] = useState(false);
	const [userPhoto, setUserPhoto] = useState("https://github.com/wnfelix.png");
	const toast = useToast();

	const { user, updateUserProfile } = useAuth();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormDataProps>({
		defaultValues: {
			name: user.name,
			email: user.email,
		},
		resolver: yupResolver(profileSchema),
	});

	async function handleProfileUpdate(data: IFormDataProps) {
		try {
			setIsUpdating(true);
			await api.put("/users", data);
			await updateUserProfile({ ...user, name: data.name });

			toast.show({
				title: "Perfil atualizado com sucesso",
				placement: "top",
				bgColor: "green.500",
			});
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError
				? error.message
				: "não foi possível atualizar dados do perfil.";

			toast.show({ title, placement: "top", bgColor: "red.500" });
		} finally {
			setIsUpdating(false);
		}
	}

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

				const fileExtension = asset.uri.split(".").pop();
				const photoFile = {
					name: `${user.id}.${fileExtension}`.toLowerCase(),
					uri: asset.uri,
					type: `${asset.type}/${fileExtension}`,
				} as any;

				const userPhotoUploadForm = new FormData();
				userPhotoUploadForm.append("avatar", photoFile);

				console.log(userPhotoUploadForm);

				const avatarUpdatedResponse = await api.patch(
					"/users/avatar",
					userPhotoUploadForm,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);

				const userUpdated = user;
				userUpdated.avatar = avatarUpdatedResponse.data.avatar;
				updateUserProfile(userUpdated);

				toast.show({
					title: "Foto atualizada",
					placement: "top",
					bgColor: "green.500",
				});
			}
		} catch (error) {
			console.log(error);
			toast.show({
				title: "Ocorreu um erro ao tentar atualizar a foto",
				placement: "top",
				bgColor: "red.500",
			});
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
							source={
								user.avatar
									? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
									: defaultUserPhoto
							}
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
					<Controller
						control={control}
						name="name"
						render={({ field: { value, onChange } }) => (
							<Input
								placeholder="Nome"
								bg="gray.600"
								onChangeText={onChange}
								value={value}
								errorMessage={errors.name?.message}
							/>
						)}
					/>
					<Controller
						control={control}
						name="email"
						render={({ field: { value, onChange } }) => (
							<Input
								placeholder="E-mail"
								bg="gray.600"
								isDisabled
								onChangeText={onChange}
								value={value}
							/>
						)}
					/>
				</Center>
				<VStack px={10} mt={12} mb={9}>
					<Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading">
						Alterar senha
					</Heading>

					<Controller
						control={control}
						name="old_password"
						render={({ field: { onChange } }) => (
							<Input
								bg="gray.600"
								placeholder="Senha antiga"
								secureTextEntry
								onChangeText={onChange}
							/>
						)}
					/>

					<Controller
						control={control}
						name="password"
						render={({ field: { onChange } }) => (
							<Input
								bg="gray.600"
								placeholder="Nova Senha"
								secureTextEntry
								onChangeText={onChange}
								errorMessage={errors.password?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="confirm_Password"
						render={({ field: { onChange } }) => (
							<Input
								bg="gray.600"
								placeholder="Confirme nova senha"
								secureTextEntry
								onChangeText={onChange}
								errorMessage={errors.confirm_Password?.message}
							/>
						)}
					/>

					<Button
						title="Atualizar"
						mt={4}
						onPress={handleSubmit(handleProfileUpdate)}
						isLoading={isUpdating}
					/>
				</VStack>
			</ScrollView>
		</VStack>
	);
}
