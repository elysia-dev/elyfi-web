import { useTranslation } from "react-i18next"
import animationLine from 'src/components/AnimationLine';
import MediaQuery from "src/enums/MediaQuery";
import useMediaQueryType from "src/hooks/useMediaQueryType";


const MainGraph = () => {
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();

  return (
    mediaQuery === MediaQuery.PC ? (
      <div className="main__service__graph">
        <div className="main__service__graph--section01">
          <div className="main__service__graph--section01--01">
            <div className="main__service__graph--circle circle_01">
              <p style={{transform: "scale(0.9)"}} >
                <span style={{ color: "#00A7FF" }}>*</span>
                {t("main.graph.circle-content.0")}
              </p>
            </div>
          </div>
          <div className="main__service__graph--section01--02">
            <div>
              <p>
                {t("main.graph.line-content.0")}
              </p>
            </div>
            <div className="main__service__graph__line-wrapper">
            {
              animationLine(8, "left")
            }
            </div>
            <div />
          </div>
          <div className="main__service__graph--section01--03">
            <div className="main__service__graph--circle circle_02">
              <p>
                {t("main.graph.circle-content.1")}
              </p>
            </div>
          </div>
          <div className="main__service__graph--section01--04">
            <p>
              {t("main.graph.line-content.1")}
            </p>
            <div className="main__service__graph__line-wrapper">
            {
              animationLine(10, "right")
            }
            </div>
            <div>

            </div>
            <div className="main__service__graph__line-wrapper"
              style={{
                position: "relative",
                left: -11,
                top: -3
              }}
            >
            {
              animationLine(10, "left")
            }
            </div>
            <p>
              {t("main.graph.line-content.2")}
            </p>
          </div>
          <div className="main__service__graph--section01--05">
            <div className="main__service__graph--circle circle_03">
              <div />
              <p className="blue bold">
                {t("main.graph.circle-content.2")}
              </p>
              <div />
            </div>
          </div>
        </div>
        <div className="main__service__graph--section02">
          <div className="main__service__graph--section02--01">
            <div className="main__service__graph--section02--01--01">
              <div></div>
              <div className="main__service__graph__line-wrapper"
                style={{
                  position: "relative",
                  top: 8
                }}>
              {
                animationLine(2, "up")
              }
              </div>
              <div>

              </div>
              <div className="main__service__graph__line-wrapper"
                style={{
                  top: 10
                }}>
              {
                animationLine(2, "down")
              }
              </div>
              <div>
                <p>
                  {t("main.graph.line-content.3")}
                </p>
              </div>
            </div>
            <div className="main__service__graph--section02--01--02">
              <div className="main__service__graph--circle circle_04">
                <p>
                  {t("main.graph.circle-content.3")}
                </p>
              </div>
            </div>
          </div>
          <div className="main__service__graph--section02--02">
            <div>
              <div />
              <div className="main__service__graph__line-wrapper">
              {
                animationLine(5, "up")
              }
              </div>
            </div>
            <div className="main__service__graph__line-wrapper">
              {
                animationLine(11, "left")
              }
            </div>
            <div>
              <div>
                <p>
                  {t("main.graph.line-content.4")}
                </p>
              </div>
              <div>

              </div>
            </div>
          </div>
        </div>
      </div>
    ) : mediaQuery === MediaQuery.Mobile ? (
      <div className="main__service__graph">
        <div className="main__service__graph--section01">
          <div className="main__service__graph--section01--01">
            <div className="main__service__graph--circle circle_01">
              <p>
                {t("main.graph.circle-content.3")}
              </p>
            </div>
            <div className="main__service__graph--section01--01--01">
              <div />
              {
                animationLine(1, "up")
              }
              {
                animationLine(1, "down")
              }
              <div>
                <p>
                  {t("main.graph.line-content.3")}
                </p>
              </div>
            </div>
            <div className="main__service__graph--circle circle_02">
              <p>
                <span style={{ color: "#00A7FF" }}>*</span>
                {t("main.graph.circle-content.0")}
              </p>
            </div>
            <div className="main__service__graph--section01--01--02">
              <div />
              {
                animationLine(1, "up")
              }
              <div>
                <p>
                  {t("main.graph.line-content.0")}
                </p>
              </div>
            </div>
            <div className="main__service__graph--circle circle_03">
              <p>
              { t("main.graph.circle-content.1")}
              </p>
            </div>
          </div>

          <div className="main__service__graph--section01--02">
            <div>
              {
                animationLine(1, "left")
              }
              <div className="scroll-arrow temp">
                {
                  Array(61).fill(0).map((_x) => {
                    return <span className="arrow--00" />
                  })
                }
              </div>
              <div style={{
                position: "relative",
                top: -9
              }}>
              {
                animationLine(1, "left")
              }
              </div>
            </div>
            <div className="main__service__graph--section01--02--01">
              <p>
                {t("main.graph.line-content.4")}
              </p>
            </div>
          </div>
        </div>

        <div className="main__service__graph--section02">
          <div className="main__service__graph--section02--01">
            <div>
              <p>
                {t("main.graph.line-content.2")}
              </p>
            </div>
            {
              animationLine(1, "up")
            }
            {
              animationLine(1, "down")
            }
            <div>
              <p>
              {t("main.graph.line-content.1")}
              </p>
            </div>
          </div>
          <div className="main__service__graph--circle circle_04">
            <div />
            <p className="blue bold">
              {t("main.graph.circle-content.2")}
            </p>
            <div />
          </div>
        </div>
      </div>
    ) : (<></>)
  )
}

export default MainGraph;