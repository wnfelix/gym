import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, SectionList, VStack, Text } from "native-base";
import { useState } from "react";

export function History() {
	const [exercises, setExercises] = useState([
		{
			title: "26.08.24",
			data: ["Puxada frontal", "Remada Lateral"],
		},
		{
			title: "27.08.24",
			data: ["Supino livre com barra", "Agachamento Livre"],
		},
	]);

	return (
		<VStack flex={1}>
			<ScreenHeader title="Histórico de Exercícios" />
			<SectionList
				sections={exercises}
				keyExtractor={item => item}
				renderItem={({ item }) => <HistoryCard />}
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
					<Text>Não há exercícios registrados ainda {"\n"} Vamos treinar</Text>
				)}
			/>
		</VStack>
	);
}
