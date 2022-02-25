import { useTranslation } from 'react-i18next';
import ModalButton from 'src/components/ModalButton';

const LoadingIndicator: React.FunctionComponent<{
  button?: string;
  isTxActive?: boolean;
  isApproveLoading?: boolean;
}> = ({ button, isTxActive, isApproveLoading }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="indicator">
        <div className="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {isTxActive && (
          <p>
            {' '}
            {isApproveLoading
              ? t('modal.indicator.loading_approve')
              : t('modal.indicator.loading_metamask')}
          </p>
        )}
      </div>
      {button && (
        <ModalButton
          className="modal__button disable"
          onClick={() => {}}
          content={button}
        />
      )}
    </>
  );
};

export default LoadingIndicator;
