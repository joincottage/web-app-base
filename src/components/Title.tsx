import Typography from '@material-ui/core/Typography';

interface TitleProps {
  children?: React.ReactNode;
}

export default function Title(props: TitleProps): JSX.Element {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}
