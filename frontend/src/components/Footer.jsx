import NavigationButton from './NavigationButton';

function Footer() {
    return (
        <footer>
            <div className="container">
                    <NavigationButton
                    route={'/'} 
                    label={'Home'}
                />
                <NavigationButton
                    route={'/map'}
                    label={'PreskoSpots'}
                />
                <NavigationButton
                    route={'/settings'}
                    label={'Settings'}
                />
            </div>
        </footer>
    );
}

export default Footer;