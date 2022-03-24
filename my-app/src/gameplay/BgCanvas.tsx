import * as React from 'react';
import { BoardBase, BoardConst, IBoardBaseProps, IBoardBaseStates } from './common/BoardBase';
import {default as UtilsColor} from '../utils/Color';

export interface IBgCanvasProps extends IBoardBaseProps {
    padColor    ?:  number;
    boardColor  ?: number;
    lineColor   ?: number;
  
    lineThickness ?: number;
    lineOpacity?: number;
}

export interface IBgCanvasStates extends IBoardBaseStates {
    padColor  : number;
    boardColor  : number;
    lineColor   : number;
  
    lineThickness: number;
    lineOpacity: number;
}

export class BgCanvas extends BoardBase<IBgCanvasProps, IBgCanvasStates> {
    private _padColor: UtilsColor = new UtilsColor();
    private _lineColor: UtilsColor = new UtilsColor();
    private _boardColor: UtilsColor = new UtilsColor();

    constructor(props: IBgCanvasProps) {
        super(props);

        this.state = {
            ...this.state,
            padColor    : this.props.padColor   || 0,
            boardColor  : this.props.boardColor || 0,
            lineColor   : this.props.lineColor  || 0,

            lineThickness : this.props.lineThickness || 1,
            lineOpacity : this.props.lineOpacity || 1,
        }
    }

    render(): React.ReactNode {
        this._boardColor.setColor(this.state.boardColor);
        this._padColor.setColor(this.state.padColor);
        this._lineColor.setColor(this.state.lineColor, this.state.lineOpacity);

        let bgCanvas: React.CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            background: this._padColor.toString()
          }

        return (
            <canvas key={"bgCanvas"} 
                width={BoardBase.boardWidth} 
                height={BoardBase.boardHeight} 
                style={bgCanvas} 
                ref={c => this._canvasInit(c)}/>
        )
    }

    private _canvasInit(canvas: HTMLCanvasElement | null) {
        if (canvas === null) 
          return;    
    
        let context = canvas.getContext("2d");
        if (context === null)
          return;
    
        context.fillStyle = this._boardColor.toString();
        context.strokeStyle = this._lineColor.toString();
        context.lineWidth = this.state.lineThickness

        context.fillRect(
          this.state.horizontalPadding,
          this.state.verticalPadding,
          BoardBase.playAreaWidth,
          BoardBase.playAreaHeight,
        );
        
        // Draw the border
        context.strokeRect(
          this.state.horizontalPadding,
          this.state.verticalPadding,
          BoardBase.playAreaWidth,
          BoardBase.playAreaHeight,
        );
    
        // Draw rows
        for (let i = 1; i < BoardConst.BOARD_ROW; i++) {
          let y = this.state.verticalPadding + i * this.state.cellHeight;
          let x = this.state.horizontalPadding;
        
          this._drawLine(context, x, y, x + BoardBase.playAreaWidth, y);
        }
    
        // Have to skip the middle
        for (let i = 1; i < BoardConst.BOARD_COL; i++) {
          let x = this.state.horizontalPadding + i * this.state.cellWidth;
    
          let y1 = this.state.verticalPadding;
          let yEnd1 = y1 + this.state.cellHeight * 4;
          // Skip the middle
          let y2 = yEnd1 + this.state.cellHeight;
          let yEnd2 = y1 + BoardBase.playAreaHeight;
    
          this._drawLine(context, x, y1, x, yEnd1);
          this._drawLine(context, x, y2, x, yEnd2);
        }

        // Draw the X
        {
            let x1 = this.state.horizontalPadding + 3 * this.state.cellWidth;
            let x2 = this.state.horizontalPadding + 5 * this.state.cellWidth;
            let y1 = this.state.verticalPadding;
            let y2 = this.state.verticalPadding + 2 * this.state.cellWidth;
            let ctx: CanvasRenderingContext2D = context

            let drawX = () => { 
                this._drawLine(ctx, x1, y1, x2, y2);
                this._drawLine(ctx, x2, y1, x1, y2);
            }
            drawX();
    
            y1 = BoardBase.boardHeight - this.state.verticalPadding;
            y2 = this.state.verticalPadding + 7 * this.state.cellWidth;
            drawX();
        }
    
        context.stroke();
    }

    private _drawLine(ctx: CanvasRenderingContext2D, x1:number, y1:number, x2:number, y2:number) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }
}