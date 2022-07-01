import moment from 'moment';
import TimeSVG from 'src/assets/images/governance/time.svg';

type Props = {
  data: any;
  isSnapshot: boolean;
};

const GovernanceItem: React.FC<Props> = ({ data, isSnapshot }) => {
  const endedAt = isSnapshot
    ? moment.unix(data.timestamp).format()
    : data.endedDate;

  return (
    <a
      href={
        isSnapshot
          ? `https://snapshot.org/#/elyfi-bsc.eth/proposal/${data.id}`
          : data.link
      }
      rel="noopener noreferer"
      target="_blank">
      <article>
        <header>
          <p>{isSnapshot ? data.data.description : data.nap}</p>
        </header>
        <section>
          <p>{data.title}</p>
          <p>{data.summary}</p>
        </section>
        <div>
          {moment().isBefore(endedAt) && (
            <>
              <img src={TimeSVG} />
              &nbsp;
              <p>
                {`${
                  moment.duration(moment().diff(endedAt)).hours() * -1
                } hours ${
                  moment.duration(moment().diff(endedAt)).minutes() * -1
                } minutes left`}
              </p>
            </>
          )}
          <div>
            <div
              style={{
                backgroundColor: moment().isBefore(endedAt)
                  ? '#57b275'
                  : '#7346E4',
              }}
            />
            <p>
              &nbsp;
              {moment().isBefore(endedAt) ? `Active` : `Closed`}
            </p>
          </div>
        </div>
      </article>
    </a>
  );
};

export default GovernanceItem;
