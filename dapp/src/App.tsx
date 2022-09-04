import { createRef } from "react";
import { useUrna } from "./script";
function App() {
  const descricaoRef = createRef<HTMLDivElement>();
  const lateralRef = createRef<HTMLDivElement>();
  const telalRef = createRef<HTMLDivElement>();
  const numeroRef = createRef<HTMLDivElement>();

  const {
    clicou,
    branco,
    corrige,
    confirma,
    seuVotoParaStyle,
    avisoStyle,
    cargo,
  } = useUrna(descricaoRef, lateralRef, telalRef, numeroRef);

  const buildDigitsLine = (digits: number[]) => {
    return (
      <div className="teclado--linha">
        {digits.map((digit) => (
          <div
            className="teclado--botao"
            onClick={() => clicou(digit.toString())}
            key={digit}
          >
            {digit}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="urna">
      <div className="tela" ref={telalRef}>
        <div className="d-1">
          <div className="d-1-left">
            <div className="d-1-1">
              <span style={seuVotoParaStyle}>SEU VOTO PARA</span>
            </div>
            <div className="d-1-2">
              <span>{cargo}</span>
            </div>
            <div className="d-1-3" ref={numeroRef}>
              <div className="numero"></div>
            </div>
            <div className="d-1-4" ref={descricaoRef}>
              Nome: FULANO
              <br />
              Partido: NOVO
              <br />
              Vice-Prefeito: BELTRANO
              <br />
            </div>
          </div>
          <div className="d-1-right" ref={lateralRef}>
            <div className="d-1-image">
              <img src="Images/hagar.PNG" alt="" />
              Prefeito
            </div>
            <div className="d-1-image small">
              <img src="Images/guy.PNG" alt="" />
              Vice-Prefeito
            </div>
          </div>
        </div>
        <div className="d-2" style={avisoStyle}>
          Aperte a tela: <br />
          CONFIRMA para CONFIRMAR este voto
          <br />
          CORRIGE para CORRIGIR este voto
        </div>
      </div>
      <div className="esquerda">
        <div className="topo-esquerda">
          <div className="logo">
            {" "}
            <img src="Images/brasao.png" alt="" />{" "}
          </div>
          <div className="Justica-eleitoral">
            JUSTIÇA
            <br />
            ELEITORAL
          </div>
        </div>
        <div className="teclado">
          {buildDigitsLine([1, 2, 3])}
          {buildDigitsLine([4, 5, 6])}
          {buildDigitsLine([7, 8, 9])}
          {buildDigitsLine([0])}

          <div className="teclado--linha">
            <div
              className="teclado--botao botao--branco"
              onClick={() => branco()}
            >
              BRANCO
            </div>
            <div
              className="teclado--botao botao--corrige"
              onClick={() => corrige()}
            >
              CORRIGE
            </div>
            <div
              className="teclado--botao botao--confirma"
              onClick={() => confirma()}
            >
              CONFIRMA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
