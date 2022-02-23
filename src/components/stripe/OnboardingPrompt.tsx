import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
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
        {/* TODO: Actually save the task via a query param in the return URL */}
        <DialogContentText>
          Head over to Stripe so that we can connect to your bank. We&apos;ll
          save this task for you in the meantime.
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
