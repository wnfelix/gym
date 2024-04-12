import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { VStack, HStack, FlatList, Heading, Text } from "native-base";
import { useState } from "react";

export function Home() {
	const [groups, setGroups] = useState([
		"costas",
		"ombros",
		"bíceps",
		"tríceps",
	]);
	const [groupSelected, setGroupSelected] = useState("costas");
	const [exercises, setExercises] = useState([
		"Puxada Frontal",
		"Remada Curvada",
		"Remada Unilateral",
		"Levantamento Terra",
	]);

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
			/>
			<VStack flex={1} px={8}>
				<HStack justifyContent="space-between" mb={5}>
					<Heading color="gray.200" fontSize="md">
						Exercícios
					</Heading>
					<Text color="gray.200" fontSize="sm">
						{exercises.length}
					</Text>
				</HStack>
				<FlatList
					data={exercises}
					keyExtractor={item => item}
					renderItem={({ item }) => <ExerciseCard />}
					showsVerticalScrollIndicator={false}
					_contentContainerStyle={{ paddingBottom: 20 }}
				/>
				<ExerciseCard />
			</VStack>
		</VStack>
	);
}
