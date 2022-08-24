
import './App.css';

function App() {

  const clicou = (key: string) => {};

  return (
    <div className="urna">
            <div className="tela">
                <div className="d-1">
                    <div className="d-1-left">
                        <div className="d-1-1">
                            <span>SEU VOTO PARA</span>
                        </div>
                        <div className="d-1-2">
                            <span>VEREADOR</span>
                        </div>
                        <div className="d-1-3">
                            <div className="numero pisca"></div>
                            <div className="numero"></div>
                        </div>
                        <div className="d-1-4">
                            Nome: FULANO<br/>
                            Partido: NOVO<br/>
                            Vice-Prefeito: BELTRANO<br/>
                        </div>
                    </div>
                    <div className="d-1-right">
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
                <div className="d-2">
                    Aperte a tela: <br/>
                    CONFIRMA para CONFIRMAR este voto<br/>
                    CORRIGE para CORRIGIR este voto
                </div>
            </div>
            <div className="esquerda">
                <div className="topo-esquerda"> 
                    <div className="logo"> <img src="Images/brasao.png" alt="" /> </div>
                    <div className="Justica-eleitoral">JUSTIÇA<br/>ELEITORAL</div>
                </div>
                <div className="teclado">
                    <div className="teclado--linha">
                        <div className="teclado--botao" onClick={() => clicou('1')}>1</div>
                        <div className="teclado--botao" onClick={() => clicou('2')}>2</div>
                        <div className="teclado--botao" onClick={() => clicou('3')}>3</div>
                    </div>
                    <div className="teclado--linha">
                        <div className="teclado--botao" onClick={() => clicou('4')}>4</div>
                        <div className="teclado--botao" onClick={() => clicou('5')}>5</div>
                        <div className="teclado--botao" onClick={() => clicou('6')}>6</div>
                    </div>
                    <div className="teclado--linha">
                        <div className="teclado--botao" onClick={() => clicou('7')}>7</div>
                        <div className="teclado--botao" onClick={() => clicou('8')}>8</div>
                        <div className="teclado--botao" onClick={() => clicou('9')}>9</div>
                    </div>
                    <div className="teclado--linha">
                        <div className="teclado--botao" onClick={() => clicou('0')}>0</div>
                    </div>
                    <div className="teclado--linha">
                        <div className="teclado--botao botao--branco" onClick={() =>branco()}>BRANCO</div>
                        <div className="teclado--botao botao--corrige" onClick={() =>corrige()}>CORRIGE</div>
                        <div className="teclado--botao botao--confirma" onClick={() =>confirma()}>CONFIRMA</div>
                    </div>
                </div>
            </div>
            
        </div>
  );
}

export default App;
