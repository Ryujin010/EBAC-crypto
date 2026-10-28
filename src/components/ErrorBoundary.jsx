import { Component } from 'react';

// Los error boundaries deben ser clases: no existe un hook equivalente

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error en la interfaz:', error, info.componentStack);
  }

  handleReset() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert" role="alert">
          <p>Algo salió mal al mostrar esta página.</p>
          <button type="button" className="btn" onClick={this.handleReset}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;