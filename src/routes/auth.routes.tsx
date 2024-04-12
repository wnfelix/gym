import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { SignUp } from "@screens/SignUp";
import { Signin } from "@screens/Signin";

type AuthRoutes = {
	signIn: undefined;
	signUp: undefined;
};

export type AuthNatigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
	return (
		<Navigator screenOptions={{ headerShown: false }}>
			<Screen name="signIn" component={Signin} />
			<Screen name="signUp" component={SignUp} />
		</Navigator>
	);
}
