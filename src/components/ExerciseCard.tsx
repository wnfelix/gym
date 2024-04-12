import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface IExerciseCardProps extends TouchableOpacityProps {}

export function ExerciseCard({ ...props }: IExerciseCardProps) {
	return (
		<TouchableOpacity {...props}>
			<HStack
				bg="gray.500"
				alignItems="center"
				p={2}
				pr={4}
				rounded="md"
				mb={3}
			>
				<Image
					source={{
						uri: "https://media.istockphoto.com/id/909416522/pt/foto/active-senior-man-having-strength-exercise-with-barbell-in-a-gym.jpg?s=1024x1024&w=is&k=20&c=2Vufa93Ojt4gfekTVsnbEc9v93S4xUUUMeUEY1wzY04=",
					}}
					alt="Imagem do exercício"
					w={16}
					h={16}
					rounded="md"
					mr={4}
					resizeMode="center"
				/>
				<VStack flex={1}>
					<Heading fontSize="lg" color="white">
						Remada Unilateral
					</Heading>
					<Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
						3 séries x 12 repetições
					</Text>
				</VStack>
				<Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
			</HStack>
		</TouchableOpacity>
	);
}
