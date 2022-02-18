const animationLine = (
  length: number,
  deg: 'up' | 'down' | 'left' | 'right',
): JSX.Element => {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(<span key={`arrow0_${i}`} className="arrow--00" />);
  }
  for (let i = 0; i < length; i++) {
    result.push(<span key={`arrow1_${i}`} className="arrow--01" />);
  }
  for (let i = 0; i < length; i++) {
    result.push(<span key={`arrow2_${i}`} className="arrow--02" />);
  }
  for (let i = 0; i < length; i++) {
    result.push(<span key={`arrow3_${i}`} className="arrow--03" />);
  }
  for (let i = 0; i < length; i++) {
    result.push(<span key={`arrow4_${i}`} className="arrow--04" />);
  }
  return <div className={`scroll-arrow ${deg}`}>{result}</div>;
};

export default animationLine;
