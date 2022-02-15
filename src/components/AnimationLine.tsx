const animationLine = (
  length: number,
  deg: 'up' | 'down' | 'left' | 'right',
): JSX.Element => {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(<span className="arrow--00" />);
  }
  for (let i = 0; i < length; i++) {
    result.push(<span className="arrow--01" />);
  }
  for (let i = 0; i < length; i++) {
    result.push(<span className="arrow--02" />);
  }
  for (let i = 0; i < length; i++) {
    result.push(<span className="arrow--03" />);
  }
  for (let i = 0; i < length; i++) {
    result.push(<span className="arrow--04" />);
  }
  return <div className={`scroll-arrow ${deg}`}>{result}</div>;
};

export default animationLine;
