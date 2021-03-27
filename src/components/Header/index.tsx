import React from 'react';
import { Link } from 'react-router-dom';

import { FiArrowLeft, FiPower } from 'react-icons/fi';
import { Container, HeaderMeta } from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

interface HeaderProps {
  title: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, title, ...rest }) => {
  const { signOut } = useAuth();

  return (
    <Container {...rest}>
      <HeaderMeta>
        <Link to="/home">
          <FiArrowLeft size={20} />
        </Link>
        {children}
        <div>
          <img src={logoImg} alt="AGF" />
          <h2>
            OP<strong>MS</strong>
          </h2>
        </div>
        <FiPower size={20} onClick={signOut} />
      </HeaderMeta>
    </Container>
  );
};

export default Header;
