import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Howl } from 'howler';
import Botao from '../Button';
import FeedbackMessage from '../FeedbackMessage';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';

const JogoInterface = ({
  numeroSecreto,
  dificuldade,
  onDificuldadeChange,
  onVitoria,
}) => {
  const [palpite, setPalpite] = useState('');
  const [mensagem, setMensagem] = useState('Tente adivinhar o número!');
  const [tentativas, setTentativas] = useState(0);
  const [exibirPopupDificuldade, setExibirPopupDificuldade] = useState(false);
  const [exibirPopupVitoria, setExibirPopupVitoria] = useState(false);
  const [numeroSecretoAcertado, setNumeroSecretoAcertado] = useState(null);

  // Efeitos sonoros
  const somSucesso = new Howl({ src: '/sons/sucesso.mp3' });
  const somErro = new Howl({ src: '/sons/erro.mp3' });
  const somClique = new Howl({ src: '/sons/clique.mp3' });

  useEffect(() => {
    // Resetar o estado do jogo quando um novo jogo começar
    setPalpite('');
    setMensagem('Tente adivinhar o número!');
    setTentativas(0);
  }, [numeroSecreto]);

  useEffect(() => {
    // Exibir o popup quando a dificuldade mudar
    setExibirPopupDificuldade(true);
  }, [dificuldade]);

  const handleSubmit = (e) => {
    e.preventDefault();
    somClique.play();
    setTentativas((prevTentativas) => prevTentativas + 1);

    const palpiteNumero = parseInt(palpite, 10);

    if (isNaN(palpiteNumero)) {
      setMensagem('Digite um número válido.');
      somErro.play();
    } else if (palpiteNumero === numeroSecreto) {
      setMensagem('Parabéns! Você acertou!');
      somSucesso.play();
      setNumeroSecretoAcertado(numeroSecreto); // Salva o número secreto acertado
      setExibirPopupVitoria(true);
      onVitoria(tentativas);
    } else if (palpiteNumero < numeroSecreto) {
      setMensagem('O número secreto é maior.');
      somErro.play();
    } else {
      setMensagem('O número secreto é menor.');
      somErro.play();
    }
  };

  const obterIntervaloDificuldade = () => {
    switch (dificuldade) {
      case 'facil':
        return '1 e 10';
      case 'medio':
        return '1 e 100';
      case 'dificil':
        return '1 e 1000';
      default:
        return '1 e 100';
    }
  };

  const gerarMensagemCompartilhamento = () => {
    let mensagem = `Consegui adivinhar o número secreto em ${tentativas + 1} tentativas!`;

    if (dificuldade !== 'medio') {
      mensagem += ` (Dificuldade: ${dificuldade})`;
    }

    mensagem +=
      ' Jogue você também:';
   return mensagem;
  };

  return (
    <>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Jogo do Número Secreto!
      </Typography>

      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel component="legend">Dificuldade</FormLabel>
        <RadioGroup
          aria-label="dificuldade"
          name="dificuldade"
          value={dificuldade}
          onChange={onDificuldadeChange}
          row
        >
          <FormControlLabel value="facil" control={<Radio />} label="Fácil" />
          <FormControlLabel value="medio" control={<Radio />} label="Médio" />
          <FormControlLabel
            value="dificil"
            control={<Radio />}
            label="Difícil"
          />
        </RadioGroup>
      </FormControl>

      <Dialog
        open={exibirPopupDificuldade}
        onClose={() => setExibirPopupDificuldade(false)}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#121212', // Cor de fundo do Dialog
          },
          '& .MuiDialogTitle-root': {
            padding: '24px', // Padding do título
            color: '#FFC107', // Cor do título
          },
        }}
      >
        <DialogTitle>Nova Dificuldade Selecionada!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Agora você deve chutar um número entre{' '}
            {obterIntervaloDificuldade()}. Boa sorte!
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <FeedbackMessage mensagem={mensagem} />

      {/* Popup de Parabéns */}
      <Dialog
        open={exibirPopupVitoria}
        onClose={() => setExibirPopupVitoria(false)}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#121212', // Cor de fundo do Dialog
          },
          '& .MuiDialogTitle-root': {
            padding: '24px', // Padding do título
            color: '#FFC107', // Cor do título
          },
        }}
      >
        <DialogTitle>Parabéns!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você acertou! O número secreto era {numeroSecretoAcertado}.
          </DialogContentText>
          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: '16px' }}
          >
            Compartilhe com os amigos:
          </Typography>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            <FacebookShareButton
              url={`https://numero-secreto-react.vercel.app/`}
              quote={gerarMensagemCompartilhamento()}
            >
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>

            <TwitterShareButton
              url={`https://numero-secreto-react.vercel.app/`}
              title={gerarMensagemCompartilhamento()}
            >
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>

            <WhatsappShareButton
              url={`https://numero-secreto-react.vercel.app/`}
              title={gerarMensagemCompartilhamento()}
            >
              <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
          </div>
        </DialogContent>
        <DialogActions>
          <Botao
            onClick={(e) => {
              e.stopPropagation();
              setExibirPopupVitoria(false);
            }}
            autoFocus
          >
            Fechar
          </Botao>
        </DialogActions>
      </Dialog>

      <form onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Digite seu palpite"
          value={palpite}
          onChange={(e) => setPalpite(e.target.value)}
          margin="normal"
        />
        <Botao type="submit" fullWidth className="botao-animar">
          Chutar
        </Botao>
      </form>
    </>
  );
};

export default JogoInterface;
