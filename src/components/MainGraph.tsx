import { useTranslation } from "react-i18next"
import animationLine from 'src/components/AnimationLine';

const MainGraph = () => {
  const { t } = useTranslation();
  return (
    <div className="main__service__graph">
      <div className="main__service__graph--section01">
        <div className="main__service__graph--section01--01">
          <div className="main__service__graph--circle">
            <p>
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
            animationLine(6, "left")
          }
          </div>
          <div />
        </div>
        <div className="main__service__graph--section01--03">
          <div className="main__service__graph--circle">
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
            animationLine(8, "right")
          }
          </div>
          <div>

          </div>
          <div className="main__service__graph__line-wrapper">
          {
            animationLine(8, "left")
          }
          </div>
          <p>
            {t("main.graph.line-content.2")}
          </p>
        </div>
        <div className="main__service__graph--section01--05">
          <div className="main__service__graph--circle">
            <p className="blue bold">
              {t("main.graph.circle-content.2")}
            </p>
          </div>
        </div>
      </div>
      <div className="main__service__graph--section02">
        <div className="main__service__graph--section02--01">
          <div className="main__service__graph--section02--01--01">
            <div></div>
            <div className="main__service__graph__line-wrapper">
            {
              animationLine(2, "up")
            }
            </div>
            <div>

            </div>
            <div className="main__service__graph__line-wrapper">
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
            <div className="main__service__graph--circle">
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
              animationLine(4, "up")
            }
            </div>
          </div>
          <div className="main__service__graph__line-wrapper">
            {
              animationLine(8, "left")
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
  )
}

export default MainGraph;