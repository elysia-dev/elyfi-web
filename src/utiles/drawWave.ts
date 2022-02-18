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
    serviceGraphPageY: HTMLParagraphElement,
    auditPageY: HTMLParagraphElement,
    governancePageY: HTMLParagraphElement,
    isResize: boolean,
  ): void {
    const headerY = mainHeaderY.offsetTop;
    const mainMoblieY = mainHeaderMoblieY.offsetTop;
    const guidePageY = guideY.offsetTop;
    const serviceGraphY = serviceGraphPageY.offsetTop;
    const auditY = auditPageY.offsetTop;
    const governanceY = governancePageY.offsetTop + (isResize ? 0 : 300);
    const governanceBottomY = governancePageY.offsetHeight;

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
    this.ctx.lineTo(this.browserWidth, serviceGraphY * 0.9513);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      serviceGraphY * 1.0065,
      this.browserWidth / 1.5,
      serviceGraphY * 0.929,
      0,
      serviceGraphY * 0.992,
    );
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(0, serviceGraphY * 0.997);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      serviceGraphY * 0.9432,
      this.browserWidth / 1.4,
      serviceGraphY * 0.9972,
      this.browserWidth,
      serviceGraphY * 0.9538,
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

    this.ctx.moveTo(this.browserWidth / 4 + 10, serviceGraphY * 0.977);
    this.ctx.arc(
      this.browserWidth / 4,
      serviceGraphY * 0.977,
      10,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.moveTo(this.browserWidth / 3.8 + 5, serviceGraphY * 0.9714);
    this.ctx.arc(
      this.browserWidth / 3.8,
      serviceGraphY * 0.9714,
      5,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.stroke();

    // audit image
    this.ctx.beginPath();
    this.ctx.moveTo(0, auditY * 0.9605);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      auditY * 1.0117,
      this.browserWidth / 1.7,
      auditY * 0.9301,
      this.browserWidth,
      auditY * 0.9877,
    );

    this.ctx.moveTo(0, auditY * 0.966);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      auditY * 1.0045,
      this.browserWidth / 1.7,
      auditY * 0.9301,
      this.browserWidth,
      auditY * 0.995,
    );
    this.ctx.stroke();

    // circle
    this.ctx.beginPath();
    this.ctx.moveTo(this.browserWidth / 3 + 10, auditY * 0.978);
    this.ctx.arc(
      this.browserWidth / 3,
      auditY * 0.978,
      10,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 3.12 + 5, auditY * 0.9761);
    this.ctx.arc(
      this.browserWidth / 3.12,
      auditY * 0.9761,
      5,
      0,
      Math.PI * 2,
      true,
    );
    this.ctx.fill();

    this.ctx.stroke();

    // gorvernence
    this.ctx.beginPath();
    this.ctx.moveTo(0, governanceY * 0.9936);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      governanceY * 0.961,
      this.browserWidth / 1.7,
      governanceY * 1.001,
      this.browserWidth,
      governanceY * 0.9663,
    );
    this.ctx.stroke();
    this.ctx.fillStyle = 'rgba(247, 251, 255, 1)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, governanceY * 0.996);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      governanceY * 0.96,
      this.browserWidth / 1.7,
      governanceY * 1.001,
      this.browserWidth,
      governanceY * 0.9708,
    );
    this.ctx.lineTo(
      this.browserWidth,
      governanceY * 0.9708 + governanceBottomY + 220,
    );
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      governanceY * 0.9708 + governanceBottomY + 110,
      this.browserWidth / 1.7,
      governanceY * 0.9708 + governanceBottomY + 280,
      0,
      governanceY * 0.9708 + governanceBottomY + 280,
    );
    // this.ctx.lineTo(0, governanceY * 0.9708 + governanceBottomY + 220);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(0, governanceY * 0.9708 + governanceBottomY + 290);
    this.ctx.bezierCurveTo(
      this.browserWidth / 2,
      governanceY * 0.9708 + governanceBottomY + 290,
      this.browserWidth / 1.7,
      governanceY * 0.9708 + governanceBottomY + 100,
      this.browserWidth,
      governanceY * 0.9708 + governanceBottomY + 240,
    );

    this.ctx.stroke();
    // circle
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.moveTo(this.browserWidth / 3.2 + 10, governanceY * 0.9807);
    this.ctx.arc(
      this.browserWidth / 3.2,
      governanceY * 0.9807,
      10,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(this.browserWidth / 3.07 + 5, governanceY * 0.98);
    this.ctx.arc(
      this.browserWidth / 3.07,
      governanceY * 0.98,
      5,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(
      this.browserWidth / 2.5 + 10,
      governanceY * 0.9708 + governanceBottomY + 243,
    );
    this.ctx.arc(
      this.browserWidth / 2.5,
      governanceY * 0.9708 + governanceBottomY + 243,
      10,
      0,
      Math.PI * 2,
      true,
    );

    this.ctx.moveTo(
      this.browserWidth / 2.6 + 5,
      governanceY * 0.9708 + governanceBottomY + 256,
    );
    this.ctx.arc(
      this.browserWidth / 2.6,
      governanceY * 0.9708 + governanceBottomY + 256,
      5,
      0,
      Math.PI * 2,
      true,
    );

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
    this.ctx.moveTo(0, headerY * 1.5);
    this.ctx.bezierCurveTo(
      this.browserWidth / 5,
      headerY * 0.7,
      this.browserWidth / 5,
      headerY * 1.7,
      this.browserWidth / 2,
      headerY * 1.7,
    );
    this.ctx.bezierCurveTo(
      this.browserWidth / 1.3,
      headerY * 1.7,
      this.browserWidth / 1.3,
      headerY * 0.55,
      this.browserWidth,
      headerY * 1.6,
    );
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(0, headerY * 1.6);
    this.ctx.bezierCurveTo(
      this.browserWidth / 5,
      headerY * 0.58,
      this.browserWidth / 5,
      headerY * 1.7,
      this.browserWidth / 2,
      headerY * 1.7,
    );
    this.ctx.bezierCurveTo(
      this.browserWidth / 1.2,
      headerY * 1.63,
      this.browserWidth / 1.3,
      headerY * 0.8,
      this.browserWidth,
      headerY * 1.6,
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
    this.ctx.moveTo(this.browserWidth / 7 + 10, headerY * 1.185);
    this.ctx.arc(this.browserWidth / 7, headerY * 1.185, 10, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 1.46 + 5, headerY * 1.475);
    this.ctx.arc(this.browserWidth / 1.46, headerY * 1.475, 5, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 3 + 10, headerY * 1.56);
    this.ctx.arc(this.browserWidth / 3, headerY * 1.56, 10, 0, Math.PI * 2);

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

    this.ctx.moveTo(this.browserWidth / 1.5 + 10, headerY * 1.52);
    this.ctx.arc(this.browserWidth / 1.5, headerY * 1.52, 10, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 7.5 + 5, headerY * 1.25);
    this.ctx.arc(this.browserWidth / 7.5, headerY * 1.25, 5, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 1.18 + 10, headerY * 1.25);
    this.ctx.arc(this.browserWidth / 1.18, headerY * 1.25, 10, 0, Math.PI * 2);

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
    this.ctx.arc(this.browserWidth / 7, headerY * 1.6, 10, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 1.44 + 5, headerY * 1.595);
    this.ctx.arc(this.browserWidth / 1.44, headerY * 1.595, 5, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 3 + 10, headerY * 1.65);
    this.ctx.arc(this.browserWidth / 3, headerY * 1.65, 10, 0, Math.PI * 2);

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
    this.ctx.arc(this.browserWidth / 1.55, headerY * 1.62, 10, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 10 + 5, headerY * 1.627);
    this.ctx.arc(this.browserWidth / 10, headerY * 1.627, 5, 0, Math.PI * 2);

    this.ctx.moveTo(this.browserWidth / 1.18 + 10, headerY * 1.625);
    this.ctx.arc(this.browserWidth / 1.18, headerY * 1.625, 10, 0, Math.PI * 2);

    this.ctx.fill();

    this.ctx.stroke();
  }
}

export default DrawWave;
