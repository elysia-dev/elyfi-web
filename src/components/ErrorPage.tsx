import errorBg from 'src/assets/images/error.png';

const ErrorPage: React.FunctionComponent<{
  statusCode?: number;
  message?: string;
}> = ({ statusCode = 500, message = 'Server Error' }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
      <div
        style={{
          position: 'absolute',
          margin: 0,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
        <div style={{ width: 740, height: 500 }}>
          <h1
            style={{
              position: 'absolute',
              top: '20%',
              left: '33%',
              transform: 'translate(-20%, -33%)',
              fontSize: 200,
            }}>
            {statusCode}
          </h1>
          <h1
            style={{
              position: 'absolute',
              top: '73%',
              left: '56%',
              transform: 'translate(-73%, -56%)',
            }}>
            {message}
          </h1>
          <img src={errorBg} alt="error" />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
