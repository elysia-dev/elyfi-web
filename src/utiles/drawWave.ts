import Token from 'src/enums/Token';
import TokenColors from 'src/enums/TokenColors';

class DrawWave {
  ctx: CanvasRenderingContext2D;
  browserWidth: number;

  constructor(ctx: CanvasRenderingContext2D, browserWidth: number) {
    this.ctx = ctx;
    this.browserWidth = browserWidth;
  }

  drawOnMain(
    mainHeaderY: HTMLParagraphElement,
    mainHeaderMoblieY: HTMLParagraphElement,
    guideY: HTMLParagraphElement,
    auditPageY: HTMLParagraphElement,
    isResize: boolean,
    // governancePageY: HTMLParagraphElement,
  ): void {
    const headerY = mainHeaderY.offsetTop;
    const mainMoblieY = mainHeaderMoblieY.offsetTop;
    const guidePageY = guideY.offsetTop;
    const auditY = auditPageY.offsetTop;
    // const governanceY = governancePageY.offsetTop;
    // const governanceBottomY = governancePageY.offsetHeight;

    this.ctx.strokeStyle = '#00BFFF';
    const yValue = this.browserWidth > 1190 ? headerY : mainMoblieY / 1.12;
    this.ctx.beginPath();
    this.ctx.moveTo(0, yValue * 1.6);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      // 970,
      yValue * 1.885,
      this.browserWidth / 1.5,
      yValue * 1.145,
      this.browserWidth,
      yValue * 1.398,
    );
    this.ctx.moveTo(0, yValue * 1.631);
    this.ctx.bezierCurveTo(
      this.browserWidth / 1.5,
      yValue * 1.897,
      this.browserWidth / 1.7,
      yValue * 1.139,
      this.browserWidth,
      yValue * 1.417,
    );
    this.ctx.stroke();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.moveTo(this.browserWidth / 3.2 + 10, yValue * 1.685);
    this.ctx.arc(
      this.browserWidth / 3.2,
      yValue * 1.685,
      10,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 3.35 + 4.4, yValue * 1.658);
    this.ctx.arc(
      this.browserWidth / 3.35,
      yValue * 1.658,
      4.4,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 1.33 + 10, yValue * 1.378);
    this.ctx.arc(
      this.browserWidth / 1.33,
      yValue * 1.378,
      10,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 1.31 + 5, yValue * 1.398);
    this.ctx.arc(
      this.browserWidth / 1.31,
      yValue * 1.398,
      5,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(0, guidePageY * 0.957);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      guidePageY * 0.933,
      this.browserWidth / 1.5,
      guidePageY * 1.057,
      this.browserWidth,
      guidePageY * 1.03,
    );
    this.ctx.stroke();

    // bottom
    this.ctx.fillStyle = 'rgba(247, 251, 255, 1)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, guidePageY * 0.9639);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      guidePageY * 0.9484,
      this.browserWidth / 1.5,
      guidePageY * 1.0454,
      this.browserWidth,
      guidePageY * 1.0363,
    );

    this.ctx.lineTo(this.browserWidth, auditY * 0.9877);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      auditY * 1.0117,
      this.browserWidth / 1.7,
      auditY * 0.9301,
      0,
      auditY * 0.9605,
    );
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(0, auditY * 0.97);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      auditY * 0.9301,
      this.browserWidth / 1.7,
      auditY * 1.0045,
      this.browserWidth,
      auditY * 0.986,
    );
    this.ctx.stroke();

    this.ctx.fillStyle = '#ffffff';
    // bottom circle
    this.ctx.beginPath();
    this.ctx.moveTo(this.browserWidth / 4 + 10, guidePageY * 0.966);
    this.ctx.arc(
      this.browserWidth / 4,
      guidePageY * 0.966,
      10,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.moveTo(this.browserWidth / 1.2 + 10, guidePageY * 1.0324);
    this.ctx.arc(
      this.browserWidth / 1.2,
      guidePageY * 1.0324,
      10,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.moveTo(this.browserWidth / 1.22 + 5, guidePageY * 1.0281);
    this.ctx.arc(
      this.browserWidth / 1.22,
      guidePageY * 1.0281,
      5,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.stroke();

    // circle
    this.ctx.beginPath();
    this.ctx.moveTo(this.browserWidth / 3 + 10, auditY * 0.959);
    this.ctx.arc(
      this.browserWidth / 3,
      auditY * 0.959,
      10,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 3.14 + 5, auditY * 0.9585);
    this.ctx.arc(
      this.browserWidth / 3.14,
      auditY * 0.9585,
      5,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.stroke();
  }

  drawMoblieOnMain(
    mainHeaderY: HTMLParagraphElement,
    mainHeaderMoblieY: HTMLParagraphElement,
    guideY: HTMLParagraphElement,
    auditPageY: HTMLParagraphElement,
    isResize: boolean,
    // governancePageY: HTMLParagraphElement,
  ): void {
    const headerY = mainHeaderY.offsetTop;
    const mainMoblieY = mainHeaderMoblieY.offsetTop;
    const guidePageY = guideY.offsetTop + 120;
    const auditY = auditPageY.offsetTop + 120;
    // const governanceY = governancePageY.offsetTop - 25;
    // const governanceBottomY = governancePageY.offsetHeight;

    this.ctx.strokeStyle = '#00BFFF';
    const yValue = mainMoblieY / 1.12;
    this.ctx.beginPath();
    this.ctx.moveTo(0, yValue * 1.78);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2.4,
      // 970,
      yValue * 1.9,
      this.browserWidth / 1.4,
      yValue * 1.22,
      this.browserWidth,
      yValue * 1.58,
    );
    this.ctx.moveTo(0, yValue * 1.8);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2.4,
      yValue * 1.9,
      this.browserWidth / 1.4,
      yValue * 1.22,
      this.browserWidth,
      yValue * 1.6,
    );
    this.ctx.stroke();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.moveTo(this.browserWidth / 2.448 + 7, yValue * 1.685);
    this.ctx.arc(
      this.browserWidth / 2.448,
      yValue * 1.685,
      7,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 2.23 + 4, yValue * 1.658);
    this.ctx.arc(
      this.browserWidth / 2.23,
      yValue * 1.658,
      4,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 1.33 + 6, yValue * 1.48);
    this.ctx.arc(
      this.browserWidth / 1.33,
      yValue * 1.48,
      6,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 1.27 + 3, yValue * 1.484);
    this.ctx.arc(
      this.browserWidth / 1.27,
      yValue * 1.484,
      3,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(0, guidePageY * 0.912);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2.2,
      guidePageY * 0.98,
      this.browserWidth / 1.2,
      guidePageY * 0.925,
      this.browserWidth,
      guidePageY * 0.97,
    );
    this.ctx.stroke();

    // bottom
    this.ctx.fillStyle = 'rgba(247, 251, 255, 1)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, guidePageY * 0.918);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2.2,
      guidePageY * 0.98,
      this.browserWidth / 1.2,
      guidePageY * 0.92,
      this.browserWidth,
      guidePageY * 0.98,
    );

    this.ctx.lineTo(this.browserWidth, auditY * 0.911);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      auditY * 0.91,
      this.browserWidth / 1.7,
      auditY * 0.9401,
      0,
      auditY * 0.938,
    );
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(0, auditY * 0.94);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      auditY * 0.94,
      this.browserWidth / 1.7,
      auditY * 0.91,
      this.browserWidth,
      auditY * 0.921,
    );
    this.ctx.stroke();

    this.ctx.fillStyle = '#ffffff';
    // bottom circle
    this.ctx.beginPath();
    this.ctx.moveTo(this.browserWidth / 4 + 7, guidePageY * 0.9417);
    this.ctx.arc(
      this.browserWidth / 4,
      guidePageY * 0.9417,
      7,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.moveTo(this.browserWidth / 1.39 + 7, guidePageY * 0.95);
    this.ctx.arc(
      this.browserWidth / 1.39,
      guidePageY * 0.95,
      7,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.moveTo(this.browserWidth / 1.32 + 4, guidePageY * 0.95);
    this.ctx.arc(
      this.browserWidth / 1.32,
      guidePageY * 0.95,
      4,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.stroke();

    // circle
    this.ctx.beginPath();
    this.ctx.moveTo(this.browserWidth / 3 + 7, auditY * 0.935);
    this.ctx.arc(
      this.browserWidth / 3,
      auditY * 0.935,
      7,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 3.35 + 4, auditY * 0.936);
    this.ctx.arc(
      this.browserWidth / 3.35,
      auditY * 0.936,
      4,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.stroke();

    this.ctx.fill();
    this.ctx.stroke();
  }

  drawOnPages(
    headerY: number,
    color: TokenColors,
    browserHeghit: number,
    isBackgroundColor: boolean,
    token?: string,
  ): void {
    this.ctx.fillStyle = 'rgba(247, 251, 255, 1)';
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, headerY * 1.3);
    this.ctx.bezierCurveTo(
      this.browserWidth / 5,
      headerY * 0.5,
      this.browserWidth / 5,
      headerY * 1.5,
      this.browserWidth / 2,
      headerY * 1.5,
    );
    this.ctx.bezierCurveTo(
      this.browserWidth / 1.3,
      headerY * 1.5,
      this.browserWidth / 1.3,
      headerY * 0.35,
      this.browserWidth,
      headerY * 1.4,
    );
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(0, headerY * 1.4);
    this.ctx.bezierCurveTo(
      this.browserWidth / 5,
      headerY * 0.38,
      this.browserWidth / 5,
      headerY * 1.5,
      this.browserWidth / 2,
      headerY * 1.5,
    );
    this.ctx.bezierCurveTo(
      this.browserWidth / 1.2,
      headerY * 1.43,
      this.browserWidth / 1.3,
      headerY * 0.6,
      this.browserWidth,
      headerY * 1.4,
    );
    if (isBackgroundColor) {
      this.ctx.lineTo(this.browserWidth, browserHeghit - 150);
      this.ctx.bezierCurveTo(
        this.browserWidth / 1.2,
        browserHeghit - 330,
        this.browserWidth / 1.3,
        browserHeghit - 84,
        this.browserWidth / 2,
        browserHeghit - 94,
      );
      this.ctx.bezierCurveTo(
        this.browserWidth / 2.7,
        browserHeghit - 105,
        this.browserWidth / 3,
        browserHeghit - 250,
        0,
        browserHeghit - 190,
      );
      this.ctx.closePath();
      this.ctx.fill();

      // this.ctx.beginPath();
      this.ctx.moveTo(0, browserHeghit - 165);
      this.ctx.bezierCurveTo(
        this.browserWidth / 3,
        browserHeghit - 300,
        this.browserWidth / 4,
        browserHeghit - 70,
        this.browserWidth / 1.68,
        browserHeghit - 100,
      );
      this.ctx.bezierCurveTo(
        this.browserWidth / 1.11,
        browserHeghit - 210,
        this.browserWidth / 1.19,
        browserHeghit - 240,
        this.browserWidth,
        browserHeghit - 170,
      );
    }
    this.ctx.stroke();

    // circle
    if (isBackgroundColor) {
      this.ctx.strokeStyle = token
        ? token === Token.EL
          ? '#3679B5'
          : token === 'LP'
          ? '#F9AE19'
          : '#00BFFF'
        : color;
      this.ctx.beginPath();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.moveTo(this.browserWidth / 7 + 10, browserHeghit - 204.5);
      this.ctx.arc(
        this.browserWidth / 7,
        browserHeghit - 204.5,
        10,
        0,
        Math.PI * 2,
      );

      this.ctx.moveTo(this.browserWidth / 1.64 + 5, browserHeghit - 104.5);
      this.ctx.arc(
        this.browserWidth / 1.64,
        browserHeghit - 104.5,
        5,
        0,
        Math.PI * 2,
      );

      this.ctx.moveTo(this.browserWidth / 3 + 10, browserHeghit - 167);
      this.ctx.arc(
        this.browserWidth / 3,
        browserHeghit - 167,
        10,
        0,
        Math.PI * 2,
      );

      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.strokeStyle = token
        ? token === Token.EL
          ? '#3679B5'
          : token === 'LP'
          ? '#627EEA'
          : '#00BFFF'
        : color;

      this.ctx.moveTo(this.browserWidth / 1.7 + 10, browserHeghit - 101);
      this.ctx.arc(
        this.browserWidth / 1.7,
        browserHeghit - 101,
        10,
        0,
        Math.PI * 2,
      );

      this.ctx.moveTo(this.browserWidth / 7.58 + 5, browserHeghit - 210);
      this.ctx.arc(
        this.browserWidth / 7.58,
        browserHeghit - 210,
        5,
        0,
        Math.PI * 2,
      );

      this.ctx.moveTo(this.browserWidth / 1.18 + 10, browserHeghit - 203);
      this.ctx.arc(
        this.browserWidth / 1.18,
        browserHeghit - 203,
        10,
        0,
        Math.PI * 2,
      );

      this.ctx.fill();

      this.ctx.stroke();
    }

    this.ctx.strokeStyle = token
      ? token === Token.EL
        ? '#3679B5'
        : token === 'LP'
        ? '#F9AE19'
        : '#00BFFF'
      : color;
    this.ctx.beginPath();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.moveTo(this.browserWidth / 7 + 10, headerY * 0.985);
    this.ctx.arc(this.browserWidth / 7, headerY * 0.985, 10, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 1.46 + 5, headerY * 1.349);
    this.ctx.arc(this.browserWidth / 1.46, headerY * 1.349, 5, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 3 + 10, headerY * 1.368);
    this.ctx.arc(this.browserWidth / 3, headerY * 1.368, 10, 0, Math.PI * 2);

    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = token
      ? token === Token.EL
        ? '#3679B5'
        : token === 'LP'
        ? '#627EEA'
        : '#00BFFF'
      : color;

    this.ctx.moveTo(this.browserWidth / 1.5 + 10, headerY * 1.32);
    this.ctx.arc(this.browserWidth / 1.5, headerY * 1.32, 10, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 7.8 + 5, headerY * 0.989);
    this.ctx.arc(this.browserWidth / 7.8, headerY * 0.989, 5, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 1.18 + 10, headerY * 1.055);
    this.ctx.arc(this.browserWidth / 1.18, headerY * 1.055, 10, 0, Math.PI * 2);

    this.ctx.fill();

    this.ctx.stroke();
  }

  drawMobileOnPages(
    headerY: number,
    color: TokenColors,
    browserHeghit: number,
    isBackgroundColor: boolean,
    token?: string,
  ): void {
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, headerY * 1.7);
    this.ctx.bezierCurveTo(
      this.browserWidth / 5,
      headerY * 1.5,
      this.browserWidth / 5,
      headerY * 1.7,
      this.browserWidth / 2,
      headerY * 1.66,
    );
    this.ctx.bezierCurveTo(
      this.browserWidth / 1.4,
      headerY * 1.65,
      this.browserWidth / 1.3,
      headerY * 1.5,
      this.browserWidth,
      headerY * 1.75,
    );
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(0, headerY * 1.65);
    this.ctx.bezierCurveTo(
      this.browserWidth / 5,
      headerY * 1.48,
      this.browserWidth / 5,
      headerY * 1.7,
      this.browserWidth / 2,
      headerY * 1.66,
    );
    this.ctx.bezierCurveTo(
      this.browserWidth / 1.2,
      headerY * 1.58,
      this.browserWidth / 1.4,
      headerY * 1.5,
      this.browserWidth,
      headerY * 1.7,
    );
    this.ctx.stroke();

    // circle
    this.ctx.strokeStyle = token
      ? token === Token.EL
        ? '#3679B5'
        : token === 'LP'
        ? '#F9AE19'
        : '#00BFFF'
      : color;
    this.ctx.beginPath();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.moveTo(this.browserWidth / 7 + 10, headerY * 1.6);
    this.ctx.arc(this.browserWidth / 7, headerY * 1.6, 7, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 1.44 + 5, headerY * 1.595);
    this.ctx.arc(this.browserWidth / 1.44, headerY * 1.595, 5, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 3 + 10, headerY * 1.65);
    this.ctx.arc(this.browserWidth / 3, headerY * 1.65, 8, 0, Math.PI * 2);

    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = token
      ? token === Token.EL
        ? '#3679B5'
        : token === 'LP'
        ? '#627EEA'
        : '#00BFFF'
      : color;

    this.ctx.moveTo(this.browserWidth / 1.55 + 10, headerY * 1.62);
    this.ctx.arc(this.browserWidth / 1.55, headerY * 1.62, 7, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 10 + 5, headerY * 1.627);
    this.ctx.arc(this.browserWidth / 10, headerY * 1.627, 5, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 1.18 + 10, headerY * 1.625);
    this.ctx.arc(this.browserWidth / 1.18, headerY * 1.625, 8, 0, Math.PI * 2);

    this.ctx.fill();

    this.ctx.stroke();
  }

  drawOnNFTDetailPages(
    headerY: number,
    color: TokenColors,
    browserHeghit: number,
    isBackgroundColor: boolean,
    token?: string,
  ): void {
    this.ctx.fillStyle = 'rgba(247, 251, 255, 1)';
    this.ctx.strokeStyle = color;

    this.ctx.beginPath();
    this.ctx.moveTo(0, headerY / 0.8);
    this.ctx.lineTo(this.browserWidth, headerY / 0.8);
    if (isBackgroundColor) {
      this.ctx.lineTo(this.browserWidth, browserHeghit - 150);
      this.ctx.bezierCurveTo(
        this.browserWidth / 1.2,
        browserHeghit - 330,
        this.browserWidth / 1.3,
        browserHeghit - 84,
        this.browserWidth / 2,
        browserHeghit - 94,
      );
      this.ctx.bezierCurveTo(
        this.browserWidth / 2.7,
        browserHeghit - 105,
        this.browserWidth / 3,
        browserHeghit - 250,
        0,
        browserHeghit - 190,
      );
      this.ctx.closePath();
      this.ctx.fill();

      // this.ctx.beginPath();
      this.ctx.moveTo(0, browserHeghit - 165);
      this.ctx.bezierCurveTo(
        this.browserWidth / 3,
        browserHeghit - 300,
        this.browserWidth / 4,
        browserHeghit - 70,
        this.browserWidth / 1.68,
        browserHeghit - 100,
      );
      this.ctx.bezierCurveTo(
        this.browserWidth / 1.11,
        browserHeghit - 210,
        this.browserWidth / 1.19,
        browserHeghit - 240,
        this.browserWidth,
        browserHeghit - 170,
      );
    }
    this.ctx.stroke();

    // circle
    if (isBackgroundColor) {
      this.ctx.strokeStyle = token
        ? token === Token.EL
          ? '#3679B5'
          : token === 'LP'
          ? '#F9AE19'
          : '#00BFFF'
        : color;
      this.ctx.beginPath();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.moveTo(this.browserWidth / 7 + 10, browserHeghit - 204.5);
      this.ctx.arc(
        this.browserWidth / 7,
        browserHeghit - 204.5,
        10,
        0,
        Math.PI * 2,
      );

      this.ctx.moveTo(this.browserWidth / 1.64 + 5, browserHeghit - 104.5);
      this.ctx.arc(
        this.browserWidth / 1.64,
        browserHeghit - 104.5,
        5,
        0,
        Math.PI * 2,
      );

      this.ctx.moveTo(this.browserWidth / 3 + 10, browserHeghit - 167);
      this.ctx.arc(
        this.browserWidth / 3,
        browserHeghit - 167,
        10,
        0,
        Math.PI * 2,
      );

      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.strokeStyle = token
        ? token === Token.EL
          ? '#3679B5'
          : token === 'LP'
          ? '#627EEA'
          : '#00BFFF'
        : color;

      this.ctx.moveTo(this.browserWidth / 1.7 + 10, browserHeghit - 101);
      this.ctx.arc(
        this.browserWidth / 1.7,
        browserHeghit - 101,
        10,
        0,
        Math.PI * 2,
      );

      this.ctx.moveTo(this.browserWidth / 7.58 + 5, browserHeghit - 210);
      this.ctx.arc(
        this.browserWidth / 7.58,
        browserHeghit - 210,
        5,
        0,
        Math.PI * 2,
      );

      this.ctx.moveTo(this.browserWidth / 1.18 + 10, browserHeghit - 203);
      this.ctx.arc(
        this.browserWidth / 1.18,
        browserHeghit - 203,
        10,
        0,
        Math.PI * 2,
      );

      this.ctx.fill();

      this.ctx.stroke();
    }
  }
}

export default DrawWave;
