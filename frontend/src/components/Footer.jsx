import { NavigationButton } from './NavigationButton';

export function Footer() {
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