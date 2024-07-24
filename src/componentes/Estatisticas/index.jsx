import React from 'react';
import Typography from '@mui/material/Typography';

const Estatisticas = ({ jogosJogados, vitorias, mediaTentativas }) => {
  return (
    <>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Jogos Jogados: {jogosJogados}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Vitórias: {vitorias}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Média de Tentativas: {mediaTentativas.toFixed(2)}
      </Typography>
    </>
  );
};

export default Estatisticas;
