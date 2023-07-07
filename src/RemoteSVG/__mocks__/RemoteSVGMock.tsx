import React from 'react';
import { RemoteSVGProps } from '../RemoteSVG';

const RemoteSVGMock: React.FC<RemoteSVGProps> = ({ title, 'aria-label': ariaLabel, role, ...props }) => {
  const otherProps = Object.entries(props).map(([key, value]) => (
    <span key={key}>{`${key}: ${JSON.stringify(value)}`}</span>
  ));

  return (
    <span
      data-testid="mock-RemoteSVG"
      title={title}
      aria-label={ariaLabel}
      role={role}
    >
      {otherProps}
    </span>
  );
};

export default RemoteSVGMock;
