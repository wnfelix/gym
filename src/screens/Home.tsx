import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { Loading } from "@components/Loading";
import { ExcerciseDto } from "@dtos/ExerciseDto";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { VStack, HStack, FlatList, Heading, Text, useToast } from "native-base";
import { useCallback, useEffect, useState } from "react";

export function Home() {
	const toast = useToast();
	const navigator = useNavigation<AppNavigatorRoutesProps>();
	const [groups, setGroups] = useState<string[]>([]);
	const [groupSelected, setGroupSelected] = useState("costas");
	const [exercises, setExercises] = useState<ExcerciseDto[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchGroups();
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchExercisesByGroup();
		}, [groupSelected])
	);

	async function fetchGroups() {
		try {
			const { data } = await api.get("/groups");
			setGroups(data);
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError
				? error.message
				: "não foi possível carregar os grupos musculares";

			toast.show({ title, placement: "top", bgColor: "red.500" });
		}
	}

	async function fetchExercisesByGroup() {
		try {
			setIsLoading(true);

			const { data } = await api.get(`/exercises/bygroup/${groupSelected}`);
			setExercises(data);
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError
				? error.message
				: "não foi possível carregar os exercícios";

			toast.show({ title, placement: "top", bgColor: "red.500" });
		} finally {
			setIsLoading(false);
		}
	}

	function handleOpenExerciseDetails(exerciseId: string) {
		navigator.navigate("exercise", { exerciseId });
	}

	return (
		<VStack flex={1}>
			<HomeHeader />
			<FlatList
				data={groups}
				keyExtractor={item => item}
				renderItem={({ item }) => (
					<Group
						name={item}
						isActive={
							groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()
						}
						onPress={() => setGroupSelected(item)}
					/>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
				_contentContainerStyle={{ px: 8 }}
				my={10}
				maxHeight={10}
				minHeight={10}
			/>

			{isLoading ? (
				<Loading />
			) : (
				<VStack flex={1} px={8}>
					<HStack justifyContent="space-between" mb={5}>
						<Heading color="gray.200" fontSize="md" fontFamily="heading">
							Exercícios
						</Heading>
						<Text color="gray.200" fontSize="sm">
							{exercises.length}
						</Text>
					</HStack>
					<FlatList
						data={exercises}
						keyExtractor={item => item.id}
						renderItem={({ item }) => (
							<ExerciseCard
								data={item}
								onPress={() => handleOpenExerciseDetails(item.id)}
							/>
						)}
						showsVerticalScrollIndicator={false}
						_contentContainerStyle={{ paddingBottom: 20 }}
					/>
				</VStack>
			)}
		</VStack>
	);
}
