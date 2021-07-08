import React from 'react';
import { Link } from 'react-router-dom';

import { FiArrowLeft, FiPower } from 'react-icons/fi';
import { Container, HeaderMeta } from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, ...rest }) => {
  const { signOut, user } = useAuth();

  return (
    <Container {...rest}>
      <HeaderMeta>
        {user.role === 'admin' ? (
          <Link to="/menu">
            <FiArrowLeft size={20} />
          </Link>
        ) : null}

        {children}
        <div>
          <img src={logoImg} alt="AGF" />
          <h2>
            OP<strong>MS</strong>
          </h2>
        </div>
        <button type="button" onClick={signOut}>
          <FiPower size={20} />
        </button>
      </HeaderMeta>
    </Container>
  );
};

export default Header;
