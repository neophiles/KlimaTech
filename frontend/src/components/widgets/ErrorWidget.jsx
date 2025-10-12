function ErrorWidget({ otherClass, children }) {
    return (
        <div className={`base-widget ${otherClass}`}>
            {children}
        </div>
    );
}

export default ErrorWidget;