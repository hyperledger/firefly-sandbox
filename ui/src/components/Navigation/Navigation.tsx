import HomeIcon from '@mui/icons-material/Home';
import LaunchIcon from '@mui/icons-material/Launch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { default as React, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { FF_NAV_PATHS } from '../../constants/Navigation';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { MenuLogo } from '../Logos/MenuLogo';
import { NavItem } from './NavItem';

export const NAV_WIDTH = 225;

export const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const makeDrawerContents = (
    <>
      <NavItem
        name={t('dashboard')}
        icon={<HomeIcon />}
        action={() => navigate(FF_NAV_PATHS.homePath)}
        itemIsActive={pathname === `/${FF_NAV_PATHS.homePath}`}
        isRoot
      />
      <NavItem
        name={t('docs')}
        icon={<MenuBookIcon />}
        action={() => window.open(FF_NAV_PATHS.docsPath, '_blank')}
        itemIsActive={false}
        rightIcon={<LaunchIcon />}
        isRoot
      />
    </>
  );

  return (
    <>
      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: NAV_WIDTH,
            backgroundColor: 'background.paper',
          },
        }}
        color="primary"
        variant="permanent"
        anchor="left"
      >
        <MenuLogo />
        <List>
          <ListItem>
            <ListItemText></ListItemText>
          </ListItem>
          {makeDrawerContents}
        </List>
      </Drawer>
    </>
  );
};
