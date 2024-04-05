// import React , {Component} from 'react';

// class ArrowClass extends Component {
//     constructor(props){
//         super(props);
//         this.state={
//             arrowPosition:{x:props.initialX, y:props.initialY},
//             distance:0,
//             transitionDuration:0.5,
//             angle:0,
//             velX:0,
//             velY:0,
//             accX:0,
//             accY:0
//         }
//     }
//     returnDistance=(x1,y1,x2,y2)=>{
//         return Math.sqrt(Math.pow(y2-y1,2)+Math.pow(x2-x1,2))
//     }
//     alignment = () => {
//         const { arrows } = this.props;
//         let radius=2000;
//         let totalX=0;
//         let totalY=0;
//         let total=0;
//         let avgX=0;
//         let avgY=0;
//         for(let i=0;i<arrows.length;i++){
//             let d=this.returnDistance(arrowPosition.x,arrowPosition.y,arrows[i].arrowPosition.x,arrows[i].arrowPosition.y)
//             if(this!==arrows[i]&& d<radius){
//                 total++;
//                 totalX+=arrows[i].velX;
//                 totalY+=arrows[i].velY;
//             }
//         }
//         if (total>0){
//          avgX=totalX/total;
//          avgY=totalY/arrows.length;}
//         let newVelX=avgX-this.state.velX;
//         let newVelY=avgY-this.state.velY;
//         return {newVelX,newVelY}
//     };
//     componentDidMount() {
//         // this.updateArrow(this.props.mouseX, this.props.mouseY);
//         this.updateLoop();
//       }
    
//     componentDidUpdate(prevProps) {
//         if (this.props.mouseX !== prevProps.mouseX || this.props.mouseY !== prevProps.mouseY) {
//           this.updateArrow(this.props.mouseX, this.props.mouseY);
//         }
//       }
//     updateArrow(mouseX, mouseY) {
//         const newAngle = Math.atan2(mouseY - this.state.arrowPosition.y, mouseX - this.state.arrowPosition.x);
//         const newDistance = Math.sqrt(Math.pow(mouseY - this.state.arrowPosition.y, 2) + Math.pow(mouseX - this.state.arrowPosition.x, 2));
    
//         this.setState({
//           angle: newAngle,
//           transitionDuration: newDistance / 500
//         });
//       }
//     updateLoop = () => {
//         const { newVelX, newVelY } = this.alignment();
//         // Update state with new velocity values
//         const newX = this.state.arrowPosition.x + newVelX;
//         const newY = this.state.arrowPosition.y + newVelY;
//         // Update state with new position and velocity values
//         this.setState({
//             arrowPosition: { x: newX, y: newY },
//             velX: newVelX,
//             velY: newVelY,
//         });
//         // Request next animation frame
//         this.frameId = requestAnimationFrame(this.updateLoop);
//       };
//     // componentDidMount() {
//     //     // Start continuous update loop
//     //     this.updateLoop = setInterval(() => {
//     //         const { newVelX, newVelY } = this.alignment(this.props.arrows);
//     //         // Update state with new velocity values
//     //         this.setState({
//     //             velX: newVelX,
//     //             velY: newVelY
//     //         });
//     //     }, 100); // Adjust the interval as needed (e.g., 100 milliseconds)
//     // }
//     render(){
//         const { arrowPosition, angle, transitionDuration } = this.state;
//         return(
//         <div
//         className="Arrow"
//         style={{
//           position: 'absolute',
//           top: arrowPosition.y,
//           left: arrowPosition.x,
//           transform: `translate(-50%, -50%) rotate(${angle+1.5}rad)`,
//           width: 0,
//           height: 0,
//           borderLeft: '7px solid transparent',
//           borderRight: '7px solid transparent',
//           borderBottom: '20px solid black',
//           transition: `top ${transitionDuration}s ease, left ${transitionDuration}s ease`,
//         }}
//       ></div>)
//     }
// }
// export default ArrowClass;