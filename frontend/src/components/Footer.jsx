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
                route={'/planner'}
                label={'Analysis'}
            />
            <NavigationButton
                route={'/settings'}
                label={'Settings'}
            />
        </footer>
    );
}

export default Footer;