import { fireEvent, render, screen } from '@testing-library/react';
import ClaimDisableModal from './ClaimDisableModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('ClaimDisableModal', () => {
  test('close modal', () => {
    const onClose = jest.fn();

    render(<ClaimDisableModal visible={true} onClose={onClose} />);

    const closeBtn = screen.getByText('modal.claim_disable.button');
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith();
  });
});
