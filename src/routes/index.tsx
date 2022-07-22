import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';

import Almoxarifado from '../pages/Almoxarifado';
import Menu from '../pages/Menu';
import Eletrica from '../pages/Eletrica';
import Montagem from '../pages/Montagem';
import Calderaria from '../pages/Calderaria';
import Pintura from '../pages/Pintura';
import Usinagem from '../pages/Usinagem';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" title="Login | OPms" exact component={SignIn} />
      <Route path="/menu" component={Menu} isPrivate />
      <Route
        path="/almoxarifado"
        component={Almoxarifado}
        title="Almoxarifado | OPms"
        isPrivate
      />
      <Route
        path="/calderaria"
        component={Calderaria}
        title="Calderaria | OPms"
        isPrivate
      />
      <Route
        path="/eletrica"
        component={Eletrica}
        title="Elétrica | OPms"
        isPrivate
      />
      <Route
        path="/montagem"
        component={Montagem}
        title="Montagem | OPms"
        isPrivate
      />
      <Route
        path="/pintura"
        component={Pintura}
        title="Pintura | OPms"
        isPrivate
      />
      <Route
        path="/usinagem"
        component={Usinagem}
        title="Usinagem | OPms"
        isPrivate
      />
    </Switch>
  );
};

export default Routes;
