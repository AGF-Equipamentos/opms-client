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
import BaiaControl from '../pages/BaiaControl';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/menu" component={Menu} isPrivate />
      <Route path="/almoxarifado" component={Almoxarifado} isPrivate />
      <Route path="/calderaria" component={Calderaria} isPrivate />
      <Route path="/eletrica" component={Eletrica} isPrivate />
      <Route path="/montagem" component={Montagem} isPrivate />
      <Route path="/pintura" component={Pintura} isPrivate />
      <Route path="/usinagem" component={Usinagem} isPrivate />
      <Route path="/baiacontrol" component={BaiaControl} />
    </Switch>
  );
};

export default Routes;
