const InstallMetamask = () => {

  return (
    <div className="navigation__wallet" style={{ cursor: "pointer" }}>
      <a href={"https://metamask.io/download.html"} style={{ cursor: "pointer", width: 147, textAlign: "center" }}>
        <p className="navigation__wallet__status" style={{ fontSize: 14.5, cursor: "pointer" }}>Install Metamask</p>
      </a>
    </div>
  );
}

export default InstallMetamask;