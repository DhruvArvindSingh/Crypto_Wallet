import Home from './(tabs)/home';
import Portfolio from './(tabs)/portfolio';
import Market from './(tabs)/market';
import MainLayout from './(tabs)/_mainLayout';
import Profile from './(tabs)/profile';

export {
    Home,
    Portfolio,
    Market,
    Profile,
    MainLayout,
}

// Add default export
export default function Index() {
    return <Home />;
}
