import { CSSProperties } from "react";


const copiedLink = (addr: string) => {
  if (!document.queryCommandSupported('copy')) {
    return alert('This browser does not support the copy function.');
  }
  if (addr === undefined) {
    return alert('There was a problem reading the ABToken.');
  } else {
    const area = document.createElement('textarea');
    area.value = addr;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    alert('Copied!!');
  }
}

const addressCopiedLink = (addr: string, style?: CSSProperties) => {
  return (
    <p className="component__address-copied-link" style={style} onClick={() => copiedLink(addr)}>
      {addr}
    </p>
  )
}

export default addressCopiedLink;