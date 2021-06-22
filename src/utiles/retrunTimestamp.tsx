import dateFillZero from './dateFillZero';


const returnTimpstamp = (time: number | undefined) => {
  if (typeof time === undefined) {
    return;
  }
  const date = new Date(time!);

  return (
    date.getFullYear() + "-" + dateFillZero(date.getMonth() + 1) + "-" + dateFillZero(date.getDate())
  );
}

export default returnTimpstamp;