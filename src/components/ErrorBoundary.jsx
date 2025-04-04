// ErrorBoundary.jsx
import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again.</h1>;
    }
    return this.props.children;
  }
}

// Wrap your components with it
<ErrorBoundary>
  <CategoryDetails />
</ErrorBoundary>