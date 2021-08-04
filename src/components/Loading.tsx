import React from 'react'
import { PuffLoader } from "react-spinners";

const Loading: React.FunctionComponent = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
      <div style={{ position: 'absolute', margin: 0, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ width: 70, height: 70 }}>
          <PuffLoader color="#00bfff81" />
        </div>
      </div>
    </div>
  )
}

export default Loading