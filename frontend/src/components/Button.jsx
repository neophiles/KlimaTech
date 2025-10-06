function Button({ children, onClick }) {
    return (     
        <button
            onClick={() => onClick(true)}
            className="button"
            style={{
                
            }}
        >
            {children}
        </button>
    );
}

export default Button;