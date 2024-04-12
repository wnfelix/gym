import { Image, IImageProps } from "native-base";

interface IUserPhotoProps extends IImageProps {
	size: number;
}

export function UserPhoto({ size, ...props }: IUserPhotoProps) {
	return (
		<Image
			w={size}
			h={size}
			rounded="full"
			borderWidth={2}
			borderColor="gray.400"
			{...props}
		/>
	);
}
