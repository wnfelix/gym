import { HistoryCard } from "@components/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { ExcerciseDto } from "@dtos/ExerciseDto";
import { HistoryByDayDto } from "@dtos/HistoryByDayDto";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Heading, SectionList, VStack, Text, useToast } from "native-base";
import { useCallback, useState } from "react";

export function History() {
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(true);

	const [exercises, setExercises] = useState<HistoryByDayDto[]>([]);

	useFocusEffect(
		useCallback(() => {
			fetchHistory();
		}, [])
	);

	async function fetchHistory() {
		try {
			setIsLoading(true);
			const { data } = await api.get("/history");
			setExercises(data);
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError
				? error.message
				: "não foi possível carregar o histórico";

			toast.show({ title, placement: "top", bgColor: "red.500" });
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<VStack flex={1}>
			<ScreenHeader title="Histórico de Exercícios" />
			{isLoading ? (
				<Loading />
			) : (
				<SectionList
					sections={exercises}
					keyExtractor={item => item.id}
					renderItem={({ item }) => <HistoryCard data={item} />}
					renderSectionHeader={({ section }) => (
						<Heading
							color="gray.200"
							fontSize="md"
							mt={10}
							mb={3}
							fontFamily="heading"
						>
							{section.title}
						</Heading>
					)}
					px={8}
					contentContainerStyle={
						exercises.length === 0 && { flex: 1, justifyContent: "center" }
					}
					ListEmptyComponent={() => (
						<Text>
							Não há exercícios registrados ainda {"\n"} Vamos treinar
						</Text>
					)}
				/>
			)}
		</VStack>
	);
}
