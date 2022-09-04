import { useCallback, useEffect, useRef, useState } from "react";
import { etapas } from "./etapas";
import { useAudio } from "./hooks/useAudio";

interface IVoto {
  etapa: string;
  voto: string;
}

export const useUrna = (
  descricao: React.RefObject<HTMLDivElement>,
  lateral: React.RefObject<HTMLDivElement>,
  tela: React.RefObject<HTMLDivElement>,
  numeroRef: React.RefObject<HTMLDivElement>
) => {
  const numero = useRef<string>("");
  const etapaAtual = useRef<number>(0);
  //   const [numero, setNumero] = useState("");
  const [votoBranco, setVotoBranco] = useState(false);
  const [votos, setVotos] = useState<IVoto[]>([]);
  const [cargo, setCargo] = useState("VEREADOR");
  const [seuVotoParaStyle, setSeuVotoParaStyle] = useState({});
  const [avisoStyle, setAvisoStyle] = useState({});

  const [, playNumerosAudio] = useAudio("audio/numeros.mp3");
  const [, playCorrigeAudio] = useAudio("audio/corrige.mp3");
  const [, playConfirmaAudio] = useAudio("audio/confirma.mp3");

  const comecarEtapa = useCallback(() => {
    let etapa = etapas[etapaAtual.current];
    let numeroHTML = "";

    numero.current = "";

    setVotoBranco(false);

    for (let i = 0; i < etapa.numeros; i++) {
      if (i === 0) {
        numeroHTML += '<div class="numero pisca"></div>';
      } else {
        numeroHTML += '<div class="numero"></div>';
      }
    }

    numeroRef.current!.innerHTML = numeroHTML;

    setSeuVotoParaStyle({ display: "none" });
    setCargo(etapa.titulo);

    descricao.current!.innerHTML = "";

    setAvisoStyle({ display: "none" });

    lateral.current!.innerHTML = "";
  }, [descricao, lateral, numeroRef]);

  const atualizaInterface = () => {
    let etapa = etapas[etapaAtual.current];
    let candidato = etapa.candidatos.find(
      (item) => item.numero === numero.current
    );

    if (candidato) {
      setSeuVotoParaStyle({ display: "block" });
      setAvisoStyle({ display: "block" });

      descricao.current!.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}`;

      let fotosHTML = "";
      for (let i in candidato.fotos) {
        // if (candidato.fotos[i].small) {
        //   fotosHTML +=
        //     '<div class="d-1-image small"> <img src="Images/' +
        //     candidato.fotos[i].url +
        //     '" alt="" />' +
        //     candidato.fotos[i].legenda +
        //     "</div>";
        // } else {
        //fotosHTML += '<div class="d-1-image"> <img src="Images/${candidato.fotos[i].url}" alt="" />${candidato.fotos[i].legenda}</div>';
        fotosHTML +=
          '<div class="d-1-image"> <img src="' +
          candidato.fotos[i].url +
          '" alt="" />' +
          etapa.legendas[i] +
          "</div>";
        // }
      }

      lateral.current!.innerHTML = fotosHTML;
    } else {
      setSeuVotoParaStyle({ display: "block" });
      setAvisoStyle({ display: "block" });
      descricao.current!.innerHTML =
        '<div class="aviso--grande pisca">VOTO NULO</div>';
    }
  };

  const clicou = (n: string) => {
    playNumerosAudio();

    let elNumero = document.querySelector(".numero.pisca");
    if (elNumero !== null) {
      elNumero.innerHTML = n;
      //numero = '${numero}${n}';
      numero.current = numero.current + n;

      //fazer com que o campo de número pisque e após preenchido passe para o proximo campo
      elNumero.classList.remove("pisca");
      if (elNumero.nextElementSibling !== null) {
        elNumero.nextElementSibling.classList.add("pisca");
      } else {
        atualizaInterface();
      }
    }
  };

  const branco = () => {
    // numero.current === "";
    setVotoBranco(true);

    setSeuVotoParaStyle({ display: "block" });
    setAvisoStyle({ display: "block" });
    numeroRef.current!.innerHTML = "";
    descricao.current!.innerHTML =
      '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';
    lateral.current!.innerHTML = "";
  };

  const corrige = () => {
    playCorrigeAudio();
    comecarEtapa();
  };

  const confirma = () => {
    let etapa = etapas[etapaAtual.current];

    let votoConfirmado = false;

    let tVoto: IVoto;

    if (votoBranco === true) {
      votoConfirmado = true;
      playConfirmaAudio();

      tVoto = {
        etapa: etapas[etapaAtual.current].titulo,
        voto: "branco",
      };
    } else if (numero.current.length === etapa.numeros) {
      votoConfirmado = true;
      playConfirmaAudio();

      tVoto = {
        etapa: etapas[etapaAtual.current].titulo,
        voto: numero.current,
      };
    }

    setVotos((oldState) => {
      const tVotos = [...oldState];

      tVotos.push(tVoto);

      return tVotos;
    });

    if (votoConfirmado) {
      etapaAtual.current++;
      if (etapas[etapaAtual.current] !== undefined) {
        comecarEtapa();
      } else {
        tela.current!.innerHTML = '<div class="aviso--gigante pisca">FIM</div>';
        console.log(votos);
      }
    }
  };

  useEffect(() => {
    comecarEtapa();
  }, [comecarEtapa]);

  return {
    comecarEtapa,
    seuVotoParaStyle,
    avisoStyle,
    clicou,
    branco,
    corrige,
    confirma,
    cargo,
  };
};
