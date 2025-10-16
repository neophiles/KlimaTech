import NavigationButton from './NavigationButton';

function Footer() {
    return (
        <footer>
            <NavigationButton
                route={'/'} 
                label={'Home'}
            />
            <NavigationButton
                route={'/map'}
                label={'PreskoSpots'}
            />
            <NavigationButton
                route={'/tips'}
                label={'InitTips'}
            />
            <NavigationButton
                route={'/settings'}
                label={'Settings'}
            />
        </footer>
    );
}

export default Footer;