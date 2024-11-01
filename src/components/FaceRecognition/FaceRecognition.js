import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl , box}) => {
    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img id = 'inputimage' alt='' style={{ height: 'auto', width: '500px' }} src={imageUrl}/>
                <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
            </div>
        </div>
    );
}
export default FaceRecognition;