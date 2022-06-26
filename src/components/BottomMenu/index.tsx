import React from 'react';

import { Container, Title, Notification, Quantity } from './styles';

interface IBottomMenu {
  title: string;
  color: string;
  notification?: string;
}

const BottomMenu: React.FC<IBottomMenu> = ({ title, color, notification }) => {
  const noNotifications = notification === '0';

  return (
    <Container>
      <Title color={color}>{title}</Title>

      {notification && (
        <Notification notification={noNotifications}>
          <Quantity notification={noNotifications}>{notification}</Quantity>
        </Notification>
      )}
    </Container>
  );
};

export default BottomMenu;
