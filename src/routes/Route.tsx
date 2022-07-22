import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouterProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';
import Page from './Page';

interface RouterProps extends ReactDOMRouterProps {
  isPrivate?: boolean;
  component: React.ComponentType;
  title?: string;
}

/**
 * Private Routes Boolean Logic:
 * isPrivate/IsSigned
 * true/true = OK
 * true/false = redirect to login
 * false/true = redirect to dashboard
 * false/true = OK
 */

const Route: React.FC<RouterProps> = ({
  isPrivate = false,
  component: Component,
  title = 'OPms',
  ...rest
}) => {
  const { user } = useAuth();

  let redirectPath = '/menu';

  switch (user?.department) {
    case 'Elétrica':
      redirectPath = `/eletrica`;
      break;
    case 'Montagem':
      redirectPath = `/montagem`;
      break;
    case 'Calderaria':
      redirectPath = `/calderaria`;
      break;
    case 'Usinagem':
      redirectPath = `/usinagem`;
      break;
    case 'Pintura':
      redirectPath = `/pintura`;
      break;
    default:
      redirectPath = `/almoxarifado`;
  }

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Page title={title}>
            <Component />
          </Page>
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : redirectPath,
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
