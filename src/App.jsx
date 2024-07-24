import localforage from 'localforage';
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import JogoInterface from './componentes/JogoInterface';
import Estatisticas from './componentes/Estatisticas';
import { Howl } from 'howler';

const temaEscuro = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196F3', // Azul
    },
    secondary: {
      main: '#FFC107', // Amarelo
    },
    background: {
      default: '#121212', // Cinza escuro
    },
    text: {
      primary: '#ffffff', // Branco
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const gerarNumeroSecreto = (dificuldadeAtual) => {
    const limites = {
      facil: 10,
      medio: 100,
      dificil: 1000,
    };
    const limite = limites[dificuldadeAtual] || limites.medio;
    return Math.floor(Math.random() * limite) + 1;
  };

  const [numeroSecreto, setNumeroSecreto] = useState(() =>
    gerarNumeroSecreto('medio')
  );
  const [dificuldade, setDificuldade] = useState('medio');
  const [jogosJogados, setJogosJogados] = useState(0);
  const [vitorias, setVitorias] = useState(0);
  const [totalTentativas, setTotalTentativas] = useState(0);

  // Efeitos sonoros
  const somClique = new Howl({ src: '/sons/clique.mp3' });

  // Inicializar contexto de áudio após interação do usuário
  useEffect(() => {
    const iniciarContextoAudio = () => {
      new Howl({ src: ['/sons/clique.mp3'] }).once('load', () => {
        //somClique.play();
      });
      window.removeEventListener('click', iniciarContextoAudio);
    };

    window.addEventListener('click', iniciarContextoAudio);
    return () => {
      window.removeEventListener('click', iniciarContextoAudio);
    };
  }, []);

  // Carregar estatísticas do LocalStorage ao iniciar
  useEffect(() => {
    const carregarEstatisticas = async () => {
      const estatisticasSalvas = await localforage.getItem('estatisticas');
      if (estatisticasSalvas) {
        setJogosJogados(estatisticasSalvas.jogosJogados || 0);
        setVitorias(estatisticasSalvas.vitorias || 0);
        setTotalTentativas(estatisticasSalvas.totalTentativas || 0);
      }
    };
    carregarEstatisticas();
  }, []);

  // Salvar estatísticas no LocalStorage sempre que forem atualizadas
  useEffect(() => {
    const salvarEstatisticas = async () => {
      await localforage.setItem('estatisticas', {
        jogosJogados,
        vitorias,
        totalTentativas,
      });
    };
    salvarEstatisticas();
  }, [jogosJogados, vitorias, totalTentativas]);

  const handleDificuldadeChange = (event) => {
    setDificuldade(event.target.value);
    setNumeroSecreto(gerarNumeroSecreto(event.target.value));
  };

  const handleVitoria = (tentativasDaRodada) => {
    setVitorias((vitorias) => vitorias + 1);
    setTotalTentativas((totalTentativas) => totalTentativas + tentativasDaRodada);
  };

  const reiniciarJogo = () => {
    setNumeroSecreto(gerarNumeroSecreto(dificuldade));
    setJogosJogados((jogosJogados) => jogosJogados + 1);
  };

  const calcularMediaTentativas = () => {
    return jogosJogados > 0 ? totalTentativas / jogosJogados : 0;
  };

  return (
    <ThemeProvider theme={temaEscuro}>
      <CssBaseline />
      <Container maxWidth="sm">
        <JogoInterface
          numeroSecreto={numeroSecreto}
          dificuldade={dificuldade}
          onDificuldadeChange={handleDificuldadeChange}
          onVitoria={handleVitoria}
        />
        <Estatisticas
          jogosJogados={jogosJogados}
          vitorias={vitorias}
          mediaTentativas={calcularMediaTentativas()}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;