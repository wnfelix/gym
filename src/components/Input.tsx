import {
	IInputProps as NativeInputProps,
	Input as NativeBaseInput,
	FormControl,
} from "native-base";

interface IInputProps extends NativeInputProps {
	errorMessage?: string;
}

export function Input({ errorMessage, isInvalid, ...props }: IInputProps) {
	const invalid = !!errorMessage || isInvalid;

	return (
		<FormControl isInvalid={invalid} mb={4}>
			<NativeBaseInput
				bg="gray.700"
				h={14}
				px={4}
				borderWidth={0}
				fontSize="md"
				color="white"
				fontFamily="body"
				placeholderTextColor="gray.300"
				isInvalid={invalid}
				_invalid={{
					borderWidth: 1,
					borderColor: "red.500",
				}}
				_focus={{
					bg: "gray.700",
					borderWidth: 1,
					borderColor: "green.500",
				}}
				{...props}
			/>
			<FormControl.ErrorMessage _text={{ color: "red.500" }}>
				{errorMessage}
			</FormControl.ErrorMessage>
		</FormControl>
	);
}
