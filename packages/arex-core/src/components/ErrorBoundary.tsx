import { WarningOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorData?: {
    error: Error;
    errorInfo: ErrorInfo;
  };
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorData: undefined,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorData: { error, errorInfo } });
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { error, errorInfo } = this.state.errorData || {};
    if (this.state.hasError) {
      return (
        <Card>
          <Typography.Title level={5}>
            <WarningOutlined /> Uncaught error: {error?.message}
          </Typography.Title>
          <Typography.Paragraph type='secondary' ellipsis={{ rows: 6, expandable: true }}>
            {errorInfo?.componentStack}
          </Typography.Paragraph>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
