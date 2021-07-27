import MainBackground from 'src/assets/images/main-background.png';

const MobileDisable = () => {
  return (
    <section className="mobile" style={{ backgroundImage: `url(${MainBackground})` }}>
      <div>
        <h2>
          COMMING SOON!
        </h2>
        <p>
          모바일 웹 페이지가 곧 오픈됩니다!
        </p>
        <p>
          ELYFI를 경험하고 싶으시다면<br/>PC버전을 이용해주세요.
        </p>
      </div>
    </section>
  )
}

export default MobileDisable;