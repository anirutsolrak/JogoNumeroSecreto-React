import React, { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import anime from 'animejs';

const FeedbackMessage = ({ mensagem, destacar }) => {
  const mensagemRef = useRef(null);
  const animacaoDestaqueRef = useRef(null);

  useEffect(() => {
    // Animação de fade-in (executada apenas uma vez quando a mensagem muda)
    anime({
      targets: mensagemRef.current,
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 500,
      easing: 'easeOutQuad',
    });
  }, [mensagem]);

  useEffect(() => {
    // Reinicia a animação de destaque a cada renderização
    if (animacaoDestaqueRef.current) {
      animacaoDestaqueRef.current.restart();
    } else {
      // Cria a animação se ela ainda não existir
      animacaoDestaqueRef.current = anime({
        targets: mensagemRef.current,
        opacity: [1, 0.5, 1],
        duration: 500,
        easing: 'easeInOutQuad',
        loop: 1,
      });
    }
  }); // Array de dependências vazio para executar a cada renderização

  return (
    <Typography
      variant="body1"
      align="center"
      gutterBottom
      className="feedback-message"
      ref={mensagemRef}
      sx={{
        color: destacar ? '#FFC107' : '#ffffff', // Cor de destaque
        marginBottom: '1rem', // Espaçamento inferior
      }}
    >
      {mensagem}
    </Typography>
  );
};

export default FeedbackMessage;