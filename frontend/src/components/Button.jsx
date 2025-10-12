function Button({ children, onClick, otherClass }) {
    return (     
        <button
            onClick={onClick}
            className={`button ${otherClass}`}
        >
            {children}
        </button>
    );
}

export default Button;