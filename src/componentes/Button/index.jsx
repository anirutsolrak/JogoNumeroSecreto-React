import React from 'react';
import Button from '@mui/material/Button';
import anime from 'animejs';

const Botao = ({ children, onClick, ...otherProps }) => {
  const animarBotao = () => {
    anime({
      targets: '.botao-animar',
      scale: [1, 1.05, 1],
      duration: 100,
      easing: 'easeInOutQuad',
    });
  };

  return (
    <Button
      variant="contained"
      onClick={(e) => {
        animarBotao();
        if (onClick) {
          onClick(e);
        }
      }}
      className="botao-animar"
      sx={{
        fontFamily: 'Roboto',
        padding: '12px 24px',
      }}
      {...otherProps}
    >
      {children}
    </Button>
  );
};

export default Botao;