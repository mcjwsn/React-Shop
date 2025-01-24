import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Aktualizuj stan, aby następny render pokazał komunikat błędu.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Przechwyć błąd i zapisz informacje o nim.
        console.error('ErrorBoundary złapał błąd:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Możesz renderować dowolny interfejs zastępczy.
            return (
                <div>
                    <h1>Coś poszło nie tak.</h1>
                    <p>{this.state.error && this.state.error.toString()}</p>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        // Jeśli nie ma błędu, renderuj dzieci.
        return this.props.children;
    }
}

export default ErrorBoundary;