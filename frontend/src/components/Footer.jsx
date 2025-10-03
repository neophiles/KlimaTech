import NavigationButton from './NavigationButton';

function Footer() {
    return (
        <footer>
            <NavigationButton
                route={'/'} 
                label={'Home'}
            />
            <NavigationButton
                route={'/heatmap'}
                label={'Map'}
            />
            <NavigationButton
                label={'Analysis'}
            />
            <NavigationButton
                label={'Settings'}
            />
        </footer>
    );
}

export default Footer;