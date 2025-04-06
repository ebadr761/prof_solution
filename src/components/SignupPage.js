import React from 'react';
import Header from './Header';
import Footer from './Footer';
import RegForm from './RegForm';

const SignupPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: '20px' }}>
        <RegForm />
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
