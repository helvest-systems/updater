import React from 'react';
import { Layout } from '../components/Layout';
import { Message } from '../components/Message';

export const Page: React.FC<{ message?: string }> = ({ message, children }) => (
  <Layout>
    <Message>{message}</Message>
    {children}
  </Layout>
);
