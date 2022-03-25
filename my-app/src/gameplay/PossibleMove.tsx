import * as React from "react";
import Color from "../utils/Color";

export interface IPossibleMoveProps {
	width: number;
	height: number;

	space: number;

	lineLength: number;
	lineColor: number;
	lineOverEnemyColor: number;
	lineAlpha: number;

	lineWidth: number;

	circleRadius: number;

	overEnemy: boolean;

	// To store the number for later usages
	x: number;
	y: number;

	top: number;
	left: number;

	onClick?: (x: number, y: number, event: MouseEvent) => void;
}

const PossibleMove: React.FunctionComponent<IPossibleMoveProps> = (props) => {
	
	return (
		<canvas
			onClick={(e) => {
				if (props.onClick) props.onClick(props.x, props.y, e.nativeEvent);
			}}
			style={{
				position: "absolute",
				top: props.top,
				left: props.left,
				pointerEvents: "auto",
				transform: "translate(-50%, -50%)",
			}}
			ref={(c) => _initCanvas(props, c)}
			width={props.width}
			height={props.height}
		/>
	);
};

/*
	.........
	.._|.|_..
	.._..._..
	...|.|...
	.........
*/

function _initCanvas(
	props: IPossibleMoveProps,
	canvas: HTMLCanvasElement | null,
) {
	if (!canvas) return;

	let context = canvas.getContext("2d");
	if (!context) return;

	let color: Color = new Color(props.overEnemy? props.lineOverEnemyColor : props.lineColor, props.lineAlpha);

	let centerX = props.width / 2;
	let centerY = props.height / 2;
	let halfSpace = props.space / 2;

	let lineLength = props.lineLength;

	context.strokeStyle = color.toString();
	context.fillStyle = color.toString();
	context.lineWidth = props.lineWidth;
	context.lineCap = "round";
	{
		let startX1 = centerX - halfSpace - lineLength;
		let startX2 = centerX + halfSpace + lineLength;
		let endX1 = startX1 + lineLength;
		let endX2 = startX2 - lineLength;

		let startY1 = centerY - halfSpace;
		let startY2 = centerY + halfSpace;
		let endY1 = startY1 - lineLength;
		let endY2 = startY2 + lineLength;

		context.moveTo(startX1, startY1);
		context.lineTo(endX1, startY1);
		context.lineTo(endX1, endY1);

		context.moveTo(startX2, startY1);
		context.lineTo(endX2, startY1);
		context.lineTo(endX2, endY1);

		context.moveTo(startX1, startY2);
		context.lineTo(endX1, startY2);
		context.lineTo(endX1, endY2);

		context.moveTo(startX2, startY2);
		context.lineTo(endX2, startY2);
		context.lineTo(endX2, endY2);

		context.moveTo(centerX, centerY);
		context.arc(centerX, centerY, props.circleRadius, 0, 2 * Math.PI, false);
		context.stroke();
	}
}

export default PossibleMove;