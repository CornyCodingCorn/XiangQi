import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Board from '../../gameplay/components/Board';
import { useLocation } from 'react-router-dom';
import { PlayerService } from '../services/PlayerService';
import { gameplayBgBlack } from '../../resources/backgrounds/bgIndex';
import { PawnIconImage, PawnTextImage } from '../../resources/for-ui';

const BOARD_COLOR = 0xefcc8b;
const PAD_COLOR = 0x724726;
const OUTER_PAD_COLOR = 0x522706;
const LINE_COLOR = 0x933a1b;
const LINE_MARK_COLOR = 0x0077ff;
const LINE_MARK_OVER_ENEMY_COLOR = 0x55dd55;
const LINE_THICKNESS = 4;
const PADDING = 46;
const PIECE_SIZE = 64;
const CELL_SIZE = 70;
export interface IReplayProps {

}

let boardRef: Board;
let moves: string[];
let index = 0;
export function setMoves(movesStr: string[]) {
  moves = movesStr;
  index = 0;
}

function Replay(props: IReplayProps) {
  const [useImage, setUseImage] = useState(false);
  const [moveIndex, setMoveIndex] = useState(0);
  const [coolDown, setCoolDown] = useState(false);

  const startCoolDown = () => {
    setCoolDown(true);
    const timer = setInterval(() => {
      setCoolDown(false);

      clearInterval(timer);
    }, 0.3 * 1000);
  }

  const boardComponent = React.createElement(Board, {
    onMove: (clb) => { },
    board: Board.BOARD_STR,
    moveCircleRadius: 2,
    moveString: "",
    moveLineWidth: LINE_THICKNESS,
    moveLineColor: LINE_MARK_COLOR,
    moveLineOverEnemyColor: LINE_MARK_OVER_ENEMY_COLOR,
    moveLineAlpha: 1,
    moveLineLength: 6,
    moveVisible: false,
    moveWidth: PIECE_SIZE,
    moveHeight: PIECE_SIZE,
    moveSpace: 14,
    isPlayerRed: true,
    lineThickness: LINE_THICKNESS,
    lineOpacity: 0.8,
    boardColor: BOARD_COLOR,
    padColor: PAD_COLOR,
    outerPadColor: OUTER_PAD_COLOR,
    outerPadPercentage: 0.15,
    lineColor: LINE_COLOR,
    horizontalPadding: PADDING,
    verticalPadding: PADDING,
    pieceSize: PIECE_SIZE,
    cellWidth: CELL_SIZE,
    cellHeight: CELL_SIZE,
    isEndGame: false,
    useImage: useImage,
    ref: (c) => {
      if (c) {
        boardRef = c as Board;
        boardRef.setState({
          isEndGame: true,
        });
      }
    },
  });

  return (
    <div style={{
      backgroundImage: `url(${gameplayBgBlack})`,
      display: "grid",
      height: "100%",
      justifyContent: "center",
      alignContent: "center"
    }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {boardComponent}
        <div style={{
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ marginLeft: "20px", height: "100px", background: "white", borderRadius: "10px", flexGrow: "1", display: "flex", flexDirection: "column" }}>
            <div key={"title"} style={{ fontWeight: "bold", fontSize: "20px", marginTop: "30px", marginBottom: "20px", textAlign: "center", userSelect: "none"}}>Control panel</div>
            <div key={"table"} style={{flexGrow: "1", overflowX: "hidden", overflowY: "scroll"}}>
              <table className='table' style={{ margin: "10px", width: "200px", boxShadow: "0px 0px 10px rgba(38, 38, 38, 0.4)", borderRadius: "10px" }}>
                <thead>
                  <tr>
                    <th scope="col" style={{width: "20px"}}>#</th>
                    <th scope="col">Move</th>
                  </tr>
                </thead>
                <tbody>
                  {createMove(moveIndex)}
                </tbody>
              </table>
            </div>
            <div key={"buttons"} style={{ width: "200px", margin: "10px", display: "flex", flexDirection: "row", alignSelf: "center" }}>
              <button className='btn btn-primary fw-bold' style={{ borderRadius: "10px 0px 0px 10px", height: "55px" }} disabled={moveIndex <= 0 || coolDown} onClick={() => {
                startCoolDown();
                setMoveIndex(v => --v);
                moveBackward();
              }}>{"<<"}</button>
              <button className='btn btn-primary fw-bold' style={{ borderRadius: "0px", height: "55px" }} onClick={() => {
                setUseImage(v => !v);
              }}>
                <div style={{
                  backgroundImage: `url(${useImage ? PawnTextImage : PawnIconImage})`,
                  width: "35px",
                  height: "35px",
                  backgroundSize: "cover"
                }} />
              </button>
              <button className='btn btn-primary fw-bold' style={{ borderRadius: "0px 10px 10px 0px", height: "55px" }} disabled={moveIndex >= moves.length || coolDown} onClick={() => {
                startCoolDown();
                setMoveIndex(v => ++v);
                moveForward();
              }}>{">>"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function moveForward() {
  boardRef.handleOtherMoveStr(moves[index++]);
}

function moveBackward() {
  index--;
  const arr = moves[index].split(" ");
  boardRef.UndoOnePiece(arr[0], arr[1]);
}

function createMove(index: number) {
  var result = moves.map((v, i) => {
    let move = v.split(" ")[0];
    let text = `${move[2]}: ${move[0]}, ${move[1]} -> ${move[3]}, ${move[4]}`;

		return <tr key={i} className={i === index ? "bg-primary" : ""} style={{color: i % 2 === 0 ? "red" : "black", userSelect: "none"}}>
			<th scope="row">{i + 1}</th>
			<td style={{fontWeight: "bold"}}>{text}</td>
		</tr>
	});

  result.push(<tr key={moves.length} className={index >= moves.length ? "bg-primary" : ""} style={{userSelect: "none"}}>
    <th>End</th>
    <td></td>
  </tr>)
	return result;
}

export default Replay
