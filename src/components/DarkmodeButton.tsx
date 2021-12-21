interface Props {
  isDarkmode: boolean, 
  setDarkMode: () => void
}

const DarkmodeModal:React.FC<Props> = ({ isDarkmode, setDarkMode }) => {
  return (
    <div className="darkmode" onClick={setDarkMode}> 
      {
        isDarkmode ? <p>Darkmode is Activated!</p> : 
        <p>Darkmode is Disabled</p>
      }
    </div>
  )
}

export default DarkmodeModal;