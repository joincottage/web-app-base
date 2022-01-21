import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import MoneyConfetti from 'src/components/MoneyConfetti';

interface OwnProps {
  show: boolean;
  handleClose(): void;
}

export default function OnboardingPrompt({ show, handleClose }: OwnProps) {
  const handleClickCompleteStripeOnboarding = () => {
    window.open('/api/stripe/account-link', '_self');
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={show}
      style={{ zIndex: 999999 }}
    >
      <DialogTitle id="simple-dialog-title">
        We need to know how to pay you first!
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Head over to Stripe so that we can connect to your bank.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClickCompleteStripeOnboarding}>
          Take me to Stripe
        </Button>
      </DialogActions>
      <MoneyConfetti />
    </Dialog>
  );
}
